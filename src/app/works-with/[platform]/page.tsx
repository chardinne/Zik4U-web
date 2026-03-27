'use client';

import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';

const C = {
  bg:     '#0A0A1A',
  card:   '#12122A',
  border: 'rgba(255,255,255,0.08)',
  cyan:   '#00D4FF',
  mint:   '#00FFB2',
  pink:   '#FF3CAC',
  purple: '#7B2FFF',
  text:   '#fff',
  muted:  'rgba(255,255,255,0.45)',
};

const PLATFORM_DATA = {
  spotify: {
    name: 'Spotify',
    color: '#1DB954',
    slug: 'spotify',
    headline: 'Spotify + Zik4U.',
    tagline: 'Your Spotify streams. The social layer they were missing.',
    hero: `Spotify sees everything you listen to — within Spotify.\n\nBut a listener who plays Spotify in the morning, Apple Music at night, and local MP3 files on their commute? No single platform sees the full picture. Until Zik4U.`,
    aggregation: {
      title: 'Your Spotify streams. Part of something bigger.',
      body: `Zik4U builds unified listening profiles that aggregate every source — Spotify, Apple Music, YouTube Music, SoundCloud, local files — into a single musical identity. The result is a portrait of who someone truly is as a listener, not just who they are on one platform.\n\nFor Spotify users, this means their streams are part of a richer story: one that includes their whole musical life, not just the fraction that lives on Spotify. More context. More depth. More meaning.`,
    },
    unique: [
      {
        emoji: '🎯',
        title: 'Compatibility scores',
        body: "Two Spotify users might share 40% of their streams — but if one also listens to jazz on Apple Music and the other to techno on local files, their real compatibility is completely different. Zik4U sees both.",
      },
      {
        emoji: '🌙',
        title: 'Emotional depth',
        body: "Spotify knows when you played a song. Zik4U knows it was the 4th time this week, at midnight, after a different mood session earlier. That context is what turns a stream into a signal.",
      },
      {
        emoji: '🔥',
        title: 'Pre-viral detection',
        body: "When multiple Zik4U users independently discover the same Spotify track within hours of each other — from different playlists, different contexts — that's a pre-viral signal no single-platform view could catch.",
      },
    ],
    how: `When a user connects Spotify to Zik4U, they explicitly authorize the capture of their listening metadata — track title, artist, timestamp, duration. Nothing else.\n\nZik4U never touches your audio stream. Never stores platform IDs. Never accesses playlists or account data. Every play triggered from Zik4U returns to Spotify via deep link — you keep 100% of the stream and the royalty.\n\nThis is the Last.fm model, legally established since 2003. We follow it — with stronger privacy guarantees.`,
    cta: 'Connect Spotify in the app',
    ctaHref: 'https://zik4u.com/listeners',
  },

  'apple-music': {
    name: 'Apple Music',
    color: '#FC3C44',
    slug: 'apple-music',
    headline: 'Apple Music + Zik4U.',
    tagline: 'Intentional listening deserves an identity.',
    hero: `Apple Music users are among the most intentional listeners in the world. They choose lossless. They follow editorial curation. They build real relationships with music.\n\nBut even the most dedicated Apple Music listener also discovers things on YouTube, revisits old favourites via local files, or explores something new on SoundCloud. That listening doesn't disappear — it just goes untracked, unrecognised, unshared.`,
    aggregation: {
      title: 'Apple Music is one voice. Your profile is the full choir.',
      body: `When a user connects Zik4U, their Apple Music streams join their Spotify plays, their YouTube Music discoveries, and their local library in a single aggregated profile. The result reflects who they actually are — not who they are on one service.\n\nThis unified profile is what powers Zik4U's social features: compatibility scores, Now Cards, Pulse listening rooms. None of this is possible with a single-platform view.\n\nApple Music provides the streams. Zik4U provides the identity.`,
    },
    unique: [
      {
        emoji: '💜',
        title: 'Emotional loyalty signals',
        body: "Apple Music listeners tend toward depth — fewer artists, more plays, stronger repeat patterns. Zik4U captures that loyalty signal and makes it visible: a profile that reflects genuine dedication, not algorithmic noise.",
      },
      {
        emoji: '🎵',
        title: 'Lossless taste, social presence',
        body: "Apple Music users care about quality. Zik4U gives that care a social dimension — a Now Card that says not just what you're listening to, but how deeply you listen to it.",
      },
      {
        emoji: '🔗',
        title: 'Cross-platform identity',
        body: "Many Apple Music users also use Spotify in shared contexts or YouTube Music for discovery. Zik4U is the only place their complete listening identity is visible — as one coherent profile.",
      },
    ],
    how: `Apple Music integration on iOS uses the MusicKit framework — Zik4U requests access to recently played tracks via Apple's official API. No account credentials. No password. No audio.\n\nTimestamps are rounded to the nearest minute before storage. Platform-specific IDs are stripped. The result is a privacy-safe metadata record that belongs to the user — not to any platform.\n\nEvery play triggered from Zik4U returns to Apple Music via deep link.`,
    cta: 'Connect Apple Music in the app',
    ctaHref: 'https://zik4u.com/listeners',
  },

  'youtube-music': {
    name: 'YouTube Music',
    color: '#FF0000',
    slug: 'youtube-music',
    headline: 'YouTube Music + Zik4U.',
    tagline: 'Discovery without memory is just noise.',
    hero: `YouTube Music is where discovery happens. The deep cut, the live session, the artist who isn't signed yet — YouTube Music listeners find things no algorithm would have served them.\n\nBut discovery without memory is just noise. When someone finds something extraordinary at 2AM on YouTube Music, that moment usually disappears. No trace. No record. No way to share it with the people who would care.`,
    aggregation: {
      title: 'YouTube Music finds it. Zik4U remembers it.',
      body: `Zik4U captures that moment — and joins it to every other source in a unified listening profile. The discovery doesn't vanish. It becomes part of who you are as a listener.\n\nOur data consistently shows that multi-source listeners — people who use YouTube Music alongside other platforms — discover 3× more artists per month than single-platform users. Zik4U is built for exactly those people: the ones who don't stay in one box.\n\nYouTube Music brings the catalog breadth. Zik4U brings the continuity.`,
    },
    unique: [
      {
        emoji: '⚡',
        title: 'First Ear — before anyone else',
        body: "YouTube Music listeners are often the first to find an emerging artist. Zik4U's First Ear feature timestamps that discovery — proof that you were there before the algorithm caught up.",
      },
      {
        emoji: '🌍',
        title: 'The explorer archetype',
        body: "YouTube Music users consistently profile as Cultural Nomads in Zik4U's archetype system — high diversity, low repeat rate, constant discovery. That profile is visible, shareable, and socially valuable.",
      },
      {
        emoji: '📡',
        title: 'Passive detection — no account needed',
        body: "On Android, Zik4U can detect YouTube Music plays via system notifications — no OAuth, no login, no account access. The user simply grants notification reading permission.",
      },
    ],
    how: `YouTube Music detection on Android works via system playback notifications — the same information displayed in your notification bar. Zik4U reads the track title and artist from that notification. No account access. No API calls to YouTube servers.\n\nOn iOS, YouTube Music detection follows the same passive notification model. No credentials are ever requested or stored.\n\nEvery play triggered from Zik4U returns to YouTube Music via deep link.`,
    cta: 'Connect YouTube Music in the app',
    ctaHref: 'https://zik4u.com/listeners',
  },

  soundcloud: {
    name: 'SoundCloud',
    color: '#FF5500',
    slug: 'soundcloud',
    headline: 'SoundCloud + Zik4U.',
    tagline: 'You were there first. Prove it.',
    hero: `SoundCloud is where music starts. Before the deal, before the playlist, before the chart — there's a SoundCloud upload, and there's someone listening who will remember it forever.\n\nThat first listen is the most valuable moment in music. It's also the hardest to capture. Most platforms only see a track once it has traction. Zik4U sees it from the very first play.`,
    aggregation: {
      title: "SoundCloud finds the future. Zik4U remembers who was there first.",
      body: `SoundCloud listeners rarely use only SoundCloud. They're on Spotify for catalogues, Apple Music for quality, YouTube Music for discovery. Zik4U aggregates all of it into a profile that finally does justice to how eclectic these listeners actually are.\n\nThe result is a musical identity that reflects the full range — not just the underground, not just the mainstream, but the complete picture of someone who refuses to stay in one genre.\n\nSoundCloud is where authenticity lives. Zik4U is where it becomes visible.`,
    },
    unique: [
      {
        emoji: '🏆',
        title: 'First Ear — timestamped discovery',
        body: "When a Zik4U user discovers an artist first, that moment is timestamped and visible on their profile — permanent proof of a discovery that predates any algorithm. Built for SoundCloud culture.",
      },
      {
        emoji: '🎙️',
        title: 'The underground, made social',
        body: "SoundCloud tracks that never make it to Spotify are still captured by Zik4U. A bedroom producer's upload heard by 12 people — if those 12 are on Zik4U, that listening is recorded and shared.",
      },
      {
        emoji: '📊',
        title: 'Pre-viral signal, raw',
        body: "SoundCloud is often where virality starts before it's detectable anywhere else. Zik4U's virality model catches these signals at the source — before the track has a Spotify release.",
      },
    ],
    how: `SoundCloud integration uses OAuth — the user authorizes Zik4U to read their recently played tracks via SoundCloud's official API. No password is stored. The OAuth token is encrypted and used only for metadata retrieval.\n\nWhat we capture: track title, artist name, timestamp (rounded), duration. What we never touch: audio, account settings, payment info, uploads.\n\nEvery play triggered from Zik4U returns to SoundCloud via deep link.`,
    cta: 'Connect SoundCloud in the app',
    ctaHref: 'https://zik4u.com/listeners',
  },
} as const;

type PlatformSlug = keyof typeof PLATFORM_DATA;

export default function WorksWithPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.platform as string;

  const data = PLATFORM_DATA[slug as PlatformSlug];
  if (!data) return notFound();

  const otherPlatforms = Object.values(PLATFORM_DATA).filter(p => p.slug !== slug);

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: C.bg,
      color: C.text, fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', maxWidth: 860, margin: '0 auto',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => router.push('/')} style={{
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          border: 'none', fontSize: 20, fontWeight: 900,
          letterSpacing: '0.2em', cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif', padding: 0,
        }}>
          ZIK4U
        </button>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {otherPlatforms.map(p => (
            <button key={p.slug}
              onClick={() => router.push(`/works-with/${p.slug}`)}
              style={{
                background: 'none', border: 'none',
                fontSize: 12, fontWeight: 700,
                color: p.color, opacity: 0.5, cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
            >
              {p.name}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px 100px' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ padding: '72px 0 56px' }}
        >
          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              color: data.color, textTransform: 'uppercase' as const,
              background: `${data.color}12`,
              border: `1px solid ${data.color}30`,
              borderRadius: 999, padding: '4px 14px',
            }}>
              {data.name} × Zik4U
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            {data.headline}
          </h1>
          <p style={{
            fontSize: 20, color: data.color,
            fontWeight: 600, marginBottom: 32,
          }}>
            {data.tagline}
          </p>
          {data.hero.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontSize: 17, color: C.muted,
              lineHeight: 1.8, marginBottom: 16, maxWidth: 640,
            }}>
              {para}
            </p>
          ))}
        </motion.div>

        {/* Aggregation — le concept clé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: `${data.color}08`,
            border: `1px solid ${data.color}25`,
            borderRadius: 20, padding: '40px',
            marginBottom: 64,
          }}
        >
          <h2 style={{
            fontSize: 22, fontWeight: 900, marginBottom: 20,
            color: data.color,
          }}>
            {data.aggregation.title}
          </h2>
          {data.aggregation.body.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontSize: 15, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.8, marginBottom: 12,
            }}>
              {para}
            </p>
          ))}

          {/* Schéma visuel agrégation */}
          <div style={{
            marginTop: 32, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', gap: 8,
          }}>
            {['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud', 'Local files'].map((src, i) => (
              <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  background: C.card,
                  border: src === data.name
                    ? `1px solid ${data.color}`
                    : `1px solid ${C.border}`,
                  borderRadius: 8, padding: '6px 12px',
                  fontSize: 12, fontWeight: src === data.name ? 700 : 400,
                  color: src === data.name ? data.color : C.muted,
                }}>
                  {src}
                </span>
                {i < 4 && (
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>+</span>
                )}
              </div>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18, margin: '0 4px' }}>→</span>
            <span style={{
              background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
              borderRadius: 8, padding: '6px 14px',
              fontSize: 12, fontWeight: 700, color: '#0A0A1A',
            }}>
              One unified profile
            </span>
          </div>
        </motion.div>

        {/* 3 unique features pour cette plateforme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64 }}
        >
          <h2 style={{
            fontSize: 22, fontWeight: 900,
            marginBottom: 8,
          }}>
            What Zik4U adds to your {data.name} listens.
          </h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>
            Features that only exist because Zik4U sees across platforms.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {data.unique.map(feat => (
              <div key={feat.title} style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${data.color}`,
                borderRadius: 14, padding: '24px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{feat.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                  {feat.title}
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                  {feat.body}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comment ça marche techniquement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64 }}
        >
          <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20, padding: '40px',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
              How Zik4U works with {data.name}. Technically.
            </h2>
            {data.how.split('\n\n').map((para, i) => (
              <p key={i} style={{
                fontSize: 14, color: C.muted,
                lineHeight: 1.8, marginBottom: 12,
              }}>
                {para}
              </p>
            ))}
            <div style={{
              marginTop: 24, paddingTop: 20,
              borderTop: `1px solid ${C.border}`,
              display: 'flex', gap: 24, flexWrap: 'wrap',
            }}>
              {[
                { icon: '✓', text: 'Zero audio captured', color: C.mint },
                { icon: '✓', text: 'No platform credentials stored', color: C.mint },
                { icon: '✓', text: 'GDPR compliant', color: C.mint },
                { icon: '✓', text: '100% of streams stay on ' + data.name, color: C.mint },
              ].map(g => (
                <div key={g.text} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12,
                }}>
                  <span style={{ color: g.color, fontWeight: 700 }}>{g.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>
            Ready to make your {data.name} listens social?
          </h2>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>
            Download Zik4U. Connect {data.name}. Your listening identity starts now.
          </p>
          <a href={data.ctaHref} style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${data.color}, ${C.cyan})`,
            borderRadius: 14, padding: '16px 40px',
            color: '#0A0A1A', fontSize: 15, fontWeight: 900,
            textDecoration: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {data.cta} →
          </a>
          <p style={{
            color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 16,
          }}>
            Free. No credit card.
          </p>
        </motion.div>

      </div>
    </main>
  );
}
