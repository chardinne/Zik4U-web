import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

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
