import { type NextRequest } from 'next/server';
import { createPartnerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

async function verifyApiKey(apiKey: string): Promise<{ valid: boolean; plan: string | null }> {
  const supabase = createPartnerClient();
  const { data } = await supabase
    .from('partner_requests')
    .select('plan_requested, subscription_status, api_key_active')
    .eq('api_key', apiKey)
    .eq('api_key_active', true)
    .eq('status', 'approved')
    .maybeSingle();

  if (!data) return { valid: false, plan: null };
  const activeStatuses = ['active', 'trialing'];
  const isActive = !data.subscription_status ||
    activeStatuses.includes(data.subscription_status);
  return { valid: isActive, plan: data.plan_requested };
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-zik4u-key');

  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 });
  }

  const { valid, plan } = await verifyApiKey(apiKey);
  if (!valid) {
    return Response.json({ error: 'Invalid or inactive API key' }, { status: 401 });
  }

  const supabase = createPartnerClient();
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get('limit') ?? '20'),
    plan === 'intelligence' || plan === 'enterprise' ? 100 : 20,
  );

  const { data: leaderboard, error } = await supabase.rpc('get_virality_leaderboard', {
    p_limit: limit,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    leaderboard: leaderboard ?? [],
    count: (leaderboard ?? []).length,
    plan,
    generated_at: new Date().toISOString(),
  });
}
