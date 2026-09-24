import { createServiceClient } from '@/lib/supabase-server';
import { normalizeHandle } from '@/lib/publicProfile';
import { generateMusicBio, toRarity, type MusicSignatureData, type Rarity } from '@/lib/cosmicCard';

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
}

interface UserRow {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  deleted_at: string | null;
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

export async function getSharedCard(rawHandle: string, rawKey: unknown): Promise<SharedCard | null> {
  if (!isShareKey(rawKey)) return null;
  const handle = normalizeHandle(rawHandle);
  if (!handle) return null;

  const sc = createServiceClient();
  const { data: userData, error: userError } = await sc
    .from('users')
    .select('id, username, display_name, avatar_url, bio, deleted_at')
    .eq('username', handle)
    .maybeSingle();
  const user = userData as UserRow | null;
  if (userError || !user || !user.username || user.deleted_at) return null;

  // The gate: this exact key must be the live key of THIS account.
  const { data: keyRow, error: keyError } = await sc
    .from('share_keys')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('key', rawKey)
    .maybeSingle();
  if (keyError || !keyRow || (keyRow as { user_id: string }).user_id !== user.id) return null;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [last, archetypeRes, distributionRes, signatureRes, recentRes] = await Promise.all([
    sc.from('scrobbles').select('track_title, artist_name, played_at')
      .eq('user_id', user.id).eq('is_private', false)
      .order('played_at', { ascending: false }).limit(1),
    sc.from('listener_archetypes')
      .select('archetype, confidence, total_scrobbles_snapshot, archetype_secondary, archetype_secondary_confidence, archetype_previous, archetype_shifted_at')
      .eq('user_id', user.id).maybeSingle(),
    sc.rpc('get_archetype_distribution'),
    sc.rpc('get_music_signature', { p_user_id: user.id }),
    sc.from('scrobbles').select('track_title, artist_name')
      .eq('user_id', user.id).eq('is_private', false).neq('source', 'youtube')
      .gte('played_at', sevenDaysAgo)
      .order('played_at', { ascending: false }).limit(500),
  ]);

  const lastRow = ((last.data as { track_title: string; artist_name: string }[] | null) ?? [])[0] ?? null;
  const archetypeRow = (archetypeRes.data as ArchetypeRow | null) ?? null;
  const distribution = (distributionRes.data as { archetype: string; percentage: number }[] | null) ?? [];
  const signature = (signatureRes.data as MusicSignatureData | null) ?? null;
  const recent = (recentRes.data as { track_title: string; artist_name: string }[] | null) ?? [];

  const artistCounts = new Map<string, number>();
  const trackCounts = new Map<string, { title: string; artist: string; count: number }>();
  for (const s of recent) {
    artistCounts.set(s.artist_name, (artistCounts.get(s.artist_name) ?? 0) + 1);
    const key = `${s.track_title.toLowerCase().trim()}|||${s.artist_name.toLowerCase().trim()}`;
    const t = trackCounts.get(key);
    if (t) t.count++;
    else trackCounts.set(key, { title: s.track_title, artist: s.artist_name, count: 1 });
  }
  const topArtists = [...artistCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([artist_name, play_count]) => ({ artist_name, play_count }));
  const top = [...trackCounts.values()].sort((a, b) => b.count - a.count)[0] ?? null;

  const archetype = archetypeRow?.archetype ?? null;
  const rarityPct = distribution.find((d) => d.archetype === archetype)?.percentage ?? 100;
  const musicBio = generateMusicBio(signature);

  return {
    username: user.username,
    displayName: user.display_name ?? user.username,
    avatarUrl: user.avatar_url,
    bioText: user.bio ?? (!musicBio.isEmpty ? musicBio.signature : null),
    lastPlayed: lastRow ? { title: lastRow.track_title, artist: lastRow.artist_name } : null,
    onRepeat: top ? { title: top.title, artist: top.artist } : null,
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
  };
}
