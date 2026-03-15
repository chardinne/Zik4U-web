'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BecomeCreatorPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#0A0A1A' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg"
      >
        <p className="text-5xl mb-6">🎤</p>
        <h1 className="text-4xl font-black text-white mb-4">
          Become a Creator
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your listening history is already your content.
          Enable creator mode and start earning from your music taste.
        </p>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/creators')}
            className="w-full py-4 rounded-2xl font-black text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
          >
            Learn more &amp; sign up →
          </motion.button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 text-sm transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            ← Back to home
          </button>
        </div>
      </motion.div>
    </main>
  );
}
