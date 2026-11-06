import { NextResponse } from 'next/server';
import { PaymentOrchestrator } from '@/lib/payment-orchestrator';
import { getServiceSupabase } from '@/lib/supabase';

const orchestrator = new PaymentOrchestrator();

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as any;
    const signature = request.headers.get('x-signature') || request.headers.get('wave-signature') || '';
    const payload = await request.json();

    const supabase = getServiceSupabase();

    // 1. Verify webhook signature and status via provider adapter
    const adapter = (orchestrator as any).adapters?.get(provider);
    if (!adapter) {
      return NextResponse.json({ error: 'Fournisseur inconnu' }, { status: 400 });
    }

    const verifiedResult = await adapter.processWebhook(payload, signature);

    if (!verifiedResult.verified) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }

    // 2. Update transaction status in Supabase
    const { data: tx, error: txError } = await supabase
      .from('payment_transactions')
      .update({
        status: verifiedResult.status,
        provider_transaction_ref: verifiedResult.providerReference,
        verified_at: new Date().toISOString(),
      })
      .eq('idempotency_key', verifiedResult.transactionId)
      .select()
      .single();

    if (txError || !tx) {
      return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 });
    }

    // 3. If SUCCEEDED, confirm seat or activate subscription
    if (verifiedResult.status === 'SUCCEEDED') {
      if (tx.purchase_type === 'SESSION_PASS') {
        // Confirm seat reservation
        await supabase.rpc('reserve_session', {
          p_session_id: tx.purchase_reference,
          p_user_id: tx.user_id,
          p_booking_type: 'INDIVIDUAL_PURCHASE',
        });
      } else if (tx.purchase_type === 'MEMBERSHIP') {
        // Activate subscription
        await supabase.from('member_subscriptions').insert({
          user_id: tx.user_id,
          plan_id: tx.purchase_reference,
          status: 'ACTIVE',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    return NextResponse.json({ received: true, status: verifiedResult.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
