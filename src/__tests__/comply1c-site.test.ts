/// <reference types="node" />
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import nextConfig from '../../next.config';

// COMPLY1c (texts validated 16/10/2026, Decisions 68, 72 revised, 82-86 = A/B) — the legal
// pages say what Zik4U does: controller = Bertrand Chardinne for a French SAS in formation,
// database in the United States, no Stripe, no connected accounts, research opt-in, Music
// Match without relationship status, CNIL; a /delete-account page exists (Google Play);
// the cookie banner is gone (no cookie requires consent).

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const privacy = read('src/app/legal/privacy/page.tsx');
const terms = read('src/app/legal/terms/page.tsx');
const del = read('src/app/delete-account/page.tsx');
const visible = (src: string) => src.replace(/^\s*\/\/.*$/gm, '');

describe('COMPLY1c — legal pages tell the truth', () => {
  it('names the real controller in both texts (Decision 68)', () => {
    for (const src of [privacy, terms]) {
      expect(src.replace(/\s+/g, ' ')).toContain(
        'Bertrand Chardinne, founder, acting for Zik4U, a French simplified joint-stock company (SAS) in formation',
      );
    }
  });

  it('carries no false statement of the old texts', () => {
    for (const src of [privacy, terms, del].map(visible)) {
      expect(src).not.toMatch(/Zik4U Inc|Florida|C Corp|Frankfurt|eu-central-1|Stripe|dating_opt_in|relationship status["”]|OAuth tokens|rolling 12-month|anonymized after 30 days|Partner Program|17 years/);
    }
    expect(read('src/lib/seo.ts')).not.toMatch(/Zik4U Inc/);
  });

  it('says the database is in the United States, protected by SCCs (Decision 72 revised)', () => {
    expect(privacy).toContain("['Supabase', 'Database, sign-in, storage, server functions', 'United States (Virginia)']");
    expect(privacy).toContain('Standard');
    expect(privacy).toContain('Contractual Clauses');
    expect(privacy).toContain("['Sentry', 'Crash and error reports', 'United States']");
    expect(privacy).toContain("['Resend', 'Account emails (confirmation, password reset)', 'United States']");
  });

  it('keeps the anchors the app links to', () => {
    expect(privacy).toContain('id="research"');
    expect(privacy).toContain('id="music-match"');
    expect(privacy).toContain('id="cookies"');
  });

  it('states the decided ages, retention and rights', () => {
    expect(privacy).toContain('Zik4U is for people <Strong>16 and older</Strong>');
    expect(privacy).toContain('<Strong>100 people or more</Strong>');
    expect(privacy).toContain('deleted after 3 years without any activity');
    expect(privacy).toContain('at most 24 months');
    expect(privacy).toContain('the <Strong>CNIL</Strong>');
    expect(privacy).toContain('We do not sell or share your personal information');
    expect(terms).toContain('These Terms are governed by French law.');
    expect(terms).toContain('80% of the net amount Zik4U actually receives');
  });

  it('uses no long dash in visible text (site rule)', () => {
    for (const src of [privacy, terms, del, read('src/components/legal/LegalPage.tsx')].map(visible)) {
      expect(src).not.toContain('—');
    }
  });
});

describe('COMPLY1c — delete-account page (Google Play)', () => {
  it('explains both paths and the store subscription', () => {
    expect(del).toContain('Settings › Delete account');
    expect(del).toContain('from the email address of your Zik4U account');
    expect(del).toContain('<Strong>30 days</Strong>');
    expect(del).toContain('cancel it in your store settings first');
  });

  it('is listed in the sitemap', () => {
    expect(read('src/app/sitemap.ts')).toContain('`${BASE_URL}/delete-account`');
  });
});

describe('COMPLY1c — cookies and short links', () => {
  it('has no cookie banner any more (Decision 83)', () => {
    expect(existsSync(join(root, 'src/components/CookieBanner.tsx'))).toBe(false);
    expect(read('src/app/layout.tsx')).not.toContain('CookieBanner');
  });

  it('redirects /privacy and /terms to the legal pages', async () => {
    const r = await (nextConfig.redirects as () => Promise<unknown>)();
    const list = Array.isArray(r) ? r : [];
    expect(list).toContainEqual({ source: '/privacy', destination: '/legal/privacy', permanent: true });
    expect(list).toContainEqual({ source: '/terms', destination: '/legal/terms', permanent: true });
  });

  it('no longer depends on Stripe or Upstash', () => {
    const pkg = JSON.parse(read('package.json'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(deps).filter((d) => /stripe|upstash/.test(d))).toEqual([]);
  });
});
