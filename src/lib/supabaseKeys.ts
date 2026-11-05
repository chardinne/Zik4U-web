// KEYS1 K1c (Decisions 259 and 261 = A, 05/11/2026) — the single place where the site reads its
// Supabase key. Supabase retires the legacy JWT keys (anon / service_role) at the end of 2026.
// The site only ever uses the new SECRET key (server-side: cards, waitlist, founder galaxy), read
// from SUPABASE_SECRET_KEY. No fallback to the legacy service_role key: a missing or legacy value
// fails closed, so a working page proves the new key is in use.

export const SECRET_KEY_ENV = 'SUPABASE_SECRET_KEY';
export const SECRET_KEY_PREFIX = 'sb_secret_';

/** The project secret key, or '' when it is missing or not a new-format secret key (fail-closed). */
export function serverSecretKey(): string {
  const v = (process.env.SUPABASE_SECRET_KEY ?? '').trim();
  return v.startsWith(SECRET_KEY_PREFIX) ? v : '';
}
