'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthModal } from '@/components/auth/AuthModal';

const BENEFITS = [
  {
    emoji: '💰',
    title: 'Passive Revenue',
    description: 'Earn every month from fans who subscribe to your musical world. No content creation required — your listening habits are your product.',
  },
  {
    emoji: '🎵',
    title: 'Your Music Is Your Brand',
    description: 'Zik4U automatically captures what you listen to and transforms it into your unique musical identity. Authentic. Real. Yours.',
  },
  {
    emoji: '👥',
    title: 'Real Fan Connections',
    description: 'Connect with fans who genuinely share your taste. No algorithms — pure music compatibility.',
  },
  {
    emoji: '📊',
    title: 'Deep Analytics',
    description: 'Know what your community listens to, your top fans, your revenue trends. Creator Wrapped shows your yearly impact.',
  },
  {
    emoji: '🚀',
    title: 'Viral Sharing Tools',
    description: 'Now Card, Wrapped, Fan Cards — shareable on TikTok and Instagram. Your community grows organically.',
  },
  {
    emoji: '🔒',
    title: 'Exclusive Content Drops',
    description: 'Reward your top subscribers with exclusive listening sessions, playlists and direct messages.',
  },
];

const TIERS = [
  {
    name: 'Basic',
    price: 4.99,
    color: '#00D4FF',
    popular: false,
    perks: [
      "Access to creator's listening feed",
      'Music compatibility score',
      'Exclusive posts',
    ],
  },
  {
    name: 'Pro',
    price: 9.99,
    color: '#FF3CAC',
    popular: true,
    perks: [
      'Everything in Basic',
      'Direct messaging',
      'Monthly playlist drops',
      'Fan Card shareable',
    ],
  },
  {
    name: 'Elite',
    price: 19.99,
    color: '#7B2FFF',
    popular: false,
    perks: [
      'Everything in Pro',
      'Weekly 1-on-1 listening session',
      'Early access to all drops',
      'Priority support',
    ],
  },
];

const STEPS = [
  { number: '01', title: 'Sign up as creator', description: 'Create your account in 30 seconds with Google or email.' },
  { number: '02', title: 'Connect your streaming', description: 'Link Spotify, Apple Music or YouTube Music. Zik4U captures your listening automatically.' },
  { number: '03', title: 'Set your tiers', description: 'Choose your subscription prices. We suggest $4.99 / $9.99 / $19.99 — you can customize.' },
  { number: '04', title: 'Start earning', description: 'Share your profile link. Fans subscribe. Revenue hits your account monthly via Stripe.' },
];

export default function CreatorsPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    router.push('/');
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A0A1A' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="text-xl font-black tracking-widest gradient-text-creator"
        >
          ZIK4U
        </button>
        <button
          onClick={() => router.push('/users')}
          className="text-sm transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          I&apos;m a listener →
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: '#FF3CAC' }}
          >
            For creators
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Turn your music taste
            <br />
            into{' '}
            <span className="gradient-text-creator">passive revenue</span>
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto mb-10"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Your listening habits are your content.
            Fans subscribe to your musical world.
            You earn — automatically, every month.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAuthOpen(true)}
            className="px-10 py-4 rounded-full font-black text-lg text-white"
            style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
          >
            Start earning now →
          </motion.button>
          <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Free to join. No credit card required.
          </p>
        </motion.div>

        {/* Revenue teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '$127', label: 'Avg monthly revenue' },
            { value: '23', label: 'Avg subscribers' },
            { value: '85%', label: 'Creator revenue share' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black gradient-text-creator">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-white text-center mb-12">
          Everything you need to monetize
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl p-6"
              style={{ background: '#12122A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl mb-3">{benefit.emoji}</div>
              <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">
            Suggested subscription tiers
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            You choose your prices. These are our recommendations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl p-6"
              style={{
                background: tier.popular
                  ? 'linear-gradient(135deg, rgba(255,60,172,0.12), rgba(123,47,255,0.08))'
                  : '#12122A',
                border: tier.popular
                  ? '1px solid rgba(255,60,172,0.3)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {tier.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
                >
                  ⭐ Most chosen
                </div>
              )}
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: tier.color }}
              >
                {tier.name}
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">${tier.price}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo per fan</span>
              </div>
              <ul className="space-y-2">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: tier.color }}>✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Zik4U takes 15% platform fee. You keep 85% of all revenue.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-white text-center mb-12">
          Start earning in 4 steps
        </h2>
        <div className="space-y-6">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6 p-6 rounded-2xl"
              style={{ background: '#12122A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-2xl font-black flex-shrink-0" style={{ color: '#FF3CAC' }}>
                {step.number}
              </span>
              <div>
                <h3 className="font-bold text-white mb-1">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255,60,172,0.12), rgba(123,47,255,0.08))',
            border: '1px solid rgba(255,60,172,0.2)',
          }}
        >
          <p className="text-4xl mb-4">🎤</p>
          <h2 className="text-3xl font-black text-white mb-3">
            Ready to monetize your sound?
          </h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Join hundreds of creators already earning on Zik4U.
            Free to start. No credit card required.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAuthOpen(true)}
            className="px-10 py-4 rounded-full font-black text-lg text-white"
            style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
          >
            Create my creator account →
          </motion.button>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <button
              onClick={() => setAuthOpen(true)}
              className="underline hover:text-white transition-colors"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-6 flex items-center justify-between text-xs"
        style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span>© 2026 Zik4U. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
          <a href="mailto:support@zik4u.com" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>

      {/* Auth modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        redirectMessage="Create your creator account"
      />

    </main>
  );
}
