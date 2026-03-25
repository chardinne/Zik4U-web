import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-zik4u-key') ??
    request.nextUrl.searchParams.get('api_key');

  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('partner_requests')
    .select('company_name, contact_name, plan_requested, subscription_status, current_period_end, billing_period, approved_at, payment_activated')
    .eq('api_key', apiKey)
    .eq('api_key_active', true)
    .maybeSingle();

  if (!data) {
    return Response.json({ error: 'Invalid API key' }, { status: 401 });
  }

  return Response.json({
    company_name: data.company_name,
    contact_name: data.contact_name,
    plan: data.plan_requested,
    subscription_status: data.subscription_status ?? 'active',
    current_period_end: data.current_period_end,
    billing_period: data.billing_period,
    approved_at: data.approved_at,
    payment_activated: data.payment_activated,
  });
}
