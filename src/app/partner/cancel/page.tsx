'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

const C = {
  bg: '#0A0A1A', card: '#12122A', cyan: '#00D4FF',
  mint: '#00FFB2', muted: 'rgba(255,255,255,0.5)',
};

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') ?? 'insight';

  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>↩</div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
          No worries.
        </h1>
        <p style={{ color: C.muted, fontSize: '15px', marginBottom: '32px', lineHeight: 1.7 }}>
          Your subscription wasn&apos;t activated.{' '}
          You can start with the free Discover plan and upgrade whenever you&apos;re ready.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => router.push(`/partner#${plan}`)}
            style={{ padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
              color: '#0A0A1A', fontWeight: 700, fontSize: '15px',
              fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Try again →
          </button>
          <button
            onClick={() => router.push('/partner')}
            style={{ padding: '12px', borderRadius: '12px', cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)', fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Start with Discover — free
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function PartnerCancelPage() {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%',
          border: '2px solid #00D4FF', borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    }>
      <CancelContent />
    </Suspense>
  );
}
