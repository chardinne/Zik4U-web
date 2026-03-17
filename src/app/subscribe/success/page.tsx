'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const creatorId = searchParams.get('creator');
  const [creatorUsername, setCreatorUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!creatorId) return;
    supabase
      .from('profiles')
      .select('username')
      .eq('id', creatorId)
      .single()
      .then(({ data }) => setCreatorUsername(data?.username ?? null));
  }, [creatorId]);

  return (
    <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
          style={{ fontSize: '72px', marginBottom: '24px' }}
        >
          🎉
        </motion.div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>
          You&apos;re in!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontSize: '17px' }}>
          Your subscription is now active.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '40px' }}>
          Download the Zik4U app to access all creator content,
          Now Cards, Wrapped and more.
        </p>

        {/* Download CTA */}
        <div style={{ background: '#12122A', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>Get the full experience</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={APP_STORE_URL}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
                color: '#0A0A1A',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                textAlign: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              🍎 Download on App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: '#1A1A35',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                textAlign: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              ▶ Get on Google Play
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {creatorUsername && (
            <button
              onClick={() => router.push(`/creator/${creatorUsername}`)}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}
            >
              ← Back to creator
            </button>
          )}
          <button
            onClick={() => router.push('/fans')}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF', fontSize: '13px' }}
          >
            Explore creators →
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #00D4FF', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
