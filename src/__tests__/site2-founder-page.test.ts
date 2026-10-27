import { readFileSync } from 'fs';
import { join } from 'path';
import { FOUNDER_PAGE_TEXTS as T, dnaTitle, galaxyTitle } from '@/lib/founderPageTexts';
import { HOME_TEXTS } from '@/lib/homeTexts';

// SITE2 — /bertrand, the founder's real profile (Decisions 174, 188 = V2, 189 = A, 190 = A of
// 27/10/2026): his galaxy and his Music DNA card, his account only, cut by FOUNDER_GALAXY=off.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const code = (p: string) => read(p).replace(/^\s*\/\/.*$/gm, '');

describe('SITE2 — validated texts (Decision 188 = V2)', () => {
  it('keeps the texts of planche-site2-bertrand.png word for word', () => {
    expect(T.metaTitle).toBe("Bertrand's Music DNA | Zik4U");
    expect([T.label, T.titleTop, T.titleBottom]).toEqual(['A real profile, live', 'This is Bertrand.', 'For real.']);
    expect(T.sub).toBe('Founder of Zik4U. Everything on this page comes from what he really played, and redraws itself every 15 minutes.');
    const g = T.galaxyTouch;
    expect(`${g.before}${g.sun}${g.middle}${g.planet}${g.after}`).toBe('The sun shines with how he listens. Each planet is a song he plays on repeat this week. Tap one.');
    expect(T.galaxyPointerEnd).toBe(' is a song he plays on repeat this week. Click one.');
    expect(`${T.dnaArchetype.before}${T.dnaArchetype.word}${T.dnaArchetype.after}${T.dnaRecord.before}${T.dnaRecord.word}${T.dnaRecord.after}`)
      .toBe('His archetype comes from his listens, not from a quiz. The record is the fingerprint of his week.');
    expect([T.galaxyLabel, T.dnaLabel, T.yoursLabel, T.yoursTitle]).toEqual(['01 · His galaxy', '02 · His Music DNA', '03 · Yours', 'Yours is next.']);
    expect(galaxyTitle(1442)).toBe('1,442 real listens.');
    expect(dnaTitle('Cultural Nomad')).toBe('Cultural Nomad.');
    expect(T.cardFooter).toBe('zik4u.com/bertrand');
    expect(HOME_TEXTS.founderPageLink).toBe("See Bertrand's full Music DNA");
    expect(JSON.stringify(T) + HOME_TEXTS.founderPageLink).not.toContain('—');
  });
});

describe('SITE2 — the page', () => {
  const page = code('src/app/bertrand/page.tsx');
  it('is rebuilt every 15 minutes and disappears with the switch', () => {
    expect(page).toContain('export const revalidate = 900;');
    expect(page).toContain('if (!founderGalaxyEnabled()) notFound();');
  });
  it('shows the galaxy, the card (founder footer, D190 play buttons kept) and one waitlist form', () => {
    expect(page).toContain('<FounderSky galaxy={liveGalaxy} />');
    expect(page).toContain('<MusicDnaCard card={card} footerUrl={T.cardFooter} />');
    expect((page.match(/<WaitlistForm /g) ?? []).length).toBe(1);
    expect(page).not.toMatch(/apps\.apple\.com|play\.google\.com|Download on the|Get it on/);
    expect(read('src/components/profile/SharedFullCard.tsx')).toContain('<ListenButton');
  });
  it('is linked from the home LIVE PROFILE band and listed in the sitemap', () => {
    expect(read('src/components/home/HomeHero.tsx')).toContain('href="/bertrand"');
    expect(read('src/app/sitemap.ts')).toContain('`${BASE_URL}/bertrand`');
  });
});

describe('SITE2 — privacy gates (Decision 189 = A, WEB-PRIV1)', () => {
  const src = code('src/lib/sharedCard.ts');
  it('reads listening data only after a gate: a live share key, or the founder account', () => {
    const load = src.indexOf('async function loadCard(');
    expect(load).toBeGreaterThan(src.indexOf("from('share_keys')"));
    expect(load).toBeGreaterThan(src.indexOf('export async function getFounderCard('));
    expect(src.indexOf("from('scrobbles')")).toBeGreaterThan(load);
    const founder = src.slice(src.indexOf('export async function getFounderCard('), load);
    expect(founder).toContain('if (!founderGalaxyEnabled()) return null;');
    expect(founder).toContain(".eq('username', FOUNDER_USERNAME)");
    expect(founder).not.toMatch(/rawHandle|username: string\)/);
  });
  it('returns nothing when the switch is off', async () => {
    const before = process.env.FOUNDER_GALAXY;
    process.env.FOUNDER_GALAXY = 'off';
    try {
      const { getFounderCard } = await import('@/lib/sharedCard');
      await expect(getFounderCard()).resolves.toBeNull();
    } finally {
      if (before === undefined) delete process.env.FOUNDER_GALAXY; else process.env.FOUNDER_GALAXY = before;
    }
  });
});
