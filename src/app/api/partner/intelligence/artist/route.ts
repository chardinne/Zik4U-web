import { type NextRequest } from 'next/server';
import { createPartnerClient, createServiceClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';
import { cacheGet, cacheSet } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-zik4u-key');

  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(apiKey, 'intelligence');
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded', reset_at: rateLimit.resetAt },
      { status: 429 }
    );
  }

  const artist = request.nextUrl.searchParams.get('artist');
  const days = parseInt(request.nextUrl.searchParams.get('days') ?? '30');

  if (!artist) {
    return Response.json({ error: 'artist parameter required' }, { status: 400 });
  }

  // Log la recherche pour analytics admin
  try {
    const logClient = createServiceClient();
    const { data: partnerData } = await logClient
      .from('partner_requests')
      .select('plan_requested')
      .eq('api_key', apiKey)
      .single();
    const plan = partnerData?.plan_requested;
    await logClient.from('partner_search_logs').insert({
      api_key: apiKey,
      artist_name: artist,
      days,
      plan: plan ?? 'discover',
    });
  } catch { /* non-bloquant */ }

  const normalizedDays = Math.min(days, 365);
  const cacheKey = `artist_intel:${artist.toLowerCase()}:${normalizedDays}`;
  const cached = await cacheGet<Record<string, unknown>>(cacheKey);
  if (cached) {
    return Response.json({ ...cached, cached: true });
  }

  const supabase = createPartnerClient();

  const { data: intelligence, error } = await supabase.rpc(
    'partner_get_artist_intelligence',
    { p_api_key: apiKey, p_artist_name: artist, p_days: normalizedDays }
  );

  if (error) {
    if (error.code === '42501') {
      return Response.json({ error: 'Invalid or inactive API key' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  const result = {
    ...(intelligence ?? { artist_name: artist, days: normalizedDays, total_scrobbles: 0, unique_listeners: 0 }),
    generated_at: new Date().toISOString(),
  };

  await cacheSet(cacheKey, result, 15 * 60); // 15 min TTL

  return Response.json(result);
}
