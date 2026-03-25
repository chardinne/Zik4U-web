'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const PLATFORMS = [
  {
    id: 'spotify',
    name: 'Spotify',
    color: '#1DB954',
    title: 'Thank you, Spotify.',
    body: `Spotify changed music forever. By making every song on earth accessible to everyone, you gave millions of people the freedom to explore, discover and fall in love with music they would never have found otherwise.\n\nZik4U exists because of what you built. We capture what people listen to on Spotify — their real, unfiltered musical identity — and we give that listening a social dimension it never had before.\n\nWe don't compete with what you do. We add the human layer on top: the connections, the emotions, the communities that form around shared music. Every stream on Spotify can now become a social act on Zik4U.\n\nWe see you as a foundation, not a rival. And we're grateful.`,
  },
  {
    id: 'appleMusic',
    name: 'Apple Music',
    color: '#FC3C44',
    title: 'Thank you, Apple Music.',
    body: `Apple Music brought something rare to streaming: a genuine respect for artists and the integrity of their work. From editorial curation to lossless audio, you've always treated music as something worth caring about deeply.\n\nThat philosophy resonates with everything Zik4U stands for. We believe listening is an intimate act — and Apple Music users tend to listen that way too. Deeply, intentionally, with loyalty.\n\nWhen an Apple Music listener connects to Zik4U, we see that depth reflected in their data: longer sessions, stronger artist loyalty, more emotional intensity. You've cultivated an audience that takes music seriously.\n\nZik4U simply makes that seriousness visible — and social. Thank you for the infrastructure that makes it possible.`,
  },
  {
    id: 'youtubeMusic',
    name: 'YouTube Music',
    color: '#FF0000',
    title: 'Thank you, YouTube Music.',
    body: `YouTube democratized music in a way no one else had: you made every artist, every genre, every era available — for free. That openness has shaped an entire generation of listeners who discovered music through you.\n\nYouTube Music carries that legacy forward with the full depth of the YouTube catalog behind it. It's where people discover the unexpected: a live session, a deep cut, an artist who hasn't been signed yet but will be.\n\nZik4U loves YouTube Music listeners for exactly that reason — they're explorers. Our data consistently shows YouTube Music users discovering more new artists per week than any other platform.\n\nYou built the world's biggest music discovery engine. We help people share what they find there. That feels like a natural partnership.`,
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    color: '#FF5500',
    title: 'Thank you, SoundCloud.',
    body: `SoundCloud gave artists a voice before anyone else would listen. Before deals, before playlists, before algorithms — there was SoundCloud, and there was a bedroom producer uploading something raw and real at 2am.\n\nThat spirit of authenticity is in Zik4U's DNA. We were built on the belief that real listening — not curated, not performed, not filtered — is the most honest signal in music.\n\nSoundCloud listeners are often the first. The first to hear an artist before they chart. The first to share something no one else knows yet. Our "First Ear" feature — which tracks who discovered an artist first on Zik4U — was inspired by exactly that culture.\n\nThank you for proving that authenticity scales. We're building on that proof every day.`,
  },
] as const;

type Platform = typeof PLATFORMS[number];

function PlatformModal({ platform, onClose }: { platform: Platform; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', duration: 0.4 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#12122A',
            border: `1px solid ${platform.color}30`,
            borderRadius: 20,
            padding: 'clamp(24px, 4vw, 40px)',
            maxWidth: 520,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              float: 'right', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.3)', fontSize: 20,
              cursor: 'pointer', lineHeight: 1, padding: 0,
            }}
          >
            ✕
          </button>

          {/* Platform name pill */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              color: platform.color, textTransform: 'uppercase',
              background: `${platform.color}12`,
              border: `1px solid ${platform.color}30`,
              borderRadius: 999, padding: '4px 12px',
            }}>
              {platform.name}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.2, marginBottom: 20,
          }}>
            {platform.title}
          </h2>

          {/* Body */}
          {platform.body.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontSize: 14, color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8, margin: '0 0 16px',
            }}>
              {para}
            </p>
          ))}

          {/* Footer */}
          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Zik4U adds. Never subtracts.
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);

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

      {/* Modal */}
      {activePlatform && (
        <PlatformModal
          platform={activePlatform}
          onClose={() => setActivePlatform(null)}
        />
      )}

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

      {/* Plateformes — remerciements cliquables */}
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
          <button
            key={p.id}
            onClick={() => setActivePlatform(p)}
            style={{
              background: 'none', border: 'none',
              fontSize: 13, fontWeight: 700,
              color: p.color, opacity: 0.6,
              cursor: 'pointer', padding: '2px 6px',
              borderRadius: 6, transition: 'opacity 0.2s',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            {p.name}
          </button>
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
