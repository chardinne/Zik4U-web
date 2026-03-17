'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function CancelContent() {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '360px', width: '100%' }}
      >
        <p style={{ fontSize: '56px', marginBottom: '24px' }}>💳</p>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
          Changed your mind?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '14px' }}>
          No worries. You haven&apos;t been charged.
          The creator&apos;s content is still waiting for you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {creatorUsername && (
            <button
              onClick={() => router.push(`/creator/${creatorUsername}`)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}
            >
              Try again →
            </button>
          )}
          <button
            onClick={() => router.push('/fans')}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}
          >
            Explore other creators →
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #00D4FF', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    }>
      <CancelContent />
    </Suspense>
  );
}
