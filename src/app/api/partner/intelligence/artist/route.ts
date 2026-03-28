import { type NextRequest } from 'next/server';
import { createPartnerClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';

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

  const supabase = createPartnerClient();

  const { data: intelligence, error } = await supabase.rpc(
    'partner_get_artist_intelligence',
    { p_api_key: apiKey, p_artist_name: artist, p_days: Math.min(days, 365) }
  );

  if (error) {
    if (error.code === '42501') {
      return Response.json({ error: 'Invalid or inactive API key' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    ...(intelligence ?? { artist_name: artist, days, total_scrobbles: 0, unique_listeners: 0 }),
    generated_at: new Date().toISOString(),
  });
}
