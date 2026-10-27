import { readFileSync } from 'fs';
import { join } from 'path';

// SITE1-5 — Decision 183 = A (27/10/2026): no store button, no app banner and no store link
// anywhere on the site until the store listings exist. Put them back on publication day
// (and change this guard in the same commit).

const read = (p: string) => readFileSync(join(__dirname, '..', '..', p), 'utf8');
const FILES = [
  'src/app/layout.tsx',
  'src/app/manifest.ts',
  'src/lib/seo.ts',
  'src/components/profile/MinimalProfileCard.tsx',
  'src/components/profile/SharedFullCard.tsx',
];

describe('SITE1-5 — no store link before the store listings (Decision 183 = A)', () => {
  it.each(FILES)('%s has no store link, app banner or app link', (f) => {
    const s = read(f);
    expect(s).not.toMatch(/apps\.apple\.com|play\.google\.com|apple-itunes-app|google-play-app|android-app:|related_applications|al:ios|al:android|6748722257|com\.zik4u\.app/);
    expect(s).not.toMatch(/Download on the App Store|Get it on Google Play|APP_STORE_URL|PLAY_STORE_URL/);
  });
  it('drops the app description from the structured data (no install link, no promised features)', () => {
    expect(read('src/app/layout.tsx')).not.toContain('MobileApplication');
  });
  it('offers the waitlist on both profile cards instead', () => {
    for (const f of ['src/components/profile/MinimalProfileCard.tsx', 'src/components/profile/SharedFullCard.tsx']) {
      const s = read(f);
      expect(s).toContain('<WaitlistForm defaultRole="listener" />');
      expect(s).not.toContain('zik4u://profile/');
    }
  });
});
