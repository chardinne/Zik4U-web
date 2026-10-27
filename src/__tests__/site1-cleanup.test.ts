import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { SITE_TITLE, SITE_DESCRIPTION, defaultMetadata } from '@/lib/seo';

// SITE1-4 — Decisions 185 = A and 186 (27/10/2026): title and description of the site, no X
// account that is not Zik4U's, no partnership contact (B2B-OFF1), no dead code of the old site.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

describe('SITE1-4 — title and description (Decision 185 = A)', () => {
  it('keeps the validated texts word for word', () => {
    expect(SITE_TITLE).toBe('Zik4U · Your music, as it really is.');
    expect(SITE_DESCRIPTION).toBe('Zik4U draws your galaxy from the music you really play, in the apps you already use. Join the waitlist.');
    expect(defaultMetadata.title).toEqual({ default: SITE_TITLE, template: '%s | Zik4U' });
    expect(defaultMetadata.description).toBe(SITE_DESCRIPTION);
  });
  it('uses them everywhere, with no long dash and no streaming service keyword', () => {
    const seo = read('src/lib/seo.ts');
    const manifest = read('src/app/manifest.ts');
    expect(seo).not.toContain('—');
    expect(manifest).not.toContain('—');
    expect(manifest).toContain('description: SITE_DESCRIPTION');
    expect(read('src/app/layout.tsx')).toContain('description: SITE_DESCRIPTION');
    expect(seo).not.toMatch(/spotify|apple music|all platforms|passive revenue|music analytics/i);
  });
});

describe('SITE1-4 — structured data and accounts (Decision 186, B2B-OFF1)', () => {
  it('declares no X account and no partnership contact', () => {
    for (const f of ['src/lib/seo.ts', 'src/app/layout.tsx']) {
      const s = read(f);
      expect(s).not.toMatch(/@zik4u'|twitter\.com\/zik4u|x\.com\/zik4u|partner@zik4u\.com|Partnership/);
    }
  });
  it('points the logo to a real file and searches nothing', () => {
    const s = read('src/app/layout.tsx');
    expect(s).toContain("url: 'https://zik4u.com/icon-512.png'");
    expect(existsSync(join(root, 'public/icon-512.png'))).toBe(true);
    expect(s).not.toMatch(/opengraph-image|SearchAction/);
  });
});

describe('SITE1-4 — dead code removed', () => {
  it('has no old auth modal, demo creators or creator metadata', () => {
    for (const f of ['src/components/auth/AuthModal.tsx', 'src/lib/supabase.ts', 'src/components/landing/CreatorCard.tsx', 'src/components/landing/TierCard.tsx', 'src/lib/creators.ts']) {
      expect([f, existsSync(join(root, f))]).toEqual([f, false]);
    }
    expect(read('src/lib/seo.ts')).not.toContain('generateCreatorMetadata');
  });
});
