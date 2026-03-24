import { type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createServiceClient } from '@/lib/supabase-server';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// IMPORTANT : désactiver le body parsing de Next.js pour Stripe
export const config = { api: { bodyParser: false } };

async function sendActivationEmail(
  contactEmail: string,
  contactName: string,
  companyName: string,
  plan: string,
  apiKey: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const planLabel: Record<string, string> = {
    insight:      'Insight — $499/month',
    intelligence: 'Intelligence — $1,299/month',
    enterprise:   'Enterprise',
  };

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A1A;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:22px;font-weight:900;letter-spacing:0.2em;
        background:linear-gradient(90deg,#00D4FF,#00FFB2,#FF3CAC);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;">ZIK4U</span>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:0.1em;
        text-transform:uppercase;margin-top:4px;">Intelligence — Access Activated</p>
    </div>
    <div style="background:#12122A;border:1px solid rgba(0,212,255,0.2);border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#fff;font-size:16px;margin:0 0 8px;">Hi ${contactName},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;margin:0 0 20px;">
        Your <strong style="color:#fff;">${planLabel[plan] ?? plan}</strong> subscription for
        <strong style="color:#fff;">${companyName}</strong> is now active.
      </p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 12px;">Your API key:</p>
      <div style="background:#0A0A1A;border:1px solid rgba(0,212,255,0.3);border-radius:10px;
        padding:16px;font-family:monospace;font-size:14px;color:#00D4FF;word-break:break-all;margin-bottom:20px;">
        ${apiKey}
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">
        Include it in API calls as: <code style="color:#00FFB2;">X-Zik4U-Key: ${apiKey}</code>
      </p>
    </div>
    <div style="background:#12122A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#fff;font-size:15px;margin:0 0 12px;">Quick start</h3>
      <pre style="background:#0A0A1A;border-radius:8px;padding:16px;font-size:12px;color:#00FFB2;overflow-x:auto;margin:0;line-height:1.6;">curl "https://admin.zik4u.com/api/insights/artist\\
  ?artist=Billie+Eilish&days=30" \\
  -H "X-Zik4U-Key: ${apiKey}"</pre>
    </div>
    <div style="text-align:center;">
      <a href="https://zik4u.com/partner/dashboard"
        style="display:inline-block;padding:14px 32px;border-radius:12px;
          background:linear-gradient(135deg,#00D4FF,#00FFB2);
          color:#0A0A1A;font-weight:700;font-size:14px;text-decoration:none;">
        Open your dashboard →
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.3);font-size:11px;text-align:center;margin-top:24px;">
      Questions? Contact partner@zik4u.com
    </p>
  </div>
</body>
</html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    'Zik4U Intelligence <partner@zik4u.com>',
      to:      [contactEmail],
      subject: `Your Zik4U ${planLabel[plan] ?? plan} access is active`,
      html,
    }),
  }).catch(err => console.error('[webhook] Resend error:', err));
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return Response.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // ── Gérer les événements Stripe ──────────────────────────────────────────────

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const partnerRequestId = session.metadata?.partner_request_id;
    if (!partnerRequestId) return Response.json({ received: true });

    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const periodEnd = subscription.items.data[0]?.current_period_end;

    // Récupérer la demande pour avoir les infos contact
    const { data: partnerReq } = await supabase
      .from('partner_requests')
      .select('contact_email, contact_name, company_name, plan_requested, api_key')
      .eq('id', partnerRequestId)
      .single();

    // Activer l'accès
    await supabase
      .from('partner_requests')
      .update({
        status:                'approved',
        api_key_active:        true,
        payment_activated:     true,
        stripe_subscription_id: subscriptionId,
        stripe_price_id:       subscription.items.data[0]?.price.id ?? null,
        subscription_status:   subscription.status,
        current_period_end:    periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        reviewed_at:           new Date().toISOString(),
        approved_at:           new Date().toISOString(),
        approval_token:        null,
        rejection_token:       null,
      })
      .eq('id', partnerRequestId);

    // Envoyer l'email d'activation
    if (partnerReq?.contact_email && partnerReq?.api_key) {
      await sendActivationEmail(
        partnerReq.contact_email,
        partnerReq.contact_name,
        partnerReq.company_name,
        partnerReq.plan_requested,
        partnerReq.api_key,
      );
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const updatedPeriodEnd = subscription.items.data[0]?.current_period_end;
    await supabase
      .from('partner_requests')
      .update({
        subscription_status:  subscription.status,
        current_period_end:   updatedPeriodEnd ? new Date(updatedPeriodEnd * 1000).toISOString() : null,
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase
      .from('partner_requests')
      .update({
        subscription_status: 'canceled',
        api_key_active:      false,
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const subRef = invoice.parent?.subscription_details?.subscription;
    const subId = typeof subRef === 'string' ? subRef : subRef?.id;
    if (subId) {
      await supabase
        .from('partner_requests')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_subscription_id', subId);
    }
  }

  return Response.json({ received: true });
}
