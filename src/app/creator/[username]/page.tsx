'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getCreatorProfile } from '@/lib/creators';
import { TierCard } from '@/components/landing/TierCard';
import { AuthModal } from '@/components/auth/AuthModal';
import { supabase } from '@/lib/supabase';
import type { CreatorProfile, CreatorTier } from '@/types';
import type { User } from '@supabase/supabase-js';

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingTier, setPendingTier] = useState<CreatorTier | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getCreatorProfile(username)
      .then((data) => {
        if (!data) setNotFound(true);
        else setCreator(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (tier: CreatorTier) => {
    if (!user) {
      setPendingTier(tier);
      setAuthOpen(true);
      return;
    }
    router.push(`/subscribe/${creator?.id}?tier=${tier.id}`);
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (pendingTier && creator) {
      router.push(`/subscribe/${creator.id}?tier=${pendingTier.id}`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A1A' }}>
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: '#00D4FF', borderTopColor: 'transparent' }}
        />
      </main>
    );
  }

  if (notFound || !creator) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#0A0A1A' }}>
        <p className="text-6xl">🎵</p>
        <h1 className="text-2xl font-black text-white">Creator not found</h1>
        <button
          onClick={() => router.push('/users')}
          className="transition-colors hover:underline"
          style={{ color: '#00D4FF' }}
        >
          Browse all creators →
        </button>
      </main>
    );
  }

  const popularTierIndex = creator.tiers.length > 1 ? 1 : 0;
  // On mobile, put popular tier first
  const mobileTiers = creator.tiers.length > 0
    ? [
        creator.tiers[popularTierIndex],
        ...creator.tiers.filter((_, i) => i !== popularTierIndex),
      ]
    : [];
  const minPrice = creator.tiers.length > 0
    ? Math.min(...creator.tiers.map((t) => t.priceWeb))
    : null;

  return (
    <main className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#0A0A1A' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="text-xl font-black tracking-widest gradient-text"
        >
          ZIK4U
        </button>
        <button
          onClick={() => router.push('/users')}
          className="text-sm transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          ← Browse creators
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">

        {/* Creator hero — compact on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center md:items-start gap-4 md:gap-8 mb-8 md:mb-16"
        >
          {/* Avatar — 64px mobile, 112px desktop */}
          <div
            className="w-16 h-16 md:w-28 md:h-28 rounded-full flex-shrink-0 flex items-center justify-center text-2xl md:text-4xl font-black overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
          >
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.displayName}
                width={112}
                height={112}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              creator.displayName.charAt(0).toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + badge on one line */}
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h1 className="text-xl md:text-3xl font-black text-white truncate">{creator.displayName}</h1>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(255,60,172,0.15)', color: '#FF3CAC' }}
              >
                CREATOR
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              @{creator.username}
            </p>

            {/* Bio — 2 lines max on mobile */}
            {creator.bio && (
              <p
                className="text-sm leading-relaxed mb-3 max-w-lg"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {creator.bio}
              </p>
            )}

            {/* Stats — hidden on mobile */}
            <div className="hidden md:flex items-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-xl font-black text-white">{creator.totalSubscribers}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>subscribers</p>
              </div>
              {creator.tiers.length > 0 && (
                <div className="text-center">
                  <p className="text-xl font-black text-white">
                    ${Math.min(...creator.tiers.map((t) => t.priceWeb)).toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>from /month</p>
                </div>
              )}
            </div>

            {/* Top artists — max 2 on mobile with horizontal scroll */}
            {creator.topArtists.length > 0 && (
              <div
                className="flex gap-2 overflow-x-auto"
                style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
              >
                <span className="text-xs flex-shrink-0 self-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Listens to:
                </span>
                {creator.topArtists.slice(0, 2).map((artist) => (
                  <span
                    key={artist}
                    className="text-xs px-3 py-1 rounded-full flex-shrink-0 md:hidden"
                    style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', whiteSpace: 'nowrap' }}
                  >
                    🎵 {artist}
                  </span>
                ))}
                {creator.topArtists.map((artist) => (
                  <span
                    key={`full-${artist}`}
                    className="text-xs px-3 py-1 rounded-full flex-shrink-0 hidden md:inline-block"
                    style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', whiteSpace: 'nowrap' }}
                  >
                    🎵 {artist}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tiers */}
        {creator.tiers.length > 0 ? (
          <>
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black text-white mb-1 md:mb-2">
                Choose your subscription
              </h2>
              <p className="text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Support {creator.displayName} and get exclusive access
              </p>
            </div>

            {/* Mobile: horizontal carousel, popular first */}
            <div
              className="md:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
            >
              {mobileTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  style={{ minWidth: '85vw', scrollSnapAlign: 'start' }}
                >
                  <TierCard
                    tier={tier}
                    index={index}
                    creatorId={creator.id}
                    creatorName={creator.displayName}
                    onSubscribe={handleSubscribe}
                    isPopular={tier === creator.tiers[popularTierIndex]}
                  />
                </div>
              ))}
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden md:grid grid-cols-3 gap-6 mb-12">
              {creator.tiers.map((tier, index) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  index={index}
                  creatorId={creator.id}
                  creatorName={creator.displayName}
                  onSubscribe={handleSubscribe}
                  isPopular={index === popularTierIndex}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            className="text-center py-10 rounded-2xl mb-12"
            style={{ background: '#12122A', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>
              This creator hasn&apos;t set up subscriptions yet.
            </p>
          </div>
        )}

        {/* Legal disclaimer */}
        <p className="text-center text-xs mt-6 md:mt-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Payments processed securely by Stripe.
          Cancel anytime. By subscribing you agree to our{' '}
          <a href="/legal/terms" className="underline hover:text-white transition-colors">Terms</a>.
        </p>

      </div>

      {/* Sticky subscribe bar — mobile only, after 300px scroll */}
      {showStickyBar && creator.tiers.length > 0 && minPrice !== null && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="md:hidden fixed bottom-0 inset-x-0 z-50 px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: 'rgba(10,10,26,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
        >
          <p className="text-sm text-white font-semibold">
            From <span className="font-black">${minPrice.toFixed(2)}/mo</span>
          </p>
          <button
            onClick={() => handleSubscribe(creator.tiers[popularTierIndex])}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', minHeight: '44px' }}
          >
            Subscribe →
          </button>
        </motion.div>
      )}

      {/* Auth modal — bottom sheet on mobile */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => { setAuthOpen(false); setPendingTier(null); }}
        onSuccess={handleAuthSuccess}
        redirectMessage={`Sign in to subscribe to ${creator.displayName}`}
      />

    </main>
  );
}
