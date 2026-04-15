/**
 * Tests: POST /api/creator/payment
 * Covers: input validation (types, amount range) — early returns before DB/Stripe
 */

import { POST } from '@/app/api/creator/payment/route';

jest.mock('@/lib/stripe-server', () => ({
  stripe: {
    checkout: { sessions: { create: jest.fn() } },
  },
}));
jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(),
}));

function makeReq(body: Record<string, unknown>) {
  return new Request('http://localhost/api/creator/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/creator/payment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = 'https://zik4u.com';
  });

  it('returns 400 when creator_id is missing', async () => {
    const res = await POST(makeReq({ payment_type: 'tip', amount_usd: '5' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 when payment_type is invalid', async () => {
    const res = await POST(makeReq({ creator_id: 'c-1', payment_type: 'INVALID', amount_usd: '5' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is below minimum ($1)', async () => {
    const res = await POST(makeReq({ creator_id: 'c-1', payment_type: 'tip', amount_usd: '0' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount exceeds maximum ($500)', async () => {
    const res = await POST(makeReq({ creator_id: 'c-1', payment_type: 'tip', amount_usd: '600' }) as any);
    expect(res.status).toBe(400);
  });
});
