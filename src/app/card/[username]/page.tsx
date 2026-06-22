import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase-server';
import {
  ARCHETYPE_LABELS,
  ARCHETYPE_VISUAL_PROFILE,
  DEFAULT_ARCHETYPE_PROFILE,
  CONSTELLATION_PALETTE,
  RARITY_THRESHOLDS,
  TAGLINE_FALLBACK,
  toRarity,
  generateMusicBio,
  type MusicSignatureData,
} from '@/lib/cosmicCard';
import { ListenButton } from './ListenButton';
import { CelestialBody } from './CelestialBody';

interface Props {
  params: Promise<{ username: string }>;
}

interface ProfileRow {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface ScrobbleRow {
  track_title: string;
  artist_name: string;
  played_at: string;
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

interface DistributionRow {
  archetype: string;
  count: number;
  percentage: number;
  avg_confidence: number;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const handle = username.replace(/^@/, '');
  const serviceClient = createServiceClient();

  const { data: profile } = await serviceClient
    .from('users')
    .select('id, username, display_name, avatar_url')
    .eq('username', handle)
    .single();

  if (!profile) return { title: 'Zik4U: Musical Identity' };

  const displayName = (profile.display_name ?? profile.username) as string;

  const { data: scrobbles } = await serviceClient
    .from('scrobbles')
    .select('track_title, artist_name')
    .eq('user_id', profile.id)
    .eq('is_private', false)
    .order('played_at', { ascending: false })
    .limit(1);

  const lastScrobble = (scrobbles as Pick<ScrobbleRow, 'track_title' | 'artist_name'>[] | null)?.[0];

  const description = lastScrobble
    ? `@${profile.username} is listening to "${lastScrobble.track_title}" by ${lastScrobble.artist_name}. Discover their Music DNA on Zik4U.`
    : `Discover @${profile.username}'s musical identity. Join Zik4U, the social network built on real listening data.`;

  return {
    title: `${displayName} · Music DNA`,
    description,
    openGraph: {
      title: `${displayName} · Music DNA`,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url as string, width: 400, height: 400 }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${displayName} · Music DNA`,
      description,
      images: profile.avatar_url ? [profile.avatar_url as string] : [],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { username } = await params;
  const handle = username.replace(/^@/, '');
  const serviceClient = createServiceClient();

  // ── User lookup — service role (no anon policy on users/profiles; RSC: key never sent to client) ─
  const { data: profileRaw } = await serviceClient
    .from('users')
    .select('id, username, display_name, avatar_url, bio')
    .eq('username', handle)
    .single();

  if (!profileRaw) redirect('/');
  const profile = profileRaw as ProfileRow;

  const { data: scrobblesRaw } = await serviceClient
    .from('scrobbles')
    .select('track_title, artist_name, played_at')
    .eq('user_id', profile.id)
    .eq('is_private', false)
    .order('played_at', { ascending: false })
    .limit(1);

  const lastScrobble = (scrobblesRaw as ScrobbleRow[] | null)?.[0] ?? null;

  // ── Service role — intelligence data (locked anon, sprint sécu F1) ─────────
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: archetypeRaw },
    { data: distributionRaw },
    { data: musicSigRaw },
    { data: recentScrobblesRaw },
    { data: constellationRaw },
  ] = await Promise.all([
    serviceClient
      .from('listener_archetypes')
      .select('archetype, confidence, total_scrobbles_snapshot, archetype_secondary, archetype_secondary_confidence, archetype_previous, archetype_shifted_at')
      .eq('user_id', profile.id)
      .maybeSingle(),
    serviceClient.rpc('get_archetype_distribution'),
    serviceClient.rpc('get_music_signature', { p_user_id: profile.id }),
    // ON REPEAT: get_defining_tracks uses auth.uid() internally (DIVERGENCE — see commit note).
    // Substitute: direct scrobbles query via service_role, group client-side.
    serviceClient
      .from('scrobbles')
      .select('track_title, artist_name')
      .eq('user_id', profile.id)
      .eq('is_private', false)
      .neq('source', 'youtube')
      .gte('played_at', sevenDaysAgo)
      .order('played_at', { ascending: false })
      .limit(200),
    // Constellation: direct query filtering private tracks (service_role bypasses RLS).
    serviceClient
      .from('scrobbles')
      .select('artist_name')
      .eq('user_id', profile.id)
      .eq('is_private', false)
      .neq('source', 'youtube')
      .gte('played_at', sevenDaysAgo)
      .limit(500),
  ]);

  const archetypeRow = archetypeRaw as ArchetypeRow | null;
  const distribution = (distributionRaw as DistributionRow[] | null) ?? [];
  const musicSig = musicSigRaw as MusicSignatureData | null;

  // Constellation: group scrobbles by artist, sort by count desc, top 4.
  const artistCounts = new Map<string, number>();
  for (const s of (constellationRaw as { artist_name: string }[] | null) ?? []) {
    artistCounts.set(s.artist_name, (artistCounts.get(s.artist_name) ?? 0) + 1);
  }
  const topArtists = [...artistCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([artist_name, play_count]) => ({ artist_name, play_count }));

  // ON REPEAT: group recent scrobbles by track, pick most-played.
  // Key normalises case+whitespace to match get_defining_tracks md5(lower(trim())) logic.
  // Display title/artist kept in original casing.
  const scrobbleCounts = new Map<string, { title: string; artist: string; count: number }>();
  for (const s of (recentScrobblesRaw as { track_title: string; artist_name: string }[] | null) ?? []) {
    const key = `${s.track_title.toLowerCase().trim()}|||${s.artist_name.toLowerCase().trim()}`;
    const existing = scrobbleCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      scrobbleCounts.set(key, { title: s.track_title, artist: s.artist_name, count: 1 });
    }
  }
  const onRepeatTrack = [...scrobbleCounts.values()].sort((a, b) => b.count - a.count)[0] ?? null;

  // ── Derived values ─────────────────────────────────────────────────────────
  const archetype = archetypeRow?.archetype ?? null;
  const archetypeProfile =
    archetype && ARCHETYPE_VISUAL_PROFILE[archetype]
      ? ARCHETYPE_VISUAL_PROFILE[archetype]
      : DEFAULT_ARCHETYPE_PROFILE;

  const distributionEntry = distribution.find((d) => d.archetype === archetype);
  const rarityPct = distributionEntry?.percentage ?? 100;
  const rarity = toRarity(rarityPct);

  const musicBio = generateMusicBio(musicSig);

  const isForming = !archetypeRow || archetype === 'emerging';
  const totalScrobbles = archetypeRow?.total_scrobbles_snapshot ?? 0;

  const showShift =
    !!archetypeRow?.archetype_previous &&
    !!archetypeRow?.archetype_shifted_at &&
    Date.now() - new Date(archetypeRow.archetype_shifted_at).getTime() < 14 * 24 * 60 * 60 * 1000;

  const showSecondary =
    !!archetypeRow?.archetype_secondary &&
    (archetypeRow?.archetype_secondary_confidence ?? 0) > 0.1;

  const displayName = profile.display_name ?? profile.username;
  const bioText = profile.bio ?? (!musicBio.isEmpty ? musicBio.signature : null);

  // Constants — values unchanged from existing page
  const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';
  const DEEP_LINK = `zik4u://profile/${username}`;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A1A', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 48px' }}>

      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '2px', color: '#A78BFA', fontWeight: 600 }}>
            MUSIC DNA
          </span>
        </div>

        {/* ── Identity row ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={displayName}
              width={28}
              height={28}
              style={{ borderRadius: '50%', border: '2px solid rgba(0,212,255,0.4)', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #FF3CAC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
              🎵
            </div>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#00D4FF', fontWeight: 600 }}>
            @{profile.username}
          </span>
        </div>

        {/* ── Twin stars diptych — last played (emitting star) + on repeat (satellite) ── */}
        {(lastScrobble || onRepeatTrack) && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 12, marginBottom: 32, width: '100%' }}>
            {lastScrobble && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <ListenButton variant="sun" title={lastScrobble.track_title} artist={lastScrobble.artist_name}>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>LAST PLAYED</span>
                  <CelestialBody variant="star" color={archetypeProfile.primary} size={120} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                    {lastScrobble.track_title}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
                    {lastScrobble.artist_name}
                  </span>
                </ListenButton>
              </div>
            )}
            {onRepeatTrack && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <ListenButton variant="sun" title={onRepeatTrack.title} artist={onRepeatTrack.artist}>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>ON REPEAT</span>
                  <CelestialBody variant="satellite" color={archetypeProfile.secondary} size={92} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
                    {onRepeatTrack.title}
                  </span>
                </ListenButton>
              </div>
            )}
          </div>
        )}

        {/* ── FORMING state ───────────────────────────────────────────────── */}
        {isForming ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 28, textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 34, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>
              EMERGING IDENTITY
            </span>
            <div style={{ width: '100%', maxWidth: 280, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(totalScrobbles / 20, 1) * 100}%`,
                  background: `linear-gradient(90deg, ${archetypeProfile.secondary}, ${archetypeProfile.primary})`,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8888BB', letterSpacing: '0.5px' }}>
              {totalScrobbles} / 20 tracks to unlock your full DNA
            </span>
          </div>
        ) : (
          /* ── Normal state ──────────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>

            {/* Archetype hero */}
            <div>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 34,
                color: '#fff',
                letterSpacing: '0.05em',
                lineHeight: 1,
                textShadow: `0 0 12px ${archetypeProfile.primary}80`,
              }}>
                {ARCHETYPE_LABELS[archetype!] ?? archetype}
              </span>
            </div>

            {/* Archetype shift badge */}
            {showShift && (
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#FFB800', letterSpacing: '0.5px' }}>
                ↗ shifting from {ARCHETYPE_LABELS[archetypeRow!.archetype_previous!] ?? archetypeRow!.archetype_previous}
              </span>
            )}

            {/* Rarity badge */}
            {rarity !== 'common' && (
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: RARITY_THRESHOLDS[rarity].color,
                  border: `1px solid ${RARITY_THRESHOLDS[rarity].color}`,
                  borderRadius: 999,
                  padding: '3px 10px',
                  letterSpacing: '0.5px',
                }}>
                  Top {rarityPct.toFixed(1)}% · {RARITY_THRESHOLDS[rarity].label}
                </span>
              </div>
            )}

            {/* Secondary archetype */}
            {showSecondary && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                also {ARCHETYPE_LABELS[archetypeRow!.archetype_secondary!] ?? archetypeRow!.archetype_secondary}{' '}
                {Math.round((archetypeRow!.archetype_secondary_confidence ?? 0) * 100)}%
              </span>
            )}

            {/* Tagline */}
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.4 }}>
              &ldquo;{TAGLINE_FALLBACK}&rdquo;
            </span>

            {/* MY CONSTELLATION */}
            {topArtists.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>MY CONSTELLATION</span>
                {topArtists.map((a, i) => (
                  <div key={a.artist_name} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: CONSTELLATION_PALETTE[i % CONSTELLATION_PALETTE.length], flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.artist_name}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8888BB' }}>
                        {a.play_count}
                      </span>
                      <ListenButton variant="row" artist={a.artist_name} />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ── Bio ─────────────────────────────────────────────────────────── */}
        {bioText && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>BIO</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              {bioText}
            </span>
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingTop: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8888BB' }}>
            zik4u.com/card/@{profile.username}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: archetypeProfile.primary }}>
            ZIK4U
          </span>
        </div>

        {/* ── CTA — unchanged from existing page ──────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
            Listen to what {displayName} hears
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Real music. Real identity. For real.
          </p>

          <a
            href={APP_STORE_URL}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#000', borderRadius: 14, padding: '14px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
          >
            <span style={{ fontSize: 22 }}>🍎</span>
            Download on the App Store
          </a>

          <a
            href={PLAY_STORE_URL}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(90deg, #00D4FF, #00FFB2)', color: '#0A0A1A', borderRadius: 14, padding: '14px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
          >
            <span style={{ fontSize: 22 }}>▶</span>
            Get it on Google Play
          </a>

          <a
            href={DEEP_LINK}
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginTop: 4 }}
          >
            Already have Zik4U? Open in app →
          </a>
        </div>

      </div>
    </main>
  );
}
