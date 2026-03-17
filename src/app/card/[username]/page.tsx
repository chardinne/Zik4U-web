import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ username: string }>;
}

function getMoodFromHour(hour: number): { label: string; gradient: [string, string] } {
  if (hour >= 0 && hour < 6)   return { label: 'Night Owl',    gradient: ['#0A0A2E', '#1A0A3E'] };
  if (hour >= 6 && hour < 12)  return { label: 'Morning Hype', gradient: ['#FF6B35', '#FF3CAC'] };
  if (hour >= 12 && hour < 17) return { label: 'In The Rush',  gradient: ['#00D4FF', '#00FFB2'] };
  if (hour >= 17 && hour < 21) return { label: 'Explorer',     gradient: ['#7B2FFF', '#FF3CAC'] };
  return                               { label: 'Late Night',   gradient: ['#12122A', '#1A0A2E'] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) {
    return { title: 'Zik4U: Musical Identity' };
  }

  const displayName = profile.display_name ?? profile.username;

  return {
    title: `${displayName} on Zik4U`,
    description: `Discover what @${profile.username} is listening to. Join Zik4U, the social network built around real music.`,
    openGraph: {
      title: `${displayName} on Zik4U`,
      description: `See @${profile.username}'s listening identity. Download Zik4U.`,
      images: profile.avatar_url ? [{ url: profile.avatar_url, width: 400, height: 400 }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${displayName} on Zik4U`,
      description: 'Real music identity. Download Zik4U.',
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { username } = await params;

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, current_streak')
    .eq('username', username)
    .single();

  if (!profile) redirect('/');

  // Fetch last scrobble
  const { data: scrobbles } = await supabase
    .from('scrobbles')
    .select('track_title, artist_name, played_at')
    .eq('user_id', profile.id)
    .order('played_at', { ascending: false })
    .limit(1);

  // Fetch top artist this week
  const { data: topArtistsRaw } = await supabase
    .rpc('get_user_top_artists', { p_user_id: profile.id, p_limit: 1 });

  const lastScrobble = scrobbles?.[0] ?? null;
  const topArtist = (topArtistsRaw as { artist_name: string }[] | null)?.[0]?.artist_name ?? null;
  const displayName = profile.display_name ?? profile.username;
  const streak = profile.current_streak ?? 0;

  const hour = new Date().getUTCHours();
  const mood = getMoodFromHour(hour);

  // IMPORTANT: APP_STORE_URL uses placeholder ID — update after App Store approval
  const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';
  const DEEP_LINK = `zik4u://profile/${username}`;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A1A', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 48px' }}>

      {/* Logo */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.15em', background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ZIK4U
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
          MUSICAL IDENTITY
        </span>
      </div>

      {/* Avatar + name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, gap: 8 }}>
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            width={80}
            height={80}
            style={{ borderRadius: '50%', border: '2px solid rgba(0,212,255,0.4)', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #FF3CAC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            🎵
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{displayName}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>@{username}</div>
        </div>
      </div>

      {/* Now Card */}
      <div style={{ width: '100%', maxWidth: 320, borderRadius: 24, overflow: 'hidden', marginBottom: 32, position: 'relative' }}>
        <div style={{ background: `linear-gradient(135deg, ${mood.gradient[0]}, ${mood.gradient[1]})`, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280, position: 'relative' }}>

          {/* Mood badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em' }}>
              NOW CARD
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 999 }}>
              {mood.label}
            </span>
          </div>

          {/* Last track */}
          {lastScrobble ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>LAST PLAYED</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{lastScrobble.track_title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{lastScrobble.artist_name}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>IDENTITY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Music lover</div>
            </div>
          )}

          {/* Top artist */}
          {topArtist && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>TOP THIS WEEK</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>🎤 {topArtist}</div>
            </div>
          )}

          {/* Streak */}
          {streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{streak} day streak</span>
            </div>
          )}

          {/* Watermark */}
          <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontWeight: 700 }}>
            ZIK4U
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
          Listen to what {displayName} hears
        </p>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Your music. Your identity. Real connections.
        </p>

        {/* App Store */}
        <a
          href={APP_STORE_URL}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#000', borderRadius: 14, padding: '14px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
        >
          <span style={{ fontSize: 22 }}>🍎</span>
          Download on the App Store
        </a>

        {/* Google Play */}
        <a
          href={PLAY_STORE_URL}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(90deg, #00D4FF, #00FFB2)', color: '#0A0A1A', borderRadius: 14, padding: '14px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
        >
          <span style={{ fontSize: 22 }}>▶</span>
          Get it on Google Play
        </a>

        {/* Deep link */}
        <a
          href={DEEP_LINK}
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginTop: 4 }}
        >
          Already have Zik4U? Open in app →
        </a>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
          ZIK4U · zik4u.com
        </span>
      </div>
    </main>
  );
}
