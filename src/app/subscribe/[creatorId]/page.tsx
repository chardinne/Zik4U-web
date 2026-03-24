'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';
import { getCreatorProfile } from '@/lib/creators';
import { AuthModal } from '@/components/auth/AuthModal';
import type { CreatorProfile, CreatorTier } from '@/types';
import type { User } from '@supabase/supabase-js';

type Step = 'loading' | 'auth' | 'onboarding_value' | 'onboarding_creator' | 'confirm' | 'processing' | 'error';

export default function SubscribePage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tierId = searchParams.get('tier');
  const billingParam = searchParams.get('billing') as 'monthly' | 'annual' | null;

  const [step, setStep] = useState<Step>('loading');
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [tier, setTier] = useState<CreatorTier | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'annual'>(billingParam ?? 'monthly');
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Load creator + check auth
  useEffect(() => {
    const init = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // Get creator profile by ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', creatorId)
          .single();

        if (!profile) {
          setError('Creator not found');
          setStep('error');
          return;
        }

        const creatorData = await getCreatorProfile(profile.username);
        if (!creatorData) {
          setError('Creator not found');
          setStep('error');
          return;
        }
        setCreator(creatorData);

        // Find the selected tier
        const selectedTier = tierId
          ? creatorData.tiers.find((t) => t.id === tierId)
          : creatorData.tiers[0];

        if (!selectedTier) {
          setError('Subscription tier not found');
          setStep('error');
          return;
        }
        setTier(selectedTier);

        // Determine next step
        if (!currentUser) {
          setStep('auth');
          setAuthOpen(true);
        } else {
          setStep('onboarding_value');
        }
      } catch {
        setError('Something went wrong. Please try again.');
        setStep('error');
      }
    };

    init();
  }, [creatorId, tierId]);

  const handleAuthSuccess = useCallback(() => {
    setAuthOpen(false);
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setStep('onboarding_value');
    });
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!user || !creator || !tier) return;
    setStep('processing');
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setStep('auth');
        setAuthOpen(true);
        return;
      }

      const result = await createCheckoutSession(
        {
          creatorId: creator.id,
          tierId: tier.id,
          userId: user.id,
          userEmail: user.email ?? '',
          billingPeriod: billing,
        },
        session.access_token,
      );

      // Validate URL before redirect — must be a Stripe checkout URL
      if (!result.url.startsWith('https://checkout.stripe.com')) {
        throw new Error('Invalid checkout URL');
      }
      window.location.href = result.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
      setStep('confirm');
    }
  }, [user, creator, tier, billing]);

  // ── Loading ──
  if (step === 'loading') {
    return (
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid #00D4FF',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  // ── Error ──
  if (step === 'error') {
    return (
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px' }}>😕</p>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>Something went wrong</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>{error}</p>
        <button
          onClick={() => router.push('/fans')}
          style={{ color: '#00D4FF', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
        >
          ← Explore creators
        </button>
      </main>
    );
  }

  // ── Auth step ──
  if (step === 'auth') {
    return (
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</p>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
            Sign in to subscribe
          </h1>
          {creator && tier && (
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>
              {creator.displayName} · {tier.name} · ${tier.priceWeb.toFixed(2)}/mo
            </p>
          )}
        </motion.div>
        <AuthModal
          isOpen={authOpen}
          onClose={() => router.push(`/creator/${creator?.username ?? ''}`)}
          onSuccess={handleAuthSuccess}
          redirectMessage={creator
            ? `Create a free account to subscribe to ${creator.displayName} and access their real listening feed.`
            : 'Create a free account to continue.'}
        />
      </main>
    );
  }

  // ── Onboarding: value proposition ──
  if (step === 'onboarding_value') {
    const VALUE_ITEMS = [
      {
        emoji: '📡',
        title: 'Real listening. Not curated.',
        desc: 'See exactly what your creator plays — Spotify, Apple Music, everything. Automatically captured.',
      },
      {
        emoji: '🎵',
        title: 'Exclusive drops.',
        desc: 'Tracks, playlists and content they share only with subscribers. Before anyone else.',
      },
      {
        emoji: '🃏',
        title: 'Your Fan Card.',
        desc: 'A shareable card showing your music compatibility score with this creator.',
      },
    ];

    return (
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px' }}>
          <button onClick={() => router.back()}
            style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            ← Back
          </button>
          <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ZIK4U
          </span>
          <div style={{ width: '48px' }} />
        </header>

        <div style={{ maxWidth: '448px', margin: '0 auto', padding: '32px 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: i === 0 ? 20 : 6, height: 6, borderRadius: 3,
                  backgroundColor: i === 0 ? '#00D4FF' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em',
              color: '#00FFB2', textTransform: 'uppercase', marginBottom: 12 }}>
              What you get
            </p>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 900,
              lineHeight: 1.1, marginBottom: 32 }}>
              A window into their
              <span style={{ background: 'linear-gradient(90deg, #00D4FF, #00FFB2)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}musical world.
              </span>
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
              {VALUE_ITEMS.map((item) => (
                <motion.div
                  key={item.emoji}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    background: '#12122A',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep('onboarding_creator')}
              style={{
                width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
                color: '#0A0A1A', fontWeight: 900, fontSize: '16px', marginBottom: 12,
              }}
            >
              Continue →
            </motion.button>

            <button
              onClick={() => setStep('confirm')}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer',
                background: 'transparent', border: 'none', fontFamily: 'Inter, system-ui, sans-serif',
                color: 'rgba(255,255,255,0.25)', fontSize: '13px',
              }}
            >
              Skip intro
            </button>

          </motion.div>
        </div>
      </main>
    );
  }

  // ── Onboarding: creator profile ──
  if (step === 'onboarding_creator' && creator) {
    return (
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px' }}>
          <button onClick={() => setStep('onboarding_value')}
            style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            ← Back
          </button>
          <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ZIK4U
          </span>
          <div style={{ width: '48px' }} />
        </header>

        <div style={{ maxWidth: '448px', margin: '0 auto', padding: '32px 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: i === 1 ? 20 : 6, height: 6, borderRadius: 3,
                  backgroundColor: i <= 1 ? '#00D4FF' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em',
              color: '#FF3CAC', textTransform: 'uppercase', marginBottom: 12 }}>
              Your creator
            </p>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 900,
              lineHeight: 1.1, marginBottom: 32 }}>
              Meet{' '}
              <span style={{ background: 'linear-gradient(90deg, #FF3CAC, #7B2FFF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {creator.displayName}.
              </span>
            </h1>

            {/* Creator card */}
            <div style={{
              background: '#12122A', border: '1px solid rgba(255,60,172,0.2)',
              borderRadius: 20, padding: 24, marginBottom: 24,
            }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 900, overflow: 'hidden',
                }}>
                  {creator.avatarUrl ? (
                    <img src={creator.avatarUrl} alt={creator.displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <span style={{ color: '#fff' }}>{creator.displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 900, fontSize: 18, margin: '0 0 2px' }}>{creator.displayName}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>@{creator.username}</p>
                </div>
              </div>

              {/* Bio */}
              {creator.bio && (
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7,
                  margin: '0 0 20px' }}>
                  {creator.bio}
                </p>
              )}

              {/* Top artists */}
              {creator.topArtists.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10 }}>
                    What they listen to
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {creator.topArtists.map((artist) => (
                      <span key={artist} style={{
                        fontSize: 12, padding: '4px 12px', borderRadius: 999,
                        background: 'rgba(255,60,172,0.1)',
                        border: '1px solid rgba(255,60,172,0.2)',
                        color: '#FF3CAC',
                      }}>
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribers stat */}
              {creator.totalSubscribers > 0 && (
                <div style={{
                  background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: 10, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>👥</span>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    <span style={{ fontWeight: 700, color: '#00D4FF' }}>
                      {creator.totalSubscribers}
                    </span>
                    {' '}fan{creator.totalSubscribers > 1 ? 's' : ''} already subscribed
                  </p>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep('confirm')}
              style={{
                width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
                color: '#fff', fontWeight: 900, fontSize: '16px', marginBottom: 12,
              }}
            >
              See subscription plans →
            </motion.button>

            <button
              onClick={() => setStep('confirm')}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer',
                background: 'transparent', border: 'none', fontFamily: 'Inter, system-ui, sans-serif',
                color: 'rgba(255,255,255,0.25)', fontSize: '13px',
              }}
            >
              Skip
            </button>

          </motion.div>
        </div>
      </main>
    );
  }

  // ── Confirm / Processing ──
  if ((step === 'confirm' || step === 'processing') && creator && tier) {
    const annualPrice = tier.priceWeb * 12 * 0.87; // ~13% discount
    const savings = (tier.priceWeb * 12) - annualPrice;

    return (
      <main style={{ backgroundColor: '#0A0A1A', minHeight: '100vh', color: '#FFFFFF' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
          <button
            onClick={() => router.push(`/creator/${creator.username}`)}
            style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.15em', background: 'linear-gradient(135deg, #00D4FF, #00FFB2, #FF3CAC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ZIK4U
          </span>
          <div style={{ width: '48px' }} />
        </header>

        <div style={{ maxWidth: '448px', margin: '0 auto', padding: '40px 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: i === 2 ? 20 : 6, height: 6, borderRadius: 3,
                  backgroundColor: '#00D4FF',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>

            {/* Creator info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', overflow: 'hidden' }}>
                {creator.avatarUrl ? (
                  <img
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: 900, fontSize: '20px', color: '#fff' }}>
                    {creator.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{creator.displayName}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>@{creator.username}</p>
              </div>
            </div>

            {/* Order summary card */}
            <div style={{ background: '#12122A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Order summary
              </p>

              {/* Tier name */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{tier.name}</p>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(255,60,172,0.15)', color: '#FF3CAC' }}>
                  {creator.displayName}
                </span>
              </div>

              {/* Perks */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tier.perks.slice(0, 3).map((perk) => (
                  <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: '#00FFB2', fontSize: '11px' }}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Billing toggle */}
              <div style={{ display: 'flex', background: '#0A0A1A', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
                {(['monthly', 'annual'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setBilling(period)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      ...(billing === period
                        ? { background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', color: '#FFFFFF' }
                        : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }),
                    }}
                  >
                    {period === 'monthly' ? 'Monthly' : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        Annual
                        <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '999px', background: 'rgba(0,255,178,0.2)', color: '#00FFB2' }}>
                          −13%
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Price breakdown */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {tier.name} · {billing === 'monthly' ? 'per month' : 'per year'}
                  </span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                    ${(billing === 'monthly' ? tier.priceWeb : annualPrice).toFixed(2)}
                  </span>
                </div>
                {billing === 'annual' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#00FFB2' }}>Annual savings</span>
                    <span style={{ color: '#00FFB2' }}>−${savings.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Total today</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '18px' }}>
                    ${(billing === 'monthly' ? tier.priceWeb : annualPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(255,60,60,0.1)', color: '#ff6b6b', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            {/* CTA */}
            <motion.button
              whileHover={{ scale: step === 'processing' ? 1 : 1.02 }}
              whileTap={{ scale: step === 'processing' ? 1 : 0.98 }}
              onClick={handleCheckout}
              disabled={step === 'processing'}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                cursor: step === 'processing' ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '17px',
                marginBottom: '16px',
                opacity: step === 'processing' ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {step === 'processing' ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Redirecting to payment...
                </span>
              ) : (
                `Subscribe · $${(billing === 'monthly' ? tier.priceWeb : annualPrice).toFixed(2)}${billing === 'monthly' ? '/mo' : '/yr'}`
              )}
            </motion.button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Trust signals */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap' }}>
              <span>🔒 Secured by Stripe</span>
              <span>·</span>
              <span>Cancel anytime</span>
              <span>·</span>
              <span>No hidden fees</span>
            </div>

            {/* Legal */}
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '12px', lineHeight: 1.5 }}>
              By subscribing you agree to our{' '}
              <a href="/legal/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>Terms</a>
              {' '}and authorize recurring charges.
            </p>

          </motion.div>
        </div>
      </main>
    );
  }

  return null;
}
