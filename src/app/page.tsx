'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
        {/* Listener */}
        <button
          onClick={() => router.push('/listeners')}
          style={{
            width: '100%',
            padding: '20px 32px',
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
            border: 'none',
            borderRadius: 16,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0A0A1A' }}>
            Listener
          </span>
          <span style={{ fontSize: 13, color: 'rgba(10,10,26,0.6)', fontWeight: 500 }}>
            Discover people who listen like you. For real.
          </span>
        </button>

        {/* Creator */}
        <button
          onClick={() => router.push('/creators')}
          style={{
            width: '100%',
            padding: '20px 32px',
            background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
            border: 'none',
            borderRadius: 16,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
            Creator
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            Monetize your listens. For real.
          </span>
        </button>

        {/* Fan */}
        <button
          onClick={() => router.push('/fans')}
          style={{
            width: '100%',
            padding: '20px 32px',
            background: '#12122A',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
            Fan
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
            Your favorite artist. What they really listen to.
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
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#00D4FF',
          textTransform: 'uppercase',
          background: 'rgba(0,212,255,0.08)',
          padding: '6px 16px',
          borderRadius: 999,
          border: '1px solid rgba(0,212,255,0.2)',
        }}>
          Early Access  ·  Join Now
        </span>
      </motion.div>

      {/* Footer links */}
      <div style={{
        position: 'fixed',
        bottom: 24,
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
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.2)',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

    </main>
  );
}
