'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const FEATURES = [
  {
    emoji: '🎯',
    title: 'Music Compatibility Score',
    body: "Match with people who listen exactly like you. 0 to 100%. Real data, not algorithmic guessing.",
  },
  {
    emoji: '🃏',
    title: 'Now Card',
    body: "Generate a shareable card of what you're listening to right now. Post it on TikTok, Instagram, anywhere.",
  },
  {
    emoji: '📡',
    title: 'Real Listening Feed',
    body: 'A social feed where every post is a real listen. No curation. No performance. Just truth.',
  },
  {
    emoji: '🔥',
    title: 'Listening Streaks',
    body: "Stay consistent. See your friends' streaks. Music as a daily habit, together.",
  },
];

export default function ListenersPage() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1A',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#fff',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            border: 'none',
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.2em',
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          ZIK4U
        </button>
        <button
          onClick={() => router.push('/creators')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          Are you a creator? →
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 120px' }}>

        {/* BLOC 1 — Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#00D4FF',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Free. Always.
          </p>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 32,
          }}>
            What are they
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #00D4FF, #00FFB2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              really listening to?
            </span>
          </h1>
          <p style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            maxWidth: 520,
          }}>
            Not their public playlist. Not their curated feed.
            Their 2am rotation. Their pre-show ritual.
            Their guilty pleasure on repeat.
          </p>
        </motion.div>

        {/* BLOC 2 — Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: 32, minWidth: 40 }}>{f.emoji}</span>
                <div>
                  <p style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 8,
                  }}>
                    {f.title}
                  </p>
                  <p style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.6,
                  }}>
                    {f.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BLOC 3 — Now Card visual teaser */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #7B2FFF, #FF3CAC)',
            borderRadius: 32,
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '50%',
            }} />
            <p style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Now Card
            </p>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 40px)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}>
              Your music.
              <br />
              Shareable in one tap.
            </h2>
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              maxWidth: 400,
            }}>
              Generate your Now Card. Share it on Instagram, TikTok, anywhere.
              Let your real taste speak for itself.
            </p>
          </div>
        </motion.div>

        {/* BLOC 4 — CTA stores */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900,
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}>
            Free. Forever.
          </h2>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 40,
          }}>
            Download the app. Start listening. Start connecting.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 320,
            margin: '0 auto',
          }}>
            <a
              href={APP_STORE_URL}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '18px 32px',
                background: '#fff',
                borderRadius: 16,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                color: '#0A0A1A',
              }}
            >
              <span style={{ fontSize: 22 }}>🍎</span>
              Download on App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '18px 32px',
                background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
                borderRadius: 16,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                color: '#0A0A1A',
              }}
            >
              <span style={{ fontSize: 22 }}>▶</span>
              Get it on Google Play
            </a>
          </div>
          <p style={{
            marginTop: 24,
            fontSize: 13,
            color: 'rgba(255,255,255,0.2)',
          }}>
            Already have Zik4U?{' '}
            <a
              href="zik4u://home"
              style={{ color: '#00D4FF', textDecoration: 'none' }}
            >
              Open the app →
            </a>
          </p>
        </motion.div>

      </div>
    </main>
  );
}
