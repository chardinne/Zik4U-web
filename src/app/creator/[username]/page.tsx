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

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A0A1A' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-6"
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

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Creator hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16"
        >
          {/* Avatar */}
          <div
            className="w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center text-4xl font-black overflow-hidden"
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
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h1 className="text-3xl font-black text-white">{creator.displayName}</h1>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,60,172,0.15)', color: '#FF3CAC' }}
              >
                CREATOR
              </span>
            </div>
            <p className="mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              @{creator.username}
            </p>

            {creator.bio && (
              <p className="text-sm leading-relaxed mb-4 max-w-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {creator.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
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

            {/* Top artists */}
            {creator.topArtists.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Listens to:</span>
                {creator.topArtists.map((artist) => (
                  <span
                    key={artist}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF' }}
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">
                Choose your subscription
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                Support {creator.displayName} and get exclusive access
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
        <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Payments processed securely by Stripe.
          Cancel anytime. By subscribing you agree to our{' '}
          <a href="/legal/terms" className="underline hover:text-white transition-colors">Terms</a>.
        </p>

      </div>

      {/* Auth modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => { setAuthOpen(false); setPendingTier(null); }}
        onSuccess={handleAuthSuccess}
        redirectMessage={`Sign in to subscribe to ${creator.displayName}`}
      />

    </main>
  );
}
