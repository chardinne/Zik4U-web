import { createClient } from '@supabase/supabase-js';

// Client service role — admin only, checkout, webhook
// NE JAMAIS utiliser dans les routes /api/partner/intelligence/*
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Supabase service env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Client anon — pour les routes partenaires
// Les RPCs partner_* vérifient la clé API en interne (SECURITY DEFINER)
// Aucun bypass RLS possible avec cette clé
export function createPartnerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) throw new Error('Supabase anon env vars missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
