'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A0A1A' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="text-2xl font-black tracking-wider gradient-text">ZIK4U</div>
        <nav className="flex items-center gap-6 text-sm text-white/60">
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="gradient-text">Your Music.</span>
            <br />
            <span className="text-white">Your Identity.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-12">
            Discover creators who listen like you. Turn your music taste into passive revenue.
          </p>
        </motion.div>

        {/* Two-door cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
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
                className="relative rounded-2xl p-8 cursor-pointer overflow-hidden text-left h-64 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #00D4FF22, #00FFB222)', border: '1px solid #00D4FF44' }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)' }}
                />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">🎧</div>
                  <h2 className="text-2xl font-black text-white mb-2">I&apos;m a Listener</h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Discover creators who sound like you. Find your musical tribe and support the artists you love.
                  </p>
                </div>
                <div
                  className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold self-start"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)', color: '#0A0A1A' }}
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
                className="relative rounded-2xl p-8 cursor-pointer overflow-hidden text-left h-64 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #FF3CAC22, #7B2FFF22)', border: '1px solid #FF3CAC44' }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
                />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">🎤</div>
                  <h2 className="text-2xl font-black text-white mb-2">I&apos;m a Creator</h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Turn your music taste into passive revenue. Build a community of fans who vibe with your sound.
                  </p>
                </div>
                <div
                  className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white self-start"
                  style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
                >
                  Start Earning →
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-8 mt-16 text-center"
        >
          {[
            { value: '10K+', label: 'Listeners' },
            { value: '500+', label: 'Creators' },
            { value: '$50K+', label: 'Paid out' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-white/10 text-white/30 text-xs">
        <span>© 2026 Zik4U. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
