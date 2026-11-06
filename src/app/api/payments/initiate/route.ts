import { NextResponse } from 'next/server';
import { PaymentOrchestrator } from '@/lib/payment-orchestrator';
import { PaymentRequest, PaymentProviderType } from '@/lib/types';
import { getServiceSupabase } from '@/lib/supabase';

const orchestrator = new PaymentOrchestrator();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerPhone,
      amountXOF,
      purchaseType,
      purchaseReference,
      provider,
    } = body;

    if (!userId || !customerPhone || !amountXOF || !purchaseReference || !provider) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants pour le paiement' },
        { status: 400 }
      );
    }

    const idempotencyKey = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const paymentRequest: PaymentRequest = {
      userId,
      customerName: customerName || 'Client MY FITNESS',
      customerPhone,
      amountXOF,
      purchaseType,
      purchaseReference,
      idempotencyKey,
      returnUrl: `${siteUrl}/payment/success`,
      cancelUrl: `${siteUrl}/payment/cancel`,
    };

    // Record initial transaction in Supabase
    const supabase = getServiceSupabase();
    await supabase.from('payment_transactions').insert({
      user_id: userId,
      purchase_type: purchaseType,
      purchase_reference: purchaseReference,
      amount_xof: amountXOF,
      provider: provider as PaymentProviderType,
      idempotency_key: idempotencyKey,
      status: 'CREATED',
      customer_phone: customerPhone,
    });

    // Execute provider checkout session via orchestrator adapter
    const result = await orchestrator.initiateCheckout(provider as PaymentProviderType, paymentRequest);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
