-- ============================================================================
-- MY FITNESS - Transactional Booking & Waitlist Algorithms (PostgreSQL RPC)
-- Prevents overbooking race conditions, enforces 12h cancellation,
-- and automates FIFO waitlist progression.
-- ============================================================================

-- Function 1: Concurrency-Safe Session Reservation
CREATE OR REPLACE FUNCTION reserve_session(
    p_session_id UUID,
    p_user_id UUID,
    p_booking_type TEXT, -- 'MEMBERSHIP', 'INDIVIDUAL_PURCHASE', or 'SESSION_CREDIT'
    p_subscription_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
    v_existing_booking UUID;
    v_new_booking_id UUID;
    v_available_credits INT;
    v_credit_record_id UUID;
BEGIN
    -- 1. Check if user already booked this session
    SELECT id INTO v_existing_booking 
    FROM bookings 
    WHERE session_id = p_session_id 
      AND user_id = p_user_id 
      AND status = 'CONFIRMED';

    IF v_existing_booking IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'ALREADY_BOOKED',
            'message', 'Vous avez déjà une réservation confirmée pour ce cours.'
        );
    END IF;

    -- 2. If using session credit, check and spend 1 credit
    IF p_booking_type = 'SESSION_CREDIT' THEN
        SELECT id INTO v_credit_record_id
        FROM member_credits
        WHERE user_id = p_user_id AND amount > 0 AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE;

        IF v_credit_record_id IS NULL THEN
            RETURN jsonb_build_object(
                'success', false,
                'code', 'NO_CREDITS_AVAILABLE',
                'message', 'Solde de crédits insuffisant. Veuillez recharger ou payer par Mobile Money.'
            );
        END IF;

        -- Deduct 1 credit
        UPDATE member_credits
        SET amount = amount - 1
        WHERE id = v_credit_record_id;
    END IF;

    -- 3. Lock the session row FOR UPDATE to prevent race conditions & overbooking
    SELECT * INTO v_session
    FROM sessions
    WHERE id = p_session_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'SESSION_NOT_FOUND',
            'message', 'Séance introuvable.'
        );
    END IF;

    IF v_session.is_cancelled THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'SESSION_CANCELLED',
            'message', 'Cette séance a été annulée par le club.'
        );
    END IF;

    -- 4. Check seat capacity (respects custom capacity override if configured)
    IF v_session.booked_seats >= v_session.capacity THEN
        -- If session credit was deducted, rollback credit
        IF p_booking_type = 'SESSION_CREDIT' AND v_credit_record_id IS NOT NULL THEN
            UPDATE member_credits SET amount = amount + 1 WHERE id = v_credit_record_id;
        END IF;

        RETURN jsonb_build_object(
            'success', false,
            'code', 'SESSION_FULL',
            'capacity', v_session.capacity,
            'booked', v_session.booked_seats,
            'message', 'La séance est complète. Vous pouvez rejoindre la liste d''attente.'
        );
    END IF;

    -- 5. Allocate seat & increment counter atomically
    UPDATE sessions
    SET booked_seats = booked_seats + 1,
        updated_at = NOW()
    WHERE id = p_session_id;

    -- 6. Insert confirmed booking record
    INSERT INTO bookings (
        session_id,
        user_id,
        subscription_id,
        status,
        booking_type
    ) VALUES (
        p_session_id,
        p_user_id,
        p_subscription_id,
        'CONFIRMED',
        p_booking_type
    ) RETURNING id INTO v_new_booking_id;

    -- 7. Remove user from waitlist if they were on it
    DELETE FROM waitlist
    WHERE session_id = p_session_id AND user_id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_new_booking_id,
        'booked_seats', v_session.booked_seats + 1,
        'capacity', v_session.capacity,
        'message', 'Votre place est confirmée avec succès !'
    );
END;
$$;


-- Function 2: Join Waitlist Queue
CREATE OR REPLACE FUNCTION join_waitlist(
    p_session_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_next_position INT;
    v_existing_waitlist UUID;
    v_already_booked UUID;
BEGIN
    -- Check if already booked
    SELECT id INTO v_already_booked
    FROM bookings
    WHERE session_id = p_session_id AND user_id = p_user_id AND status = 'CONFIRMED';

    IF v_already_booked IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'ALREADY_BOOKED',
            'message', 'Vous avez déjà une place confirmée.'
        );
    END IF;

    -- Check if already on waitlist
    SELECT id INTO v_existing_waitlist
    FROM waitlist
    WHERE session_id = p_session_id AND user_id = p_user_id AND status = 'WAITING';

    IF v_existing_waitlist IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'ALREADY_IN_WAITLIST',
            'message', 'Vous êtes déjà inscrit sur la liste d''attente.'
        );
    END IF;

    -- Calculate next position in queue (FIFO)
    SELECT COALESCE(MAX(queue_position), 0) + 1 INTO v_next_position
    FROM waitlist
    WHERE session_id = p_session_id;

    INSERT INTO waitlist (session_id, user_id, queue_position, status)
    VALUES (p_session_id, p_user_id, v_next_position, 'WAITING');

    RETURN jsonb_build_object(
        'success', true,
        'queue_position', v_next_position,
        'message', 'Vous avez été ajouté à la liste d''attente en position ' || v_next_position || '.'
    );
END;
$$;


-- Function 3: Cancel Booking with 12-Hour Cutoff & Auto-Waitlist Reallocation
CREATE OR REPLACE FUNCTION cancel_booking(
    p_booking_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking RECORD;
    v_session RECORD;
    v_cutoff_hours INT := 12;
    v_hours_until_start NUMERIC;
    v_is_late BOOLEAN := FALSE;
    v_next_waitlist RECORD;
    v_offer_minutes INT := 60; -- Updated to 1 hour (60 minutes) per gym specification
    v_credit_granted BOOLEAN := FALSE;
BEGIN
    -- 1. Fetch booking
    SELECT * INTO v_booking
    FROM bookings
    WHERE id = p_booking_id AND user_id = p_user_id AND status = 'CONFIRMED';

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'BOOKING_NOT_FOUND',
            'message', 'Réservation introuvable ou déjà annulée.'
        );
    END IF;

    -- 2. Fetch session and lock row
    SELECT * INTO v_session
    FROM sessions
    WHERE id = v_booking.session_id
    FOR UPDATE;

    -- 3. Check 12-hour cancellation policy
    SELECT (EXTRACT(EPOCH FROM (v_session.start_time - NOW())) / 3600) INTO v_hours_until_start;

    IF v_hours_until_start < v_cutoff_hours THEN
        v_is_late := TRUE;
    END IF;

    -- 4. Update booking status
    UPDATE bookings
    SET status = CASE WHEN v_is_late THEN 'LATE_CANCELLED'::booking_status ELSE 'CANCELLED'::booking_status END,
        cancelled_at = NOW(),
        cancellation_reason = CASE WHEN v_is_late THEN 'Annulation tardive (< 12h avant séance)' ELSE 'Annulation standard client' END
    WHERE id = p_booking_id;

    -- 5. Decrement booked_seats atomically
    UPDATE sessions
    SET booked_seats = GREATEST(booked_seats - 1, 0),
        updated_at = NOW()
    WHERE id = v_session.id;

    -- 6. Issue Session Credit for paid cancellations >= 12h
    IF NOT v_is_late AND v_booking.booking_type IN ('INDIVIDUAL_PURCHASE', 'SESSION_CREDIT') THEN
        INSERT INTO member_credits (
            user_id,
            amount,
            source,
            reference_id,
            expires_at
        ) VALUES (
            p_user_id,
            1,
            'CANCELLATION_REFUND',
            p_booking_id,
            NOW() + INTERVAL '90 days' -- 90 days validity for session credits
        );
        v_credit_granted := TRUE;
    END IF;

    -- 7. Trigger Waitlist Reallocation: Find next in queue (FIFO)
    SELECT * INTO v_next_waitlist
    FROM waitlist
    WHERE session_id = v_session.id AND status = 'WAITING'
    ORDER BY queue_position ASC
    LIMIT 1;

    IF FOUND THEN
        -- Offer seat to next eligible member with a 1-hour expiry window
        UPDATE waitlist
        SET status = 'OFFERED',
            offered_at = NOW(),
            offer_expires_at = NOW() + (v_offer_minutes || ' minutes')::INTERVAL
        WHERE id = v_next_waitlist.id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'is_late_cancellation', v_is_late,
        'hours_before_session', ROUND(v_hours_until_start, 1),
        'session_credit_granted', v_credit_granted,
        'waitlist_member_notified', (v_next_waitlist.id IS NOT NULL),
        'waitlist_offer_expiry_minutes', v_offer_minutes,
        'message', CASE 
            WHEN v_is_late THEN 'Votre réservation a été annulée avec mention tardive (< 12h). Aucun crédit accordé.'
            WHEN v_credit_granted THEN 'Réservation annulée (>12h). 1 crédit de séance a été recrédité sur votre compte !'
            ELSE 'Votre réservation a été annulée avec succès et votre place a été libérée.'
        END
    );
END;
$$;
