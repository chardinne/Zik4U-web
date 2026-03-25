import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (body.email as string ?? '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from('pulse_waitlist')
    .upsert({ email, created_at: new Date().toISOString() }, { onConflict: 'email' });

  if (error) {
    console.error('[pulse-waitlist]', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }

  return Response.json({ success: true });
}
