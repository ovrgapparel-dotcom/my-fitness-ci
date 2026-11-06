import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, userId } = body;

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants (sessionId, userId requis)' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const { data, error } = await supabase.rpc('join_waitlist', {
      p_session_id: sessionId,
      p_user_id: userId,
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
