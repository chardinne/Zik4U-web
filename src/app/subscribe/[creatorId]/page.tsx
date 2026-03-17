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

type Step = 'loading' | 'auth' | 'confirm' | 'processing' | 'error';

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
          setStep('confirm');
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
      setStep('confirm');
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
          ← Browse creators
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
          redirectMessage={`Sign in to subscribe to ${creator?.displayName ?? 'this creator'}`}
        />
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
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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

            {/* Creator info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px' }}>
                {creator.displayName.charAt(0).toUpperCase()}
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
