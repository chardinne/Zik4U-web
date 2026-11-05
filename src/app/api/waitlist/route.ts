import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { serverSecretKey } from '@/lib/supabaseKeys';
import { parseWaitlistBody, waitlistRpcArgs } from '@/lib/waitlist';
import { waitlistClientIp, waitlistIpHash } from '@/lib/waitlistServer';

// SITE1-1 — the single waitlist of the site (Decisions 171, 176, 178 of 26/10/2026).
// Same answer whether the email is new or already listed (nothing revealed).
// AUDIT1-b (Decision 256 = A): written by public.waitlist_sign_up, 10 per hour per network address;
// over the limit the form shows its existing error text (Decision 179).
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const input = parseWaitlistBody(body);
  if (!input.ok) return Response.json({ error: input.error }, { status: 400 });
  if (input.bot) return Response.json({ success: true });

  const key = serverSecretKey(); // KEYS1 K1c: new secret key only, '' when missing (fail-closed)
  if (!key) {
    console.error('[waitlist]', 'no_key');
    return Response.json({ error: 'unavailable' }, { status: 500 });
  }
  const ipHash = waitlistIpHash(waitlistClientIp(request.headers), key);
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc('waitlist_sign_up', waitlistRpcArgs(input, ipHash));

  if (error) {
    console.error('[waitlist]', error.code ?? 'error');
    return Response.json({ error: 'unavailable' }, { status: 500 });
  }
  if (data === 'rate_limited') {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }
  return Response.json({ success: true });
}
