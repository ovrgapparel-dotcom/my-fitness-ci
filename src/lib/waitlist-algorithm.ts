// ============================================================================
// MY FITNESS - Waitlist & Cancellation Engine
// FIFO Queue, 12-Hour Cutoff Enforcement & Dynamic Seat Reallocation
// ============================================================================

import { SupabaseClient } from '@supabase/supabase-js';

export interface CancellationResult {
  success: boolean;
  isLateCancellation: boolean;
  hoursBeforeSession: number;
  waitlistMemberNotified: boolean;
  message: string;
}

export class WaitlistEngine {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Enforces the 12-hour cancellation rule:
   * - If canceled >= 12h: Free cancellation, seat released, next waitlist candidate claimed.
   * - If canceled < 12h: Late cancellation recorded, seat may be penalized or released without refund.
   */
  async cancelReservation(bookingId: string, userId: string): Promise<CancellationResult> {
    const { data, error } = await this.supabase.rpc('cancel_booking', {
      p_booking_id: bookingId,
      p_user_id: userId
    });

    if (error) {
      throw new Error(`Erreur lors de l'annulation: ${error.message}`);
    }

    return {
      success: data.success,
      isLateCancellation: data.is_late_cancellation,
      hoursBeforeSession: data.hours_before_session,
      waitlistMemberNotified: data.waitlist_member_notified,
      message: data.message
    };
  }

  /**
   * Adds user to FIFO waitlist queue
   */
  async joinWaitlist(sessionId: string, userId: string) {
    const { data, error } = await this.supabase.rpc('join_waitlist', {
      p_session_id: sessionId,
      p_user_id: userId
    });

    if (error) throw new Error(error.message);
    return data;
  }
}
