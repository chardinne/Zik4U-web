'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 400 }}
      >
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: 16,
        }}>
          404
        </div>
        <h1 style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#fff',
          marginBottom: 12,
        }}>
          This track doesn&apos;t exist.
        </h1>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.6,
          marginBottom: 40,
        }}>
          The page you&apos;re looking for isn&apos;t here.
          But your music identity is.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 700,
              color: '#0A0A1A',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Back to Zik4U →
          </button>
          <button
            onClick={() => router.push('/fans')}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              cursor: 'pointer',
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Find a creator
          </button>
        </div>
      </motion.div>
    </main>
  );
}
