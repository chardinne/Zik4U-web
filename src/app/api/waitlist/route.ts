import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { parseWaitlistBody, waitlistRow } from '@/lib/waitlist';

// SITE1-1 — the single waitlist of the site (Decisions 171, 176, 178 of 26/10/2026).
// Same answer whether the email is new or already listed (nothing revealed).
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const input = parseWaitlistBody(body);
  if (!input.ok) return Response.json({ error: input.error }, { status: 400 });
  if (input.bot) return Response.json({ success: true });

  const row = waitlistRow(input);
  const supabase = createServiceClient();
  const { error } = await supabase.from(row.table).upsert(row.values, { onConflict: 'email' });

  if (error) {
    console.error('[waitlist]', error.code ?? 'error');
    return Response.json({ error: 'unavailable' }, { status: 500 });
  }
  return Response.json({ success: true });
}
