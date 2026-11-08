/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// COCKPIT1 (Zik4U session 90, D275 = A, texts validated by Bertrand on 08/11/2026,
// claude/COCKPIT1-TEXTES.md §B, D286 = A, D287 = A) — the prospects notice
// (GDPR art. 14) that every first outreach email links to: zik4u.com/privacy#prospects.

const root = join(__dirname, '..', '..');
const flat = (p: string) => readFileSync(join(root, p), 'utf8').replace(/\s+/g, ' ');
const en = flat('src/app/legal/privacy/page.tsx');
const fr = flat('src/app/fr/legal/privacy/page.tsx');

describe('COCKPIT1 — prospects notice (EN + FR)', () => {
  it('has the #prospects anchor before the contact section, in both languages', () => {
    for (const s of [en, fr]) {
      expect(s).toContain('<Section id="prospects" title="17. ');
      expect(s).toContain('<Section id="contact" title="18. Contact">');
      expect(s.indexOf('id="prospects"')).toBeLessThan(s.indexOf('id="contact"'));
    }
  });

  it('carries the validated English text', () => {
    expect(en).toContain('title="17. Professionals we contact (prospects)"');
    expect(en).toContain('Our legal basis is our legitimate interest in reaching the music professionals our service is built for (GDPR art. 6(1)(f)).');
    expect(en).toContain('Each message is read and sent by a person, never automatically.');
    expect(en).toContain('we delete your details 12 months after our last message.');
    expect(en).toContain('keep only your email address on a do-not-contact list, so that we never write to you again.');
    expect(en).toContain('You can object at any time, without giving a reason: reply &ldquo;no&rdquo; to our message');
    expect(en).toContain('Supabase (database, European Union), Google (Gmail, United States), Anthropic (AI assistant that helps us research public information and draft messages, United States), Hostinger (email sending).');
    expect(en).toContain("const LAST_UPDATED = 'November 8, 2026';");
  });

  it('carries the validated French text', () => {
    expect(fr).toContain('title="17. Les professionnels que nous contactons (prospects)"');
    expect(fr).toContain('Notre base légale est notre intérêt légitime à joindre les professionnels de la musique pour lesquels le service est conçu (RGPD art. 6, 1, f).');
    expect(fr).toContain('nous supprimons vos informations 12 mois après notre dernier message.');
    expect(fr).toContain('Vous pouvez vous opposer à tout moment, sans motif : répondez « non » à notre message');
    expect(fr).toContain("const LAST_UPDATED = '8 novembre 2026';");
  });

  it('has no long dash in the new visible text', () => {
    for (const s of [en, fr]) {
      const start = s.indexOf('id="prospects"');
      const section = s.slice(start, s.indexOf('id="contact"'));
      expect(section).not.toMatch(/—|–/);
    }
  });
});
