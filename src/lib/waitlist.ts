// SITE1-1 (Decisions 171 = A, 176 = A, 178 = A of 26/10/2026): one waitlist for the whole site.
// A visitor leaves an email and picks a profile (listener, creator or fan); a creator also gives an
// artist name. No streaming platform is asked or stored any more (Decision 171).
// Storage: listeners and fans in pulse_waitlist (column role), creators in creator_waitlist;
// both tables are purged after 24 months (RET2, migration 00227).

export const WAITLIST_ROLES = ['listener', 'creator', 'fan'] as const;
export type WaitlistRole = (typeof WAITLIST_ROLES)[number];

// Visible texts validated by Bertrand (Decision 176 = A, 26/10/2026). Asserted word for word by
// src/__tests__/site1-waitlist.test.ts.
export const WAITLIST_TEXTS = {
  roles: { listener: 'Listener', creator: 'Creator', fan: 'Fan' },
  artistPlaceholder: 'Artist name',
  emailPlaceholder: 'you@email.com',
  button: 'Join the waitlist',
  fine: 'We write to you once, when Zik4U opens.',
  privacyLink: 'Privacy',
  successTitle: "You're on the list.",
  successBody: "We'll write to you when Zik4U opens. Your galaxy starts with your first real listen.",
  // Decision 179 (submitted 26/10/2026): shown when the sign-up did not go through.
  error: "That didn't go through. Please try again.",
} as const;

export const ARTIST_NAME_MAX = 100;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistInput =
  | { ok: true; email: string; role: WaitlistRole; artistName: string | null; bot: boolean }
  | { ok: false; error: 'invalid_email' | 'invalid_role' | 'artist_name_required' };

/** Pure validation of the POST body of /api/waitlist (no I/O). */
export function parseWaitlistBody(body: unknown): WaitlistInput {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, error: 'invalid_email' };
  const role = typeof b.role === 'string' ? b.role : '';
  if (!(WAITLIST_ROLES as readonly string[]).includes(role)) return { ok: false, error: 'invalid_role' };
  let artistName: string | null = null;
  if (role === 'creator') {
    artistName = typeof b.artist_name === 'string' ? b.artist_name.trim() : '';
    if (!artistName || artistName.length > ARTIST_NAME_MAX) return { ok: false, error: 'artist_name_required' };
  }
  // Honeypot: a hidden field a person never fills. A bot gets the same answer, nothing is stored.
  const bot = typeof b.website === 'string' && b.website.trim() !== '';
  return { ok: true, email, role: role as WaitlistRole, artistName, bot };
}

/** The row written for a valid input: table, values, conflict key. Never sends created_at
 *  (kept from the first sign-up, so the 24-month purge counts from it). */
export function waitlistRow(input: Extract<WaitlistInput, { ok: true }>) {
  if (input.role === 'creator') {
    return { table: 'creator_waitlist', values: { email: input.email, artist_name: input.artistName as string } } as const;
  }
  return { table: 'pulse_waitlist', values: { email: input.email, role: input.role } } as const;
}
