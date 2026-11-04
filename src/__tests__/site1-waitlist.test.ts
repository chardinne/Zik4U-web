/// <reference types="node" />
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { WAITLIST_TEXTS, parseWaitlistBody, waitlistRpcArgs } from '@/lib/waitlist';
import { waitlistClientIp, waitlistIpHash } from '@/lib/waitlistServer';

// SITE1-1 — Decisions 171 = A, 176 = A, 178 = A (26/10/2026): one waitlist form on the whole site,
// no streaming platform asked or stored, no dead store button, privacy policy EN/FR aligned.

const mockRpc = jest.fn();
const mockFrom = jest.fn();
jest.mock('@/lib/supabase-server', () => ({ createServiceClient: () => ({ from: mockFrom, rpc: mockRpc }) }));
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { POST } = require('@/app/api/waitlist/route') as typeof import('@/app/api/waitlist/route');

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const headers = (h: Record<string, string>) => ({ get: (n: string) => h[n.toLowerCase()] ?? null });
const post = (body: unknown, h: Record<string, string> = { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }) =>
  POST({ json: async () => body, headers: headers(h) } as never);
const HASH = waitlistIpHash('203.0.113.7', 'test-key');
// SITE1-2: the home page's form lives in its hero (src/components/home/HomeHero.tsx).
// SITE1-3: the Listeners / Creators / Fans pages share src/components/paths/PathPage.tsx (Decision 184 = A).
const PAGES = ['src/components/home/HomeHero.tsx', 'src/components/paths/PathPage.tsx'];

beforeEach(() => { mockRpc.mockReset().mockResolvedValue({ data: 'ok', error: null }); mockFrom.mockClear(); });

describe('SITE1-1 — validated texts (Decision 176)', () => {
  it('keeps the form texts word for word', () => {
    expect(WAITLIST_TEXTS).toEqual({
      roles: { listener: 'Listener', creator: 'Creator', fan: 'Fan' },
      artistPlaceholder: 'Artist name',
      emailPlaceholder: 'you@email.com',
      button: 'Join the waitlist',
      fine: 'We write to you once, when Zik4U opens.',
      privacyLink: 'Privacy',
      successTitle: "You're on the list.",
      successBody: "We'll write to you when Zik4U opens. Your galaxy starts with your first real listen.",
      error: "That didn't go through. Please try again.",
    });
  });
});

describe('SITE1-1 — validation', () => {
  it('accepts listener, fan and creator, lowercases the email', () => {
    expect(parseWaitlistBody({ email: ' A@B.io ', role: 'listener' })).toEqual({ ok: true, email: 'a@b.io', role: 'listener', artistName: null, bot: false });
    expect(parseWaitlistBody({ email: 'a@b.io', role: 'creator', artist_name: ' Seras ' })).toMatchObject({ ok: true, artistName: 'Seras' });
  });
  it('refuses a bad email, an unknown profile, a creator without artist name', () => {
    expect(parseWaitlistBody({ email: 'nope', role: 'fan' })).toEqual({ ok: false, error: 'invalid_email' });
    expect(parseWaitlistBody({ email: 'a@b.io', role: 'label' })).toEqual({ ok: false, error: 'invalid_role' });
    expect(parseWaitlistBody({ email: 'a@b.io', role: 'creator' })).toEqual({ ok: false, error: 'artist_name_required' });
    expect(parseWaitlistBody({ email: 'a@b.io', role: 'creator', artist_name: 'x'.repeat(101) })).toEqual({ ok: false, error: 'artist_name_required' });
  });
  it('never writes a platform nor created_at', () => {
    const l = parseWaitlistBody({ email: 'a@b.io', role: 'fan', main_platform: 'spotify' });
    const c = parseWaitlistBody({ email: 'a@b.io', role: 'creator', artist_name: 'X', main_platform: 'spotify' });
    if (!l.ok || !c.ok) throw new Error('unexpected');
    expect(waitlistRpcArgs(l, 'h')).toEqual({ p_email: 'a@b.io', p_role: 'fan', p_artist_name: null, p_ip_hash: 'h' });
    expect(waitlistRpcArgs(c, 'h')).toEqual({ p_email: 'a@b.io', p_role: 'creator', p_artist_name: 'X', p_ip_hash: 'h' });
  });
});

describe('SITE1-1 — /api/waitlist', () => {
  it('signs a listener up through waitlist_sign_up, with a hash of the address and never the address', async () => {
    const res = await post({ email: 'a@b.io', role: 'listener' });
    expect(res.status).toBe(200);
    expect(mockRpc).toHaveBeenCalledWith('waitlist_sign_up', { p_email: 'a@b.io', p_role: 'listener', p_artist_name: null, p_ip_hash: HASH });
    expect(JSON.stringify(mockRpc.mock.calls)).not.toContain('203.0.113.7');
    expect(mockFrom).not.toHaveBeenCalled();
  });
  it('signs a creator up without platform', async () => {
    await post({ email: 'c@b.io', role: 'creator', artist_name: 'Seras', main_platform: 'spotify' });
    expect(mockRpc).toHaveBeenCalledWith('waitlist_sign_up', { p_email: 'c@b.io', p_role: 'creator', p_artist_name: 'Seras', p_ip_hash: HASH });
  });
  it('answers 429 over the limit (the form shows its existing error text)', async () => {
    mockRpc.mockResolvedValueOnce({ data: 'rate_limited', error: null });
    const res = await post({ email: 'a@b.io', role: 'fan' });
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'rate_limited' });
  });
  it('reads the first forwarded address, then x-real-ip', () => {
    expect(waitlistClientIp(headers({ 'x-forwarded-for': ' 198.51.100.2 , 10.0.0.1' }))).toBe('198.51.100.2');
    expect(waitlistClientIp(headers({ 'x-real-ip': '198.51.100.3' }))).toBe('198.51.100.3');
    expect(waitlistClientIp(headers({}))).toBe('unknown');
    expect(waitlistIpHash('198.51.100.2', 'k')).toMatch(/^[0-9a-f]{64}$/);
    expect(waitlistIpHash('198.51.100.2', 'k')).not.toBe(waitlistIpHash('198.51.100.2', 'other'));
  });
  it('answers a bot like a person and stores nothing', async () => {
    const res = await post({ email: 'a@b.io', role: 'fan', website: 'spam' });
    expect(await res.json()).toEqual({ success: true });
    expect(mockRpc).not.toHaveBeenCalled();
  });
  it('refuses invalid input and reports a database error without detail', async () => {
    expect((await post({ email: 'x', role: 'fan' })).status).toBe(400);
    mockRpc.mockResolvedValueOnce({ data: null, error: { code: '42501', message: 'secret detail' } });
    const res = await post({ email: 'a@b.io', role: 'fan' });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'unavailable' });
  });
});

describe('SITE1-1 — pages', () => {
  it('has removed the two old waitlist routes', () => {
    expect(existsSync(join(root, 'src/app/api/pulse-waitlist'))).toBe(false);
    expect(existsSync(join(root, 'src/app/api/creator-waitlist'))).toBe(false);
  });
  it('shows exactly one waitlist form per page and no store button', () => {
    for (const p of PAGES) {
      const s = read(p);
      expect((s.match(/<WaitlistForm /g) ?? []).length).toBe(1);
      expect(s).not.toMatch(/apps\.apple\.com|play\.google\.com|APP_STORE_URL|PLAY_STORE_URL/);
      expect(s).not.toMatch(/pulse-waitlist|creator-waitlist/);
    }
  });
  it('names no streaming platform on the creators page nor in the waitlist code', () => {
    for (const p of ['src/app/creators/page.tsx', 'src/lib/pathTexts.ts', 'src/components/paths/PathPage.tsx', 'src/lib/waitlist.ts', 'src/app/api/waitlist/route.ts', 'src/components/waitlist/WaitlistForm.tsx']) {
      expect(read(p)).not.toMatch(/Spotify|Apple Music|Deezer|SoundCloud|Tidal|YouTube/);
    }
  });
});

describe('SITE1-1 — privacy policy (Decision 178)', () => {
  const en = flat(read('src/app/legal/privacy/page.tsx'));
  const fr = flat(read('src/app/fr/legal/privacy/page.tsx'));
  it('EN says what the waitlist keeps, and no platform', () => {
    expect(en).toContain('<Strong>Website.</Strong> If you join a waitlist on zik4u.com: your email address, the profile you pick (listener, creator or fan), and for creators your artist name. The website has no account login, no analytics and no advertising cookies (section 13).');
    expect(en).toContain("['Waitlists', 'Email, profile picked, artist name', 'Your consent (you sign up)']");
    expect(en).not.toContain('main streaming platform');
    expect(en).toContain("const LAST_UPDATED = 'November 3, 2026';");
  });
  it('FR says the same', () => {
    expect(fr).toContain("<Strong>Site.</Strong> Si vous vous inscrivez sur une liste d&apos;attente sur zik4u.com : votre adresse e-mail, le profil choisi (auditeur, créateur ou fan) et, pour les créateurs, votre nom d&apos;artiste. Le site n&apos;a ni connexion à un compte, ni mesure d&apos;audience, ni cookie publicitaire (section 13).");
    expect(fr).toContain(`["Listes d'attente", "E-mail, profil choisi, nom d'artiste", 'Votre consentement (vous vous inscrivez)']`);
    expect(fr).not.toContain('plateforme de streaming');
    expect(fr).toContain("const LAST_UPDATED = '3 novembre 2026';");
  });
});
