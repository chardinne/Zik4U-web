import { createClient } from '@supabase/supabase-js';

// Client service role — admin only, bypass RLS complet
// NE PAS utiliser dans les routes partenaires
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Supabase service env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Client partenaire — rôle limité, accès minimal
// Utiliser exclusivement dans les routes /api/partner/*
export function createPartnerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_PARTNER_KEY!;
  if (!url || !key) {
    console.warn('[security] SUPABASE_PARTNER_KEY not set — falling back to service client');
    return createServiceClient();
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
  });
}
