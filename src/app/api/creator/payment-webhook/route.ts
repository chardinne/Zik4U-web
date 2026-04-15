import { type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createServiceClient } from '@/lib/supabase-server';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_DIRECT_PAYMENT_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return Response.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const raw = await request.text();
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const {
    payment_id,
    creator_id,
    fan_id,
    payment_type,
    post_id,
    pulse_room_id,
  } = session.metadata ?? {};

  if (!payment_id) return Response.json({ received: true });

  const supabase = createServiceClient();

  // Idempotency check: skip if already paid — keyed on stripe_session_id (UNIQUE)
  // Handles Stripe replay on network timeout; safe even if metadata.payment_id is absent
  const { data: existing } = await supabase
    .from('creator_direct_payments')
    .select('status')
    .eq('stripe_session_id', session.id)
    .single();

  if (existing?.status === 'paid') {
    return Response.json({ ok: true, idempotent: true });
  }

  // 1. Marquer le paiement comme paid (double safety: .eq status=pending)
  const { error: updateError } = await supabase
    .from('creator_direct_payments')
    .update({
      status: 'paid',
      stripe_payment_intent: session.payment_intent as string,
      stripe_session_id: session.id,
      paid_at: new Date().toISOString(),
    })
    .eq('id', payment_id)
    .eq('status', 'pending');

  if (updateError) {
    console.error('[payment-webhook] Update failed:', updateError.message);
    return Response.json({ error: 'DB update failed' }, { status: 500 });
  }

  // 2. Enregistrer dans financial_events
  const amount = (session.amount_total ?? 0) / 100;
  const fees = Math.round((amount * 0.029 + 0.30) * 100) / 100;
  const net = Math.round((amount - fees) * 100) / 100;

  await supabase.from('financial_events').insert({
    event_type:         `direct_${payment_type}`,
    source:             'stripe',
    amount_usd:         amount,
    platform_share_usd: Math.round(net * 0.30 * 100) / 100,
    creator_share_usd:  Math.round(net * 0.70 * 100) / 100,
    fees_usd:           fees,
    net_usd:            net,
    payment_channel:    'web',
    plan:               payment_type,
    external_id:        session.id,
  });

  // 3. Actions spécifiques par type
  if (payment_type === 'tip' && fan_id && creator_id) {
    // Envoyer un message automatique "tip reçu" dans la conversation
    const conversationId = session.metadata?.conversation_id ?? '';
    const { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .single();

    if (conv) {
      const fanAmount = Math.round(amount * 100) / 100;
      await supabase.from('messages').insert({
        conversation_id: conv.id,
        sender_id: fan_id,
        content: `💸 Tip envoyé : $${fanAmount}`,
        type: 'text',
      });
    }
  }

  if (payment_type === 'pulse_session' && pulse_room_id) {
    // Vérifier si la room a atteint sa capacité payante
    const { count } = await supabase
      .from('creator_direct_payments')
      .select('*', { count: 'exact', head: true })
      .eq('pulse_room_id', pulse_room_id)
      .eq('status', 'paid');

    const { data: room } = await supabase
      .from('pulse_rooms')
      .select('max_participants, status')
      .eq('id', pulse_room_id)
      .single();

    // Room capacity reached — no action needed (access control via has_pulse_access RPC)
  }

  return Response.json({ received: true });
}
