/**
 * LOGO-2 lot b (10/10/2026) — the "Empreinte A" mark (electric violet #9B7BFF
 * on Nuit #120E24) is the site logo, favicon and root link preview. The old
 * vinyl logo, the generated "Z4" favicon and the generated root OG image are
 * gone. Every file is pinned: a stale asset cannot silently come back.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ROOT = path.resolve(__dirname, '../..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p));
const sha = (p: string) => crypto.createHash('sha256').update(read(p)).digest('hex');

const PINNED: Record<string, string> = {
  'public/zik4u-logo.svg': '2bb08d784f6d359ef3e979a1df0d1bda5929add9f1138120edde3f1c0a380e76',
  'public/og-image.png': 'b0a2b9253e0561fac271939073a45e68388b4b84254cff66b437710cc8d47e28',
  'public/favicon-32.png': 'b9728fadb746ce59cf931aed5638aabee8402c4bc24271ab77e554198779dbf3',
  'public/apple-touch-icon.png': 'a0879503bd83f881400cf48e5d7b9fb1ae48b96bdf0756cdc947855b7dd317fb',
  'public/icon-192.png': '00fd75bd85bb25f2f855234d556e389628876d2b6a963cf0b5f6777f4593c6b4',
  'public/icon-512.png': '9187ad7625038126721305832b18398cb3d040f911fbddfa39199c2e496f4869',
  'src/app/favicon.ico': '64d8291c68f7d35d51ae4911ea20d0fb77fd61c8b588edb73d321e0c33f9592f',
};

describe('LOGO-2 — site brand assets (Empreinte A)', () => {
  it.each(Object.entries(PINNED))('%s is the Empreinte A asset', (file, hash) => {
    expect(sha(file)).toBe(hash);
  });

  it('removes the vinyl logo, the generated favicon and the generated root OG image', () => {
    for (const f of [
      'public/zik4u-logo-512.svg',
      'public/zik4u-logo-horizontal.svg',
      'public/og-image.svg',
      'src/app/icon.tsx',
      'src/app/opengraph-image.tsx',
      'scripts/convert-icons.mjs',
    ]) {
      expect(fs.existsSync(path.join(ROOT, f))).toBe(false);
    }
  });

  it('shows the new logo in the landing nav and footer', () => {
    const page = read('src/app/page.tsx').toString();
    expect(page.match(/src="\/zik4u-logo\.svg"/g)).toHaveLength(2);
    expect(page).not.toContain('zik4u-logo-512');
    expect(read('public/zik4u-logo.svg').toString()).toContain('#9B7BFF');
  });

  it('points the root link preview and the manifest at the pack image', () => {
    const seo = read('src/lib/seo.ts').toString();
    const manifest = read('src/app/manifest.ts').toString();
    expect(seo).toContain("url: '/og-image.png'");
    expect(seo).toContain("images: ['/og-image.png']");
    expect(seo).not.toContain("'/opengraph-image'");
    expect(manifest).toContain("src: '/og-image.png'");
    expect(manifest).toContain("theme_color: '#120E24'");
  });
});
