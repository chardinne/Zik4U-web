/**
 * Tests: POST /api/partner/webhook
 * Covers: signature validation, unknown events (acknowledge without processing)
 */

import { POST } from '@/app/api/partner/webhook/route';

jest.mock('@/lib/stripe-server', () => ({
  stripe: { webhooks: { constructEvent: jest.fn() } },
}));
jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(),
}));

function makeReq(opts: { sig?: string; body?: string } = {}) {
  return new Request('http://localhost/api/partner/webhook', {
    method: 'POST',
    headers: opts.sig ? { 'stripe-signature': opts.sig } : {},
    body: opts.body ?? 'raw-payload',
  });
}

describe('POST /api/partner/webhook', () => {
  let mockConstructEvent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_partner_test';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockConstructEvent = (require('@/lib/stripe-server') as any).stripe.webhooks.constructEvent;
  });

  it('returns 400 when stripe-signature header is missing', async () => {
    const res = await POST(makeReq() as any);
    expect(res.status).toBe(400);
  });

  it('returns 400 when signature verification fails', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Webhook signature verification failed');
    });
    const res = await POST(makeReq({ sig: 'bad-sig' }) as any);
    expect(res.status).toBe(400);
  });

  it('returns 200 and acknowledges unknown event types without processing', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'invoice.payment_succeeded',
      data: { object: {} },
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockCreateServiceClient = (require('@/lib/supabase-server') as any).createServiceClient;
    mockCreateServiceClient.mockReturnValue({ from: jest.fn() });

    const res = await POST(makeReq({ sig: 'valid' }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });
});
