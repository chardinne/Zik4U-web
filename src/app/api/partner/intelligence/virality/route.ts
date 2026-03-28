import { type NextRequest } from 'next/server';
import { createPartnerClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-zik4u-key');

  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 });
  }

  // Rate limit
  const rateLimit = await checkRateLimit(apiKey, 'intelligence');
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded — 100 requests per hour', reset_at: rateLimit.resetAt },
      { status: 429, headers: { 'Retry-After': '3600' } }
    );
  }

  const supabase = createPartnerClient();
  const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '20');

  // La RPC vérifie la clé API en interne — pas de bypass possible
  const { data: leaderboard, error } = await supabase.rpc(
    'partner_get_virality_leaderboard',
    { p_api_key: apiKey, p_limit: Math.min(limit, 100) }
  );

  if (error) {
    if (error.code === '42501') {
      return Response.json({ error: 'Invalid or inactive API key' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    leaderboard: leaderboard ?? [],
    count: (leaderboard ?? []).length,
    generated_at: new Date().toISOString(),
  });
}
