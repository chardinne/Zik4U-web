'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PLATFORMS = [
  { id: 'spotify',       name: 'Spotify',       color: '#1DB954', slug: 'spotify'       },
  { id: 'appleMusic',    name: 'Apple Music',   color: '#FC3C44', slug: 'apple-music'   },
  { id: 'youtubeMusic',  name: 'YouTube Music', color: '#FF0000', slug: 'youtube-music' },
  { id: 'soundcloud',    name: 'SoundCloud',    color: '#FF5500', slug: 'soundcloud'    },
] as const;

export default function HomePage() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 64 }}
      >
        <span style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: '0.2em',
          background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ZIK4U
        </span>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ textAlign: 'center', maxWidth: 680, marginBottom: 80 }}
      >
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.05,
          marginBottom: 24,
          letterSpacing: '-0.02em',
        }}>
          The social network built on
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            what you actually listen to.
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 24,
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          For real.
        </motion.p>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Not your curated playlist. Not your public profile.
          <br />
          Your real listening identity. Live, shared, monetized.
        </p>
      </motion.div>

      {/* 3 portes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <button
          onClick={() => router.push('/listeners')}
          style={{
            width: '100%', padding: '20px 32px',
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
            border: 'none', borderRadius: 16, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0A0A1A' }}>Listener</span>
          <span style={{ fontSize: 12, color: 'rgba(10,10,26,0.6)', fontWeight: 500 }}>
            Discover people who listen like you. For real.
          </span>
        </button>

        <button
          onClick={() => router.push('/creators')}
          style={{
            width: '100%', padding: '20px 32px',
            background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
            border: 'none', borderRadius: 16, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Creator</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            Monetize your listens. For real.
          </span>
        </button>

        <button
          onClick={() => router.push('/fans')}
          style={{
            width: '100%', padding: '20px 32px',
            background: '#12122A',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Fan</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' as const }}>
            See what your favorite artist listens to. For real.
          </span>
        </button>
      </motion.div>

      {/* Early access badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ marginTop: 48 }}
      >
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
          color: '#00D4FF', textTransform: 'uppercase',
          background: 'rgba(0,212,255,0.08)',
          padding: '6px 16px', borderRadius: 999,
          border: '1px solid rgba(0,212,255,0.2)',
        }}>
          Early Access  ·  Join Now
        </span>
      </motion.div>

      {/* Plateformes — liens vers pages dédiées */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          works with
        </span>
        {PLATFORMS.map((p) => (
          <Link
            key={p.id}
            href={`/works-with/${p.slug}`}
            style={{
              fontSize: 13, fontWeight: 700,
              color: p.color, opacity: 0.6,
              textDecoration: 'none',
              padding: '2px 6px',
              borderRadius: 6, transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            {p.name}
          </Link>
        ))}
      </motion.div>

      {/* Footer links */}
      <div style={{
        marginTop: 24,
        display: 'flex',
        gap: 24,
      }}>
        {[
          { label: 'Privacy', href: '/legal/privacy' },
          { label: 'Terms', href: '/legal/terms' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}
          >
            {link.label}
          </a>
        ))}
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
        <a
          href="/partner"
          style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontSize: '13px' }}
          onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#00D4FF'; }}
          onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)'; }}
        >
          For labels & researchers →
        </a>
      </div>

    </main>
  );
}
