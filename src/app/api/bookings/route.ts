import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, userId, bookingType, subscriptionId } = body;

    if (!sessionId || !userId || !bookingType) {
      return NextResponse.json(
        { error: 'Paramètres manquants (sessionId, userId, bookingType requis)' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Call atomic PostgreSQL function reserve_session
    const { data, error } = await supabase.rpc('reserve_session', {
      p_session_id: sessionId,
      p_user_id: userId,
      p_booking_type: bookingType, // 'MEMBERSHIP', 'INDIVIDUAL_PURCHASE', 'SESSION_CREDIT'
      p_subscription_id: subscriptionId || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
