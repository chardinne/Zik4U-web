import { type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const VALID_PLATFORMS = [
  'spotify', 'apple_music', 'deezer', 'soundcloud',
  'tidal', 'youtube_music', 'other',
] as const;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (body.email as string ?? '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }

  const artistName = (body.artist_name as string ?? '').trim();
  if (!artistName || artistName.length > 100) {
    return Response.json({ error: 'Artist name required (max 100 chars)' }, { status: 400 });
  }

  const platform = (body.main_platform as string ?? '').trim();
  if (!VALID_PLATFORMS.includes(platform as typeof VALID_PLATFORMS[number])) {
    return Response.json({ error: 'Invalid platform' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from('creator_waitlist')
    .upsert(
      { email, artist_name: artistName, main_platform: platform },
      { onConflict: 'email' },
    );

  if (error) {
    console.error('[creator-waitlist]', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }

  return Response.json({ success: true });
}
