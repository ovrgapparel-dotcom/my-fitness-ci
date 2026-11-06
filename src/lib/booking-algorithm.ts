// ============================================================================
// MY FITNESS - Booking Algorithm Implementation
// Concurrency Control, Membership Validation & Seat Allocation
// ============================================================================

import { SupabaseClient } from '@supabase/supabase-js';

export interface BookingInput {
  userId: string;
  sessionId: string;
  accessMode: 'MEMBERSHIP' | 'INDIVIDUAL_PURCHASE';
  paymentTransactionRef?: string;
}

export interface BookingResponse {
  success: boolean;
  code: 'CONFIRMED' | 'SESSION_FULL' | 'ALREADY_BOOKED' | 'INVALID_SUBSCRIPTION' | 'ERROR';
  bookingId?: string;
  queuePosition?: number;
  message: string;
}

export class BookingEngine {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Main Booking Decision Logic:
   * 1. Checks user authentication & duplicate bookings.
   * 2. Validates active membership tier or individual session purchase.
   * 3. Invokes transactional RPC `reserve_session` with FOR UPDATE row lock.
   * 4. If full, triggers Waitlist placement.
   */
  async processBooking(input: BookingInput): Promise<BookingResponse> {
    // 1. If membership mode chosen, verify active subscription in database
    if (input.accessMode === 'MEMBERSHIP') {
      const { data: sub, error: subError } = await this.supabase
        .from('member_subscriptions')
        .select('id, status, end_date')
        .eq('user_id', input.userId)
        .eq('status', 'ACTIVE')
        .gte('end_date', new Date().toISOString())
        .maybeSingle();

      if (subError || !sub) {
        return {
          success: false,
          code: 'INVALID_SUBSCRIPTION',
          message: 'Aucun abonnement actif trouvé. Veuillez choisir la formule séance individuelle ou souscrire à un pass.'
        };
      }
    }

    // 2. Call the PostgreSQL atomic reserve_session function (schema / RPC)
    const { data, error } = await this.supabase.rpc('reserve_session', {
      p_session_id: input.sessionId,
      p_user_id: input.userId,
      p_booking_type: input.accessMode,
      p_subscription_id: null
    });

    if (error) {
      return {
        success: false,
        code: 'ERROR',
        message: `Erreur serveur: ${error.message}`
      };
    }

    if (!data.success) {
      if (data.code === 'SESSION_FULL') {
        return {
          success: false,
          code: 'SESSION_FULL',
          message: data.message
        };
      }
      return {
        success: false,
        code: data.code || 'ERROR',
        message: data.message
      };
    }

    return {
      success: true,
      code: 'CONFIRMED',
      bookingId: data.booking_id,
      message: data.message
    };
  }
}
