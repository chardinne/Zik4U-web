import { type NextRequest } from 'next/server';
import { createPartnerClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';

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

  const rateLimit = await checkRateLimit(apiKey, 'intelligence');
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded — 100 requests per hour', reset_at: rateLimit.resetAt },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetAt ?? '',
          'Retry-After': '3600',
        },
      }
    );
  }

  const artist = request.nextUrl.searchParams.get('artist');
  const days = Math.min(
    parseInt(request.nextUrl.searchParams.get('days') ?? '30'),
    plan === 'intelligence' || plan === 'enterprise' ? 365 : 90,
  );

  if (!artist) {
    return Response.json({ error: 'artist parameter required' }, { status: 400 });
  }

  const supabase = createPartnerClient();

  const { data: intelligence, error } = await supabase.rpc('get_artist_intelligence', {
    p_artist_name: artist,
    p_days: days,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    ...(intelligence ?? { artist_name: artist, days, total_scrobbles: 0, unique_listeners: 0 }),
    plan,
    generated_at: new Date().toISOString(),
  });
}
