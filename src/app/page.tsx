'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A0A1A' }}>
      {/* Header — nav hidden on mobile */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-2xl font-black tracking-wider gradient-text">ZIK4U</div>
        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <Link href="/users" className="hover:text-white transition-colors">Discover</Link>
          <Link href="/creators" className="hover:text-white transition-colors">For Creators</Link>
          <Link
            href="/creators"
            className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h1 className="text-4xl md:text-7xl font-black mb-3 md:mb-4 leading-tight">
            <span className="gradient-text">Your Music.</span>
            <br />
            <span className="text-white">Your Identity.</span>
          </h1>
          {/* Short subtitle on mobile, full on desktop */}
          <p className="md:hidden text-base mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Find creators who listen like you.
          </p>
          <p className="hidden md:block text-lg md:text-xl max-w-xl mx-auto mb-12" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Discover creators who listen like you. Turn your music taste into passive revenue.
          </p>
        </motion.div>

        {/* Two-door cards — stacked on mobile, side by side on desktop */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-2xl">
          {/* Listener door */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="flex-1"
          >
            <Link href="/users">
              <div
                className="relative rounded-2xl p-6 md:p-8 cursor-pointer overflow-hidden text-left flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF22, #00FFB222)',
                  border: '1px solid #00D4FF44',
                  minHeight: '180px',
                }}
              >
                <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)' }} />
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎧</div>
                  <h2 className="text-xl md:text-2xl font-black text-white mb-1 md:mb-2">I&apos;m a Listener</h2>
                  {/* Description hidden on mobile */}
                  <p className="hidden md:block text-white/70 text-sm leading-relaxed">
                    Discover creators who sound like you. Find your musical tribe and support the artists you love.
                  </p>
                </div>
                <div
                  className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold self-start mt-3 md:mt-0"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)', color: '#0A0A1A', minHeight: '44px' }}
                >
                  Browse Creators →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Creator door */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ scale: 1.03 }}
            className="flex-1"
          >
            <Link href="/creators">
              <div
                className="relative rounded-2xl p-6 md:p-8 cursor-pointer overflow-hidden text-left flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(135deg, #FF3CAC22, #7B2FFF22)',
                  border: '1px solid #FF3CAC44',
                  minHeight: '180px',
                }}
              >
                <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }} />
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎤</div>
                  <h2 className="text-xl md:text-2xl font-black text-white mb-1 md:mb-2">I&apos;m a Creator</h2>
                  {/* Description hidden on mobile */}
                  <p className="hidden md:block text-white/70 text-sm leading-relaxed">
                    Turn your music taste into passive revenue. Build a community of fans who vibe with your sound.
                  </p>
                </div>
                <div
                  className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white self-start mt-3 md:mt-0"
                  style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', minHeight: '44px' }}
                >
                  Start Earning →
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Early access message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-full text-sm"
            style={{ background: '#12122A', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            <span className="text-lg">🚀</span>
            <span className="text-white font-semibold">Early access — be among the first</span>
          </div>
          <p className="text-textSecondary text-sm text-center max-w-sm">
            Zik4U is launching soon. Join now and shape the future
            of music identity.
          </p>
        </motion.div>
      </main>

      {/* Footer — links hidden on mobile */}
      <footer className="flex items-center justify-between px-6 py-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>
        <span>© 2026 Zik4U. All rights reserved.</span>
        <div className="hidden md:flex gap-4">
          <Link href="/legal/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
          <Link href="/legal/terms" className="hover:text-white/60 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
