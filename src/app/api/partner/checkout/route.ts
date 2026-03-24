import { type NextRequest } from 'next/server';
import { stripe, PRICE_IDS, type PartnerPlan, type BillingPeriod } from '@/lib/stripe-server';
import { createServiceClient } from '@/lib/supabase-server';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function generateApiKey(): string {
  return 'zik4u_live_' + randomBytes(24).toString('hex');
}

function getPriceId(plan: PartnerPlan, period: BillingPeriod): string {
  if (plan === 'enterprise') return PRICE_IDS.enterprise;
  return PRICE_IDS[plan][period];
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS_HEADERS });
  }

  const {
    plan,
    billing_period = 'monthly',
    company_name,
    contact_email,
    contact_name,
    website,
    company_number,
    phone,
    profile_type,
    message,
  } = body as Record<string, string>;

  // Validation
  if (!plan || !['insight', 'intelligence', 'enterprise'].includes(plan)) {
    return Response.json({ error: 'Invalid plan' }, { status: 400, headers: CORS_HEADERS });
  }
  if (!contact_email || !company_name || !contact_name) {
    return Response.json({ error: 'Missing required fields' }, { status: 400, headers: CORS_HEADERS });
  }

  const supabase = createServiceClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

  try {
    // Générer une API key en avance (activée seulement après paiement)
    const pendingApiKey = generateApiKey();

    // Insérer la demande en base avec status pending
    const { data: partnerReq, error: insertError } = await supabase
      .from('partner_requests')
      .insert({
        company_name,
        website: website ?? '',
        company_number: company_number ?? null,
        phone: phone ?? null,
        contact_name,
        contact_email,
        profile_type: profile_type ?? 'other',
        plan_requested: plan,
        message: message ?? `${plan} plan subscription via Stripe`,
        status: 'pending',
        api_key: pendingApiKey,
        api_key_active: false,
        billing_period: plan === 'enterprise' ? null : billing_period,
        ip_address: request.headers.get('x-forwarded-for') ?? null,
      })
      .select('id')
      .single();

    if (insertError || !partnerReq) {
      console.error('[partner/checkout] Insert error:', insertError);
      return Response.json({ error: 'Database error' }, { status: 500, headers: CORS_HEADERS });
    }

    // Créer ou récupérer le customer Stripe
    const customer = await stripe.customers.create({
      email: contact_email,
      name: `${contact_name} — ${company_name}`,
      metadata: {
        partner_request_id: partnerReq.id,
        plan,
        company_name,
      },
    });

    // Mettre à jour avec le stripe_customer_id
    await supabase
      .from('partner_requests')
      .update({ stripe_customer_id: customer.id })
      .eq('id', partnerReq.id);

    const priceId = getPriceId(plan as PartnerPlan, billing_period as BillingPeriod);

    // Créer la Checkout Session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 0,
        metadata: {
          partner_request_id: partnerReq.id,
          plan,
          company_name,
          contact_email,
        },
      },
      metadata: {
        partner_request_id: partnerReq.id,
        plan,
      },
      success_url: `${siteUrl}/partner/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url:  `${siteUrl}/partner/cancel?plan=${plan}`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: { address: 'auto' },
    });

    return Response.json({ url: session.url }, { headers: CORS_HEADERS });

  } catch (err) {
    console.error('[partner/checkout] Stripe error:', err);
    return Response.json({ error: 'Checkout creation failed' }, { status: 500, headers: CORS_HEADERS });
  }
}
