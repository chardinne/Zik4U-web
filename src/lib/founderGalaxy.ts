// SITE1-2 — Decision 174 = A (26/10/2026): the home page shows the LIVE galaxy of the founder's
// own account (`bertrand`), with his explicit consent. The ONLY exception to WEB-PRIV1 on the
// site: no other account is ever read here. Read with the service key (like sharedCard.ts), so
// the site filters deleted_at and is_banned itself, and never reads a private listen.
// Cut switch: set FOUNDER_GALAXY=off in Vercel (then redeploy) and the home page falls back to
// the frozen image, with no number and no title.

import { createServiceClient } from '@/lib/supabase-server';
import { ARCHETYPE_LABELS } from '@/lib/cosmicCard';
import { parseSunSignature, type SunSignature } from '@/lib/galaxy/sunSignature';

export const FOUNDER_USERNAME = 'bertrand';
export const FOUNDER_DISPLAY_NAME = 'Bertrand';
/** D174: redrawn every 15 minutes (ISR of the home page). */
export const FOUNDER_REVALIDATE_SECONDS = 900;
/** D177: the green "live" dot only when the shown listen is under 30 minutes old. */
export const LIVE_WINDOW_MS = 30 * 60 * 1000;
const MAX_PLANETS = 7;

export interface FounderTrack {
  trackId: string;
  title: string;
  artist: string;
  playCount: number;
  peakLocalHour: number | null;
}

export interface FounderGalaxy {
  /** Layout seed of the app's sphere (seedFromUserId): the planets sit where they sit in the app,
   *  without sending the account id to the browser. */
  seed: number;
  sun: SunSignature;
  archetype: string | null;
  archetypeLabel: string | null;
  tracks: FounderTrack[];
  listens: number;
  artists: number | null;
  /** D177 = B: last listen whose title and artist were cleaned by the server, else null. */
  lastClean: { title: string; artist: string; playedAt: string } | null;
  fetchedAt: string;
}

export function founderGalaxyEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return (env.FOUNDER_GALAXY ?? '').trim().toLowerCase() !== 'off';
}

/** Same as seedFromUserId in the app's LivingSignalSphere.tsx. */
export function seedFromUserId(userId: string): number {
  return userId.split('').reduce((acc, ch) => (acc + ch.charCodeAt(0)) % 9973, 0);
}

interface TrackRow { track_id: string; title: string; artist: string; play_count: number | string; peak_local_hour: number | null }

/** Pure mapping of get_user_defining_tracks rows (already the server-cleaned titles, D45). */
export function toFounderTracks(rows: unknown): FounderTrack[] {
  if (!Array.isArray(rows)) return [];
  return (rows as TrackRow[])
    .filter((r) => r && typeof r.track_id === 'string' && typeof r.title === 'string' && typeof r.artist === 'string')
    .slice(0, MAX_PLANETS)
    .map((r) => ({
      trackId: r.track_id,
      title: r.title,
      artist: r.artist,
      playCount: Math.max(Number(r.play_count) || 0, 0),
      peakLocalHour: Number.isInteger(r.peak_local_hour) ? (r.peak_local_hour as number) : null,
    }));
}

/** The founder's galaxy, or null (switch off, account gone, hidden listening, no sun, any error). */
export async function getFounderGalaxy(): Promise<FounderGalaxy | null> {
  if (!founderGalaxyEnabled()) return null;
  try {
    const sc = createServiceClient();
    const { data: user, error } = await sc
      .from('users')
      .select('id, username, deleted_at, is_banned')
      .eq('username', FOUNDER_USERNAME)
      .maybeSingle();
    const u = user as { id: string; username: string; deleted_at: string | null; is_banned: boolean | null } | null;
    if (error || !u || u.deleted_at || u.is_banned === true) return null;

    const [sunRes, tracksRes, archetypeRes, lastRes] = await Promise.all([
      sc.rpc('get_sun_signature', { p_user_id: u.id }),
      sc.rpc('get_user_defining_tracks', { p_user_id: u.id }),
      sc.from('listener_archetypes').select('archetype, unique_artists').eq('user_id', u.id).maybeSingle(),
      sc.from('scrobbles')
        .select('track_title_normalized, artist_name_normalized, played_at')
        .eq('user_id', u.id).eq('is_private', false)
        .not('track_title_normalized', 'is', null).not('artist_name_normalized', 'is', null)
        .order('played_at', { ascending: false }).limit(1),
    ]);
    const sun = sunRes.error ? null : parseSunSignature(sunRes.data);
    if (!sun) return null;
    const a = (archetypeRes.data as { archetype: string | null; unique_artists: number | null } | null) ?? null;
    const archetype = a?.archetype && a.archetype !== 'emerging' ? a.archetype : null;
    const last = ((lastRes.data as { track_title_normalized: string; artist_name_normalized: string; played_at: string }[] | null) ?? [])[0];
    return {
      seed: seedFromUserId(u.id),
      sun,
      archetype,
      archetypeLabel: archetype ? ARCHETYPE_LABELS[archetype] ?? null : null,
      tracks: tracksRes.error ? [] : toFounderTracks(tracksRes.data),
      listens: sun.listens,
      artists: typeof a?.unique_artists === 'number' && a.unique_artists > 0 ? a.unique_artists : null,
      lastClean: last ? { title: last.track_title_normalized, artist: last.artist_name_normalized, playedAt: last.played_at } : null,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
