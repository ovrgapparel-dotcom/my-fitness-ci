import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, userId } = body;

    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants (bookingId, userId requis)' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Call atomic PostgreSQL cancellation function (12h cutoff, credit refund, 1h waitlist offer)
    const { data, error } = await supabase.rpc('cancel_booking', {
      p_booking_id: bookingId,
      p_user_id: userId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
