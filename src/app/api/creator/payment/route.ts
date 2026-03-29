import { type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// Stripe rate estimé
const STRIPE_RATE = 0.029;
const STRIPE_FIXED = 0.30;
const CREATOR_SHARE = 0.70;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS }); }

  const {
    creator_id,
    fan_id,
    payment_type,
    amount_usd,
    metadata = {},
    post_id,
    pulse_room_id,
    conversation_id,
  } = body as Record<string, string>;

  // Validation
  const validTypes = ['request', 'drop_unlock', 'pulse_session', 'tip'];
  if (!creator_id || !payment_type || !validTypes.includes(payment_type)) {
    return Response.json({ error: 'Invalid parameters' }, { status: 400, headers: CORS });
  }
  const amount = parseFloat(amount_usd);
  if (isNaN(amount) || amount < 1 || amount > 500) {
    return Response.json({ error: 'Amount must be between $1 and $500' }, { status: 400, headers: CORS });
  }

  const supabase = createServiceClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

  // Calculs 70/30
  const grossCents = Math.round(amount * 100);
  const feesCents = Math.round(grossCents * STRIPE_RATE + STRIPE_FIXED * 100);
  const netCents = grossCents - feesCents;
  const creatorShareCents = Math.round(netCents * CREATOR_SHARE);
  const platformShareCents = netCents - creatorShareCents;

  // Libellés par type
  const typeLabels: Record<string, string> = {
    request:       'Demande spéciale',
    drop_unlock:   'Drop exclusif',
    pulse_session: 'Session Pulse privée',
    tip:           'Tip',
  };

  try {
    // Récupérer infos créateur
    const { data: creator } = await supabase
      .from('users')
      .select('username, display_name')
      .eq('id', creator_id)
      .single();

    // Créer l'enregistrement en base (pending)
    const { data: payment, error: insertErr } = await supabase
      .from('creator_direct_payments')
      .insert({
        creator_id,
        fan_id: fan_id ?? null,
        payment_type,
        amount_usd: amount,
        creator_share_usd: creatorShareCents / 100,
        platform_share_usd: platformShareCents / 100,
        status: 'pending',
        metadata: (metadata as Record<string, unknown>) ?? {},
        post_id: post_id ?? null,
        pulse_room_id: pulse_room_id ?? null,
        conversation_id: conversation_id ?? null,
        expires_at: new Date(Date.now() + 48 * 3600_000).toISOString(),
      })
      .select('id')
      .single();

    if (insertErr || !payment) {
      return Response.json({ error: 'Database error' }, { status: 500, headers: CORS });
    }

    // Créer la Stripe Checkout Session (paiement unique)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: grossCents,
          product_data: {
            name: `${typeLabels[payment_type]} — @${creator?.username ?? creator_id}`,
            description: (metadata as Record<string, string>)?.description ?? undefined,
          },
        },
      }],
      metadata: {
        payment_id:    payment.id,
        creator_id,
        fan_id:        fan_id ?? '',
        payment_type,
        post_id:       post_id ?? '',
        pulse_room_id: pulse_room_id ?? '',
      },
      success_url: `${siteUrl}/pay/success?payment_id=${payment.id}&type=${payment_type}`,
      cancel_url:  `${siteUrl}/pay/cancel?payment_id=${payment.id}`,
      billing_address_collection: 'auto',
      allow_promotion_codes: false,
    });

    // Mettre à jour avec le session_id Stripe
    await supabase
      .from('creator_direct_payments')
      .update({ stripe_session_id: session.id })
      .eq('id', payment.id);

    return Response.json({
      url: session.url,
      payment_id: payment.id,
    }, { headers: CORS });

  } catch (err) {
    console.error('[creator/payment]', err);
    return Response.json({ error: 'Payment creation failed' }, { status: 500, headers: CORS });
  }
}
