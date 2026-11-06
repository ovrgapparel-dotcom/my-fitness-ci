import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activity = searchParams.get('activity');
    const studio = searchParams.get('studio');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = getServiceSupabase();

    let query = supabase
      .from('sessions')
      .select(`
        id,
        start_time,
        end_time,
        capacity,
        booked_seats,
        price_xof,
        is_cancelled,
        training_types (id, name, category, color_hex),
        studios (id, name),
        trainers (id, full_name, nickname)
      `)
      .eq('is_cancelled', false)
      .order('start_time', { ascending: true });

    if (startDate) query = query.gte('start_time', startDate);
    if (endDate) query = query.lte('start_time', endDate);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format response with remaining seats and custom capacity status
    const formatted = (data || []).map((s: any) => ({
      id: s.id,
      startTime: s.start_time,
      endTime: s.end_time,
      activity: s.training_types?.name,
      color: s.training_types?.color_hex,
      studio: s.studios?.name,
      trainer: s.trainers?.full_name || s.trainers?.nickname,
      capacity: s.capacity,
      bookedSeats: s.booked_seats,
      availableSeats: Math.max(0, s.capacity - s.booked_seats),
      isFull: s.booked_seats >= s.capacity,
      priceXOF: s.price_xof,
    }));

    return NextResponse.json({ sessions: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
