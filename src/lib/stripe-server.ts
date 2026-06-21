import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Lazy Stripe client. The secret key is read and validated on first use at
 * runtime, never at module load / build time. This prevents a missing
 * STRIPE_SECRET_KEY from breaking the production build of unrelated pages
 * (e.g. the public /card route).
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' });
  return _stripe;
}

export const PRICE_IDS = {
  insight: {
    monthly: process.env.STRIPE_PRICE_INSIGHT_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_INSIGHT_ANNUAL!,
  },
  intelligence: {
    monthly: process.env.STRIPE_PRICE_INTELLIGENCE_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_INTELLIGENCE_ANNUAL!,
  },
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
} as const;

export type PartnerPlan = 'insight' | 'intelligence' | 'enterprise';
export type BillingPeriod = 'monthly' | 'annual';
