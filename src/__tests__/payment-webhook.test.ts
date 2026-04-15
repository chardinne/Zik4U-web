/**
 * Tests: POST /api/creator/payment-webhook
 * Covers: signature validation, idempotency (paid → no double update)
 */

import { POST } from '@/app/api/creator/payment-webhook/route';

jest.mock('@/lib/stripe-server', () => ({
  stripe: { webhooks: { constructEvent: jest.fn() } },
}));
jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(),
}));

function makeReq(opts: { sig?: string; body?: string } = {}) {
  return new Request('http://localhost/api/creator/payment-webhook', {
    method: 'POST',
    headers: opts.sig ? { 'stripe-signature': opts.sig } : {},
    body: opts.body ?? 'raw-payload',
  });
}

describe('POST /api/creator/payment-webhook', () => {
  let mockConstructEvent: jest.Mock;
  let mockCreateServiceClient: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_DIRECT_PAYMENT_WEBHOOK_SECRET = 'whsec_test';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockConstructEvent = (require('@/lib/stripe-server') as any).stripe.webhooks.constructEvent;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockCreateServiceClient = (require('@/lib/supabase-server') as any).createServiceClient;
  });

  it('returns 400 when stripe-signature header is missing', async () => {
    const res = await POST(makeReq() as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 when signature verification fails', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Signature mismatch');
    });
    const res = await POST(makeReq({ sig: 'bad-sig' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 200 for non-checkout events without processing', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'payment_intent.created',
      data: { object: {} },
    });
    mockCreateServiceClient.mockReturnValue({ from: jest.fn() });

    const res = await POST(makeReq({ sig: 'valid' }) as any);
    expect(res.status).toBe(200);
  });

  it('returns 200 with duplicate:true when payment already paid (idempotency — no update called)', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { payment_id: 'pay-123', creator_id: 'c-1', fan_id: 'f-1', payment_type: 'tip' },
          payment_intent: 'pi-xxx',
          id: 'cs-xxx',
        },
      },
    });

    const updateMock = jest.fn();
    const singleMock = jest.fn().mockResolvedValue({ data: { status: 'paid' }, error: null });
    mockCreateServiceClient.mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({ single: singleMock }),
        }),
        update: updateMock,
        insert: jest.fn().mockResolvedValue({ error: null }),
      }),
    });

    const res = await POST(makeReq({ sig: 'valid' }) as any);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.duplicate).toBe(true);
    expect(updateMock).not.toHaveBeenCalled();
  });
});
