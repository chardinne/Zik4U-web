import { createServiceClient } from '@/lib/supabase-server';
import { normalizeHandle } from '@/lib/publicProfile';
import { generateMusicBio, toRarity, type MusicSignatureData, type Rarity } from '@/lib/cosmicCard';
import { parseFingerprint, type ListeningFingerprint } from '@/lib/listeningFingerprint';
import { FOUNDER_USERNAME, founderGalaxyEnabled } from '@/lib/founderGalaxy';

// SHARE-KEY1 / WEB-PRIV1 part 2 — the ONLY place of the site that reads listening data.
//
// A profile link shared on purpose from the app carries the owner's live share key
// (?k=, table share_keys, migration 00177). With a valid, unrevoked key, the card shows
// the full music card — even for a private account (decision of 23/09, D5 = A). Without
// a key, or with a wrong or revoked one, this returns null and the page falls back to the
// minimal profile (name, avatar, bio). Deleted accounts: null.
//
// Reads with the SERVICE key: the key check below is the whole gate. Shared cards are
// never indexed (the page sets noindex). Exclusive creator content is never read (D6).
//
// DNA-SILLON site (decisions 44, 45, 46 = A, 12/10/2026) — the same figures as the app's
// Music DNA card: the empreinte from the server (get_listening_fingerprint, Zik4U 00210),
// the A-side from get_user_top_artists (4 artists, 7 days), ON REPEAT with the rule of
// get_defining_tracks (7 days, cleaned names, no artist conflict) for THIS account, and
// titles shown as cleaned by the server when it has a cleaned version (decision 45).

const KEY_PATTERN = /^[0-9a-f]{64}$/;

export interface SharedTrack { title: string; artist: string }
export interface SharedArtist { artist_name: string; play_count: number }

export interface SharedCard {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bioText: string | null;
  lastPlayed: SharedTrack | null;
  onRepeat: SharedTrack | null;
  archetype: string | null;
  archetypePrevious: string | null;
  showShift: boolean;
  secondary: { archetype: string; confidence: number } | null;
  rarity: Rarity;
  rarityPct: number;
  isForming: boolean;
  totalScrobbles: number;
  topArtists: SharedArtist[];
  /** null: the server drew nothing (no answer, or an answer of another shape). */
  fingerprint: ListeningFingerprint | null;
}

export interface ScrobbleTitleRow {
  track_title: string;
  artist_name: string;
  track_title_normalized?: string | null;
  artist_name_normalized?: string | null;
  artist_name_confidence?: string | null;
}

const clean = (v: string | null | undefined) => (typeof v === 'string' ? v.trim() : '');

/** Decision 45 — the title and artist as cleaned by the server, the captured ones otherwise. */
export function displayTrack(row: ScrobbleTitleRow): SharedTrack {
  return {
    title: clean(row.track_title_normalized) || row.track_title,
    artist: clean(row.artist_name_normalized) || row.artist_name,
  };
}

/** ON REPEAT — rule of get_defining_tracks: most played (cleaned) track, artist conflicts left out. */
export function onRepeatOf(rows: ScrobbleTitleRow[]): SharedTrack | null {
  const counts = new Map<string, { track: SharedTrack; n: number }>();
  for (const row of rows) {
    if (row.artist_name_confidence === 'conflict') continue;
    const track = displayTrack(row);
    const key = `${track.title.toLowerCase().trim()}|${track.artist.toLowerCase().trim()}`;
    const hit = counts.get(key);
    if (hit) hit.n++;
    else counts.set(key, { track, n: 1 });
  }
  let best: { track: SharedTrack; n: number } | null = null;
  for (const v of counts.values()) if (!best || v.n > best.n) best = v;
  return best ? best.track : null;
}

interface UserRow {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  deleted_at: string | null;
  // SEC-COCKPIT c2 (Zik4U 00198): a suspended account has no card.
  is_banned?: boolean | null;
}

interface ArchetypeRow {
  archetype: string;
  confidence: number | null;
  total_scrobbles_snapshot: number | null;
  archetype_secondary: string | null;
  archetype_secondary_confidence: number | null;
  archetype_previous: string | null;
  archetype_shifted_at: string | null;
}

export function isShareKey(raw: unknown): raw is string {
  return typeof raw === 'string' && KEY_PATTERN.test(raw);
}

/** Decision 46 — link-preview image of a card (route ./preview); the key travels only if well formed. */
export function previewImageUrl(username: string, key: unknown): string {
  const path = `/card/${encodeURIComponent(username)}/preview`;
  return isShareKey(key) ? `${path}?k=${key}` : path;
}

export async function getSharedCard(rawHandle: string, rawKey: unknown): Promise<SharedCard | null> {
  if (!isShareKey(rawKey)) return null;
  const handle = normalizeHandle(rawHandle);
  if (!handle) return null;

  const sc = createServiceClient();
  const { data: userData, error: userError } = await sc
    .from('users')
    .select('id, username, display_name, avatar_url, bio, deleted_at, is_banned')
    .eq('username', handle)
    .maybeSingle();
  const user = userData as UserRow | null;
  if (userError || !user || !user.username || user.deleted_at || user.is_banned === true) return null;

  // The gate: this exact key must be the live key of THIS account.
  const { data: keyRow, error: keyError } = await sc
    .from('share_keys')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('key', rawKey)
    .maybeSingle();
  if (keyError || !keyRow || (keyRow as { user_id: string }).user_id !== user.id) return null;

  return loadCard(sc, { ...user, username: user.username });
}

/** SITE2 (Decisions 174 and 189 = A, 27/10/2026): the founder's own card on /bertrand, by his
 *  consent, for his account only. Same switch as his galaxy (FOUNDER_GALAXY=off). */
export async function getFounderCard(): Promise<SharedCard | null> {
  if (!founderGalaxyEnabled()) return null;
  try {
    const sc = createServiceClient();
    const { data: userData, error: userError } = await sc
      .from('users')
      .select('id, username, display_name, avatar_url, bio, deleted_at, is_banned')
      .eq('username', FOUNDER_USERNAME)
      .maybeSingle();
    const user = userData as UserRow | null;
    if (userError || !user || !user.username || user.deleted_at || user.is_banned === true) return null;
    return await loadCard(sc, { ...user, username: user.username });
  } catch {
    return null;
  }
}

/** Every listening read of a card, ONLY after one of the two gates above (live share key, or the founder's own account). */
async function loadCard(sc: ReturnType<typeof createServiceClient>, user: UserRow & { username: string }): Promise<SharedCard> {
  const TITLE_COLUMNS = 'track_title, artist_name, track_title_normalized, artist_name_normalized, artist_name_confidence';
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [last, archetypeRes, distributionRes, signatureRes, recentRes, topRes, fingerprintRes] = await Promise.all([
    sc.from('scrobbles').select(`${TITLE_COLUMNS}, played_at`)
      .eq('user_id', user.id).eq('is_private', false)
      .order('played_at', { ascending: false }).limit(1),
    sc.from('listener_archetypes')
      .select('archetype, confidence, total_scrobbles_snapshot, archetype_secondary, archetype_secondary_confidence, archetype_previous, archetype_shifted_at')
      .eq('user_id', user.id).maybeSingle(),
    sc.rpc('get_archetype_distribution'),
    sc.rpc('get_music_signature', { p_user_id: user.id }),
    sc.from('scrobbles').select(TITLE_COLUMNS)
      .eq('user_id', user.id).eq('is_private', false)
      .gte('played_at', sevenDaysAgo)
      .order('played_at', { ascending: false }).limit(5000),
    sc.rpc('get_user_top_artists', { p_user_id: user.id, p_limit: 4, p_days: 7 }),
    sc.rpc('get_listening_fingerprint', { p_target: user.id }),
  ]);

  const lastRow = ((last.data as ScrobbleTitleRow[] | null) ?? [])[0] ?? null;
  const archetypeRow = (archetypeRes.data as ArchetypeRow | null) ?? null;
  const distribution = (distributionRes.data as { archetype: string; percentage: number }[] | null) ?? [];
  const signature = (signatureRes.data as MusicSignatureData | null) ?? null;
  const recent = (recentRes.data as ScrobbleTitleRow[] | null) ?? [];
  const topArtists = ((topRes.data as { artist_name: string; play_count: number | string }[] | null) ?? [])
    .slice(0, 4)
    .map((a) => ({ artist_name: a.artist_name, play_count: Number(a.play_count) || 0 }));
  const top = onRepeatOf(recent);

  const archetype = archetypeRow?.archetype ?? null;
  // Same rounding as the app's rarity badge (useArchetypeRarity).
  const rawPct = Number(distribution.find((d) => d.archetype === archetype)?.percentage);
  const rarityPct = Number.isFinite(rawPct) ? Math.round(rawPct) : 100;
  const musicBio = generateMusicBio(signature);

  return {
    username: user.username,
    displayName: user.display_name ?? user.username,
    avatarUrl: user.avatar_url,
    bioText: user.bio ?? (!musicBio.isEmpty ? musicBio.signature : null),
    lastPlayed: lastRow ? displayTrack(lastRow) : null,
    onRepeat: top,
    archetype,
    archetypePrevious: archetypeRow?.archetype_previous ?? null,
    showShift:
      !!archetypeRow?.archetype_previous &&
      !!archetypeRow?.archetype_shifted_at &&
      Date.now() - new Date(archetypeRow.archetype_shifted_at).getTime() < 14 * 24 * 60 * 60 * 1000,
    secondary:
      archetypeRow?.archetype_secondary && (archetypeRow.archetype_secondary_confidence ?? 0) > 0.1
        ? { archetype: archetypeRow.archetype_secondary, confidence: archetypeRow.archetype_secondary_confidence ?? 0 }
        : null,
    rarity: toRarity(rarityPct),
    rarityPct,
    isForming: !archetypeRow || archetype === 'emerging',
    totalScrobbles: archetypeRow?.total_scrobbles_snapshot ?? 0,
    topArtists,
    fingerprint: fingerprintRes.error ? null : parseFingerprint(fingerprintRes.data),
  };
}
