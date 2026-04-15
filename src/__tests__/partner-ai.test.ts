/**
 * Tests: POST /api/partner/ai
 * Covers: missing API key (401), quota exceeded (429), rate limited (429)
 */

import { POST } from '@/app/api/partner/ai/route';

jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(),
}));
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn(),
}));

function makeReq(opts: { apiKey?: string; body?: Record<string, unknown> } = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.apiKey) headers['x-zik4u-key'] = opts.apiKey;
  return new Request('http://localhost/api/partner/ai', {
    method: 'POST',
    headers,
    body: JSON.stringify(opts.body ?? { question: 'What are trending artists?' }),
  });
}

describe('POST /api/partner/ai', () => {
  let mockCreateServiceClient: jest.Mock;
  let mockCheckRateLimit: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockCreateServiceClient = (require('@/lib/supabase-server') as any).createServiceClient;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockCheckRateLimit = (require('@/lib/rate-limit') as any).checkRateLimit;
  });

  it('returns 401 when x-zik4u-key header is missing', async () => {
    const res = await POST(makeReq() as any);
    expect(res.status).toBe(401);
  });

  it('returns 429 when monthly quota is exceeded', async () => {
    mockCreateServiceClient.mockReturnValue({
      rpc: jest.fn().mockResolvedValue({
        data: {
          allowed: false,
          reason: 'quota_exceeded',
          used: 10,
          limit: 10,
          reset_at: '2026-05-01T00:00:00Z',
        },
        error: null,
      }),
      from: jest.fn(),
    });

    const res = await POST(makeReq({ apiKey: 'test-key-123' }) as any);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toMatch(/quota/i);
  });

  it('returns 429 when hourly rate limit is exceeded', async () => {
    mockCreateServiceClient.mockReturnValue({
      rpc: jest.fn().mockResolvedValue({
        data: { allowed: true, used: 5, limit: 10 },
        error: null,
      }),
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { plan_requested: 'intelligence' }, error: null }),
          }),
        }),
      }),
    });
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      resetAt: '2026-04-15T12:00:00Z',
    });

    const res = await POST(makeReq({ apiKey: 'test-key-123' }) as any);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toMatch(/rate limit/i);
  });
});
