/// <reference types="node" />
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// B2B-OFF1 — decisions D1/D2/D3 of 24/09/2026: the site sells no B2B offer and takes
// no payment. The B2B code lives only in Zik4U-api (dormant). Nothing may point to
// api.zik4u.com / admin.zik4u.com (domains that do not exist).

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('B2B-OFF1', () => {
  it('has no partner pages or partner/creator API routes', () => {
    for (const p of ['src/app/partner', 'src/app/api/partner', 'src/app/api/creator']) {
      expect(existsSync(join(root, p))).toBe(false);
    }
  });

  it('never points to api.zik4u.com or admin.zik4u.com', () => {
    const files = [...walk(join(root, 'src')).filter((f) => !f.includes('__tests__')), join(root, 'next.config.ts'), join(root, 'public', 'llms.txt')];
    const offenders = files.filter((f) => /(api|admin)\.zik4u\.com/.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('redirects /partner and /partner/* to the home page and proxies nothing', async () => {
    const config = (await import('../../next.config')).default;
    const redirects = await config.redirects!();
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: '/partner', destination: '/' }),
        expect.objectContaining({ source: '/partner/:path*', destination: '/' }),
      ]),
    );
    const rewrites = await config.rewrites!();
    const list = Array.isArray(rewrites) ? rewrites : [];
    expect(list.every((r) => !String(r.destination).startsWith('http'))).toBe(true);
  });

  it('keeps the CSP closed to payment and third-party API origins', () => {
    const cfg = read('next.config.ts');
    expect(cfg).not.toMatch(/stripe\.com|anthropic\.com/);
    expect(cfg).toContain("frame-src 'none'");
  });

  it('no longer advertises the B2B offer on the home page or to AI crawlers', () => {
    expect(read('src/app/page.tsx')).not.toContain("href:'/partner'");
    expect(read('public/llms.txt')).not.toMatch(/B2B|labels and researchers/);
  });
});
