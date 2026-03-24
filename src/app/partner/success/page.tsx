'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

const C = {
  bg: '#0A0A1A', card: '#12122A', cyan: '#00D4FF',
  mint: '#00FFB2', pink: '#FF3CAC', muted: 'rgba(255,255,255,0.5)',
};

const PLAN_LABEL: Record<string, string> = {
  insight:      'Insight',
  intelligence: 'Intelligence',
  enterprise:   'Enterprise',
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') ?? 'insight';

  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
          style={{ fontSize: '72px', marginBottom: '24px' }}
        >
          🔥
        </motion.div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
          Access activated.
        </h1>
        <p style={{ color: C.muted, fontSize: '17px', marginBottom: '8px' }}>
          Your <strong style={{ color: '#fff' }}>Zik4U {PLAN_LABEL[plan] ?? plan}</strong> subscription is now active.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '40px' }}>
          Your API key has been sent to your email address.
          Check your inbox — it&apos;s ready to use.
        </p>

        <div style={{ background: C.card, border: `1px solid rgba(0,212,255,0.2)`,
          borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '12px' }}>Quick start</p>
          <pre style={{ background: '#0A0A1A', borderRadius: '8px', padding: '14px',
            fontSize: '12px', color: C.mint, overflowX: 'auto', margin: 0, lineHeight: 1.7,
            fontFamily: 'monospace' }}>
{`curl "https://admin.zik4u.com/api/insights/artist
  ?artist=Billie+Eilish&days=30"
  -H "X-Zik4U-Key: zik4u_live_..."`}
          </pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => router.push('/partner/dashboard')}
            style={{ padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
              color: '#0A0A1A', fontWeight: 700, fontSize: '15px',
              fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Open my dashboard →
          </button>
          <button
            onClick={() => router.push('/partner')}
            style={{ padding: '12px', borderRadius: '12px', cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)', fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Back to partner page
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function PartnerSuccessPage() {
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
      <SuccessContent />
    </Suspense>
  );
}
