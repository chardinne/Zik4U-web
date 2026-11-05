import { createClient } from '@supabase/supabase-js';
import { serverSecretKey } from '@/lib/supabaseKeys';

// Secret-key client — server-only reads (publicProfile, sharedCard, waitlists).
// KEYS1 K1c: the key comes from src/lib/supabaseKeys.ts only (new secret key, no legacy fallback).
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = serverSecretKey();
  if (!url || !key) throw new Error('Supabase service env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
