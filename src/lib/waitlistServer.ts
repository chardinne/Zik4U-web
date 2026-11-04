import { createHmac } from 'crypto';

// AUDIT1-b (Decision 256 = A, 04/11/2026): server-side helpers of /api/waitlist. Kept out of
// src/lib/waitlist.ts, which the browser form also imports.

/** First address of x-forwarded-for (set by Vercel), else x-real-ip, else 'unknown'. */
export function waitlistClientIp(headers: { get(name: string): string | null }): string {
  const first = (headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim();
  return first || headers.get('x-real-ip')?.trim() || 'unknown';
}

/** HMAC-SHA256 of the address with a server-side key: the database never sees the address, and a
 *  hash cannot be reversed by trying the 4 billion IPv4 addresses without the key. */
export function waitlistIpHash(ip: string, key: string): string {
  return createHmac('sha256', key).update(ip).digest('hex');
}
