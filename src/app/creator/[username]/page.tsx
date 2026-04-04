import { notFound } from 'next/navigation';
import { getCreatorProfile } from '@/lib/creators';
import { createServiceClient } from '@/lib/supabase-server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ username: string }>;
}

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const C = {
  bg: '#0A0A1A', card: '#12122A', border: 'rgba(255,255,255,0.08)',
  cyan: '#00D4FF', mint: '#00FFB2', pink: '#FF3CAC',
  purple: '#7B2FFF', gold: '#FFB800',
  text: '#fff', muted: 'rgba(255,255,255,0.45)',
};

const MOOD_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  nocturne:    { emoji: '🌙', label: 'Nocturne',    color: C.purple },
  explorateur: { emoji: '🌍', label: 'Exploration', color: C.cyan   },
  high_energy: { emoji: '🔥', label: 'Énergie',     color: C.pink   },
  feel_good:   { emoji: '☀️', label: 'Light',       color: C.gold   },
  melancolique:{ emoji: '💜', label: 'Melancholy',  color: C.purple },
  deep_focus:  { emoji: '🌊', label: 'Focus',        color: C.mint   },
  obsession:   { emoji: '⚡', label: 'Obsession',   color: C.pink   },
};

const ARCHETYPE_CONFIG: Record<string, { emoji: string; label: string }> = {
  night_explorer:  { emoji: '🌙', label: 'Night Explorer'  },
  morning_warrior: { emoji: '☀️', label: 'Morning Warrior' },
  deep_feeler:     { emoji: '💜', label: 'Deep Feeler'     },
  cultural_nomad:  { emoji: '🌍', label: 'Cultural Nomad'  },
  obsessive_fan:   { emoji: '⚡', label: 'Obsessive Fan'   },
  social_listener: { emoji: '👥', label: 'Social Listener' },
  zen_drifter:     { emoji: '🌊', label: 'Zen Drifter'     },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getCreatorProfile(username);
  if (!profile) return generatePageMetadata('Creator not found', '', '/');
  return generatePageMetadata(
    `${profile.displayName} on Zik4U`,
    `${profile.displayName}'s real music taste — live listening feed, exclusive drops. ${profile.totalSubscribers} subscribers.`,
    `/creator/${username}`,
  );
}

export default async function CreatorPublicPage({ params }: Props) {
  const { username } = await params;
  const profile = await getCreatorProfile(username);
  if (!profile) notFound();

  const supabase = createServiceClient();

  // Écoutes récentes (les 5 dernières)
  const { data: recentScrobbles } = await supabase
    .from('scrobbles')
    .select('track_title, artist_name, album_name, cover_art_url, played_at')
    .eq('user_id', profile.id)
    .order('played_at', { ascending: false })
    .limit(5);

  // Mood actuel
  const { data: userData } = await supabase
    .from('users')
    .select('current_mood, mood_expires_at')
    .eq('id', profile.id)
    .single();

  const currentMood = userData?.mood_expires_at &&
    new Date(userData.mood_expires_at) > new Date()
    ? userData.current_mood
    : null;

  // Archétype
  const { data: archetypeData } = await supabase
    .from('listener_archetypes')
    .select('archetype')
    .eq('user_id', profile.id)
    .single();

  // Drops récents (posts exclusifs publics)
  const { data: recentDrops } = await supabase
    .from('posts')
    .select('id, content, track_title, artist_name, cover_art_url, drop_mood, created_at, likes_count')
    .eq('user_id', profile.id)
    .eq('post_type', 'drop')
    .order('created_at', { ascending: false })
    .limit(3);

  const mood = currentMood ? MOOD_CONFIG[currentMood as string] : null;
  const archetype = archetypeData?.archetype
    ? ARCHETYPE_CONFIG[archetypeData.archetype as string]
    : null;
  const nowPlaying = recentScrobbles?.[0];

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: C.bg,
      fontFamily: 'Inter, system-ui, sans-serif', color: C.text,
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', maxWidth: 780, margin: '0 auto',
      }}>
        <a href="/" style={{
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontWeight: 900, fontSize: 20, letterSpacing: '0.2em', textDecoration: 'none',
        }}>ZIK4U</a>
        <a href="/fans" style={{
          fontSize: 13, color: C.muted, textDecoration: 'none',
        }}>Find more creators →</a>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 32 }}>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                border: `2px solid ${mood?.color ?? C.border}` }}
            />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 900,
            }}>
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>
                {profile.displayName}
              </h1>
              {mood && (
                <span style={{
                  fontSize: 12, padding: '3px 10px',
                  background: `${mood.color}15`,
                  border: `1px solid ${mood.color}30`,
                  borderRadius: 999, color: mood.color,
                }}>
                  {mood.emoji} {mood.label}
                </span>
              )}
            </div>
            <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 8px' }}>
              @{profile.username}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: C.text }}>
                <strong>{profile.totalSubscribers}</strong>
                <span style={{ color: C.muted }}> subscribers</span>
              </span>
              {archetype && (
                <span style={{ fontSize: 13, color: C.muted }}>
                  {archetype.emoji} {archetype.label}
                </span>
              )}
            </div>
            {profile.bio && (
              <p style={{ fontSize: 14, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Écoute en cours */}
        {nowPlaying && (
          <div style={{
            background: `linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,255,178,0.04))`,
            border: `1px solid rgba(0,212,255,0.2)`,
            borderRadius: 16, padding: 20, marginBottom: 20,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              color: C.cyan, textTransform: 'uppercase', marginBottom: 10 }}>
              ▶ Recently played
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {(nowPlaying as any).cover_art_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(nowPlaying as any).cover_art_url} alt=""
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
              )}
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>
                  {(nowPlaying as any).track_title}
                </p>
                <p style={{ fontSize: 13, color: C.muted, margin: '2px 0 0' }}>
                  {(nowPlaying as any).artist_name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top artistes */}
        {profile.topArtists.length > 0 && (
          <div style={{
            background: C.card, borderRadius: 16, padding: 20,
            border: `1px solid ${C.border}`, marginBottom: 20,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              color: C.muted, textTransform: 'uppercase', marginBottom: 12 }}>
              Top Artists
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile.topArtists.map(artist => (
                <span key={artist} style={{
                  padding: '5px 12px', background: 'rgba(255,255,255,0.05)',
                  borderRadius: 999, fontSize: 13, border: `1px solid ${C.border}`,
                }}>
                  {artist}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Drops récents */}
        {(recentDrops?.length ?? 0) > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              color: C.pink, textTransform: 'uppercase', marginBottom: 14 }}>
              Latest Drops
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(recentDrops ?? []).map((drop: any) => (
                <div key={drop.id} style={{
                  background: C.card, borderRadius: 14, padding: '14px 18px',
                  border: `1px solid rgba(255,60,172,0.15)`,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  {drop.cover_art_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={drop.cover_art_url} alt=""
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                      {drop.track_title ?? 'Drop'}
                    </p>
                    <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>
                      {drop.artist_name}
                      {drop.content ? ` — "${drop.content}"` : ''}
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: C.muted }}>{drop.likes_count} ♥</span>
                </div>
              ))}
            </div>
            <p style={{
              fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 10,
              fontStyle: 'italic',
            }}>
              Subscribe to access all exclusive drops →
            </p>
          </div>
        )}

        {/* Abonnement */}
        {profile.tiers.length > 0 && (
          <div style={{
            background: `linear-gradient(135deg, rgba(255,60,172,0.06), rgba(123,47,255,0.04))`,
            borderRadius: 20, padding: 28,
            border: '1px solid rgba(255,60,172,0.15)',
            marginBottom: 24, textAlign: 'center',
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
              Subscribe to {profile.displayName}
            </h2>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Real-time listening feed · Exclusive Drops · Music compatibility score
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {profile.tiers
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(tier => (
                  <div key={tier.id} style={{
                    background: C.card, borderRadius: 12, padding: '16px 20px',
                    border: `1px solid ${C.border}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{tier.name}</p>
                      {tier.description && (
                        <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>
                          {tier.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 900, fontSize: 18, color: C.mint, margin: 0 }}>
                        ${tier.priceWeb.toFixed(2)}
                      </p>
                      <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>/month</p>
                    </div>
                  </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={APP_STORE_URL} style={{
                display: 'block', padding: '14px', borderRadius: 12,
                background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                color: C.text, fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>
                Subscribe on iOS →
              </a>
              <a href={PLAY_STORE_URL} style={{
                display: 'block', padding: '14px', borderRadius: 12,
                background: C.card, border: `1px solid ${C.border}`,
                color: C.text, fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>
                Subscribe on Android →
              </a>
              <p style={{
                fontSize: 11, color: 'rgba(255,255,255,0.25)',
                textAlign: 'center', marginTop: 4,
              }}>
                ✓ Best price — direct web subscription
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <p style={{ textAlign: 'center', color: C.muted, fontSize: 12 }}>
          Powered by{' '}
          <a href="/" style={{ color: C.cyan, textDecoration: 'none' }}>Zik4U</a>
          {' '}— Your real music identity.
        </p>
      </div>
    </main>
  );
}
