-- ============================================================================
-- MY FITNESS - Supabase Seed Script: Full Year 2026 Schedule (Sept - Dec 2026)
-- Generates recurring sessions from Sept 1, 2026 through Dec 31, 2026
-- ============================================================================

DO $$
DECLARE
    v_start_date DATE := '2026-08-31'; -- Monday
    v_end_date DATE := '2026-12-31';   -- Thursday
    v_current_date DATE;
    v_dow INT;
    v_studio_fonctionnel UUID;
    v_studio_collectifs UUID;
    v_studio_biking UUID;
    v_coach_kramo UUID;
    v_coach_soleil UUID;
    v_coach_ismael UUID;
    v_coach_didier UUID;
    v_coach_kante UUID;
    v_coach_prive UUID;
    v_coach_virtuel UUID;
BEGIN
    -- Fetch Studio IDs
    SELECT id INTO v_studio_fonctionnel FROM studios WHERE name = 'Studio Fonctionnel' LIMIT 1;
    SELECT id INTO v_studio_collectifs FROM studios WHERE name = 'Cours Collectifs' LIMIT 1;
    SELECT id INTO v_studio_biking FROM studios WHERE name = 'Studio Biking' LIMIT 1;

    -- Fetch Trainer IDs
    SELECT id INTO v_coach_kramo FROM trainers WHERE full_name = 'Kramo' LIMIT 1;
    SELECT id INTO v_coach_soleil FROM trainers WHERE full_name = 'Soleil' LIMIT 1;
    SELECT id INTO v_coach_ismael FROM trainers WHERE full_name = 'Ismael' LIMIT 1;
    SELECT id INTO v_coach_didier FROM trainers WHERE full_name = 'Didier' LIMIT 1;
    SELECT id INTO v_coach_kante FROM trainers WHERE full_name = 'Kante' LIMIT 1;
    SELECT id INTO v_coach_prive FROM trainers WHERE full_name = 'Privé' LIMIT 1;
    SELECT id INTO v_coach_virtuel FROM trainers WHERE full_name = 'Virtuel' LIMIT 1;

    -- Iterate daily through Dec 31, 2026
    v_current_date := v_start_date;
    WHILE v_current_date <= v_end_date LOOP
        v_dow := EXTRACT(DOW FROM v_current_date); -- 0 = Sun, 1 = Mon ... 6 = Sat

        -- Skip Sundays (Gym maintenance)
        IF v_dow != 0 AND v_current_date >= '2026-09-01' THEN
            -- Monday sessions
            IF v_dow = 1 THEN
                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 06:30:00')::timestamptz, (v_current_date || ' 07:30:00')::timestamptz, 15, 10, 10000 FROM training_types WHERE name = 'Suspension T';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_kramo, (v_current_date || ' 09:30:00')::timestamptz, (v_current_date || ' 10:30:00')::timestamptz, 25, 20, 10000 FROM training_types WHERE name = 'Pilates';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_soleil, (v_current_date || ' 12:30:00')::timestamptz, (v_current_date || ' 13:30:00')::timestamptz, 15, 12, 12000 FROM training_types WHERE name = 'Cross T.';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_ismael, (v_current_date || ' 17:30:00')::timestamptz, (v_current_date || ' 18:30:00')::timestamptz, 15, 8, 10000 FROM training_types WHERE name = 'Suspension T';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 19:00:00')::timestamptz, (v_current_date || ' 20:00:00')::timestamptz, 12, 10, 12000 FROM training_types WHERE name = 'Fight T.';
            END IF;

            -- Tuesday sessions
            IF v_dow = 2 THEN
                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_didier, (v_current_date || ' 06:30:00')::timestamptz, (v_current_date || ' 07:30:00')::timestamptz, 25, 15, 10000 FROM training_types WHERE name = 'Yoga - Pilates';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_biking, v_coach_virtuel, (v_current_date || ' 12:30:00')::timestamptz, (v_current_date || ' 13:15:00')::timestamptz, 20, 18, 10000 FROM training_types WHERE name = 'Biking';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 18:00:00')::timestamptz, (v_current_date || ' 19:00:00')::timestamptz, 15, 14, 12000 FROM training_types WHERE name = 'Cross T.';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_virtuel, (v_current_date || ' 19:30:00')::timestamptz, (v_current_date || ' 20:30:00')::timestamptz, 12, 8, 12000 FROM training_types WHERE name = 'Fight T.';
            END IF;

            -- Wednesday sessions
            IF v_dow = 3 THEN
                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 06:30:00')::timestamptz, (v_current_date || ' 07:30:00')::timestamptz, 15, 10, 12000 FROM training_types WHERE name = 'Cross T.';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_prive, (v_current_date || ' 09:30:00')::timestamptz, (v_current_date || ' 10:30:00')::timestamptz, 20, 14, 15000 FROM training_types WHERE name = 'Danse Classique';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_ismael, (v_current_date || ' 18:00:00')::timestamptz, (v_current_date || ' 19:00:00')::timestamptz, 15, 7, 10000 FROM training_types WHERE name = 'Suspension T';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_prive, (v_current_date || ' 19:30:00')::timestamptz, (v_current_date || ' 20:30:00')::timestamptz, 25, 16, 12000 FROM training_types WHERE name = 'Kizomba';
            END IF;

            -- Thursday sessions
            IF v_dow = 4 THEN
                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_didier, (v_current_date || ' 06:30:00')::timestamptz, (v_current_date || ' 07:15:00')::timestamptz, 25, 12, 8000 FROM training_types WHERE name = 'Stretching';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 12:30:00')::timestamptz, (v_current_date || ' 13:30:00')::timestamptz, 15, 13, 12000 FROM training_types WHERE name = 'Cross T.';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_kante, (v_current_date || ' 18:00:00')::timestamptz, (v_current_date || ' 19:00:00')::timestamptz, 25, 19, 10000 FROM training_types WHERE name = 'Body Sculpt';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 19:30:00')::timestamptz, (v_current_date || ' 20:30:00')::timestamptz, 12, 11, 12000 FROM training_types WHERE name = 'Fight T.';
            END IF;

            -- Friday sessions
            IF v_dow = 5 THEN
                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_didier, (v_current_date || ' 06:30:00')::timestamptz, (v_current_date || ' 07:15:00')::timestamptz, 15, 11, 10000 FROM training_types WHERE name = 'HIIT T.';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_kramo, (v_current_date || ' 09:30:00')::timestamptz, (v_current_date || ' 10:30:00')::timestamptz, 25, 15, 10000 FROM training_types WHERE name = 'Yoga - Pilates';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_biking, v_coach_didier, (v_current_date || ' 12:30:00')::timestamptz, (v_current_date || ' 13:15:00')::timestamptz, 20, 17, 10000 FROM training_types WHERE name = 'Biking';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_ismael, (v_current_date || ' 18:00:00')::timestamptz, (v_current_date || ' 19:00:00')::timestamptz, 25, 20, 10000 FROM training_types WHERE name = 'Pilates';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kante, (v_current_date || ' 19:30:00')::timestamptz, (v_current_date || ' 20:30:00')::timestamptz, 15, 13, 12000 FROM training_types WHERE name = 'Cross T.';
            END IF;

            -- Saturday sessions
            IF v_dow = 6 THEN
                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_prive, (v_current_date || ' 09:30:00')::timestamptz, (v_current_date || ' 10:30:00')::timestamptz, 20, 17, 12000 FROM training_types WHERE name = 'Stretching - Danse';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_collectifs, v_coach_soleil, (v_current_date || ' 12:30:00')::timestamptz, (v_current_date || ' 13:30:00')::timestamptz, 20, 15, 10000 FROM training_types WHERE name = 'Gymnastique';

                INSERT INTO sessions (activity_id, studio_id, trainer_id, start_time, end_time, capacity, booked_seats, price_xof)
                SELECT id, v_studio_fonctionnel, v_coach_kramo, (v_current_date || ' 18:00:00')::timestamptz, (v_current_date || ' 19:00:00')::timestamptz, 12, 10, 12000 FROM training_types WHERE name = 'Fight T.';
            END IF;
        END IF;

        v_current_date := v_current_date + INTERVAL '1 day';
    END LOOP;
END $$;
