import { createServiceClient } from './supabase-server';

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetAt?: string;
}

const LIMITS: Record<string, number> = {
  'intelligence': 100,
  'ai':           10,
};

export async function checkRateLimit(
  apiKey: string,
  endpoint: 'intelligence' | 'ai',
): Promise<RateLimitResult> {
  try {
    const supabase = createServiceClient();
    const limit = LIMITS[endpoint] ?? 100;

    const { data } = await supabase.rpc('check_rate_limit', {
      p_api_key:  apiKey,
      p_endpoint: endpoint,
      p_limit:    limit,
    });

    if (!data) return { allowed: true };

    return {
      allowed:   (data as any).allowed,
      remaining: (data as any).remaining,
      resetAt:   (data as any).reset_at,
    };
  } catch {
    console.error('[rate-limit] Error — allowing request');
    return { allowed: true };
  }
}
