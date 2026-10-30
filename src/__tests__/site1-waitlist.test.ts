/// <reference types="node" />
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { WAITLIST_TEXTS, parseWaitlistBody, waitlistRow } from '@/lib/waitlist';

// SITE1-1 — Decisions 171 = A, 176 = A, 178 = A (26/10/2026): one waitlist form on the whole site,
// no streaming platform asked or stored, no dead store button, privacy policy EN/FR aligned.

const mockUpsert = jest.fn();
const mockFrom = jest.fn(() => ({ upsert: mockUpsert }));
jest.mock('@/lib/supabase-server', () => ({ createServiceClient: () => ({ from: mockFrom }) }));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { POST } = require('@/app/api/waitlist/route') as typeof import('@/app/api/waitlist/route');

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const post = (body: unknown) => POST({ json: async () => body } as never);
// SITE1-2: the home page's form lives in its hero (src/components/home/HomeHero.tsx).
// SITE1-3: the Listeners / Creators / Fans pages share src/components/paths/PathPage.tsx (Decision 184 = A).
const PAGES = ['src/components/home/HomeHero.tsx', 'src/components/paths/PathPage.tsx'];

beforeEach(() => { mockUpsert.mockReset().mockResolvedValue({ error: null }); mockFrom.mockClear(); });

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
    expect(waitlistRow(l)).toEqual({ table: 'pulse_waitlist', values: { email: 'a@b.io', role: 'fan' } });
    expect(waitlistRow(c)).toEqual({ table: 'creator_waitlist', values: { email: 'a@b.io', artist_name: 'X' } });
  });
});

describe('SITE1-1 — /api/waitlist', () => {
  it('stores a listener in pulse_waitlist with its profile', async () => {
    const res = await post({ email: 'a@b.io', role: 'listener' });
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('pulse_waitlist');
    expect(mockUpsert).toHaveBeenCalledWith({ email: 'a@b.io', role: 'listener' }, { onConflict: 'email' });
  });
  it('stores a creator in creator_waitlist without platform', async () => {
    await post({ email: 'c@b.io', role: 'creator', artist_name: 'Seras', main_platform: 'spotify' });
    expect(mockFrom).toHaveBeenCalledWith('creator_waitlist');
    expect(mockUpsert).toHaveBeenCalledWith({ email: 'c@b.io', artist_name: 'Seras' }, { onConflict: 'email' });
  });
  it('answers a bot like a person and stores nothing', async () => {
    const res = await post({ email: 'a@b.io', role: 'fan', website: 'spam' });
    expect(await res.json()).toEqual({ success: true });
    expect(mockFrom).not.toHaveBeenCalled();
  });
  it('refuses invalid input and reports a database error without detail', async () => {
    expect((await post({ email: 'x', role: 'fan' })).status).toBe(400);
    mockUpsert.mockResolvedValueOnce({ error: { code: '42501', message: 'secret detail' } });
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
    expect(en).toContain("const LAST_UPDATED = 'October 30, 2026';");
  });
  it('FR says the same', () => {
    expect(fr).toContain("<Strong>Site.</Strong> Si vous vous inscrivez sur une liste d&apos;attente sur zik4u.com : votre adresse e-mail, le profil choisi (auditeur, créateur ou fan) et, pour les créateurs, votre nom d&apos;artiste. Le site n&apos;a ni connexion à un compte, ni mesure d&apos;audience, ni cookie publicitaire (section 13).");
    expect(fr).toContain(`["Listes d'attente", "E-mail, profil choisi, nom d'artiste", 'Votre consentement (vous vous inscrivez)']`);
    expect(fr).not.toContain('plateforme de streaming');
    expect(fr).toContain("const LAST_UPDATED = '30 octobre 2026';");
  });
});
