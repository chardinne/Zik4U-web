/// <reference types="node" />
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// COMPLY1e + COMPLY1f + COMPLY1g (19/10/2026) — site guards.
// - Decision 102: Terms §13 without a cap for consumers.
// - Decisions 100, 104, 105: Privacy Policy says "listening mood profile", moods worked
//   out from when and how members listen, 16-17 opt-in, 13-month retention.
// - Decision 103: French versions of the four legal pages, linked both ways.
// - Decision 106 + Bertrand's instruction (no streaming service named on the site):
//   /works-with and /streaming-partners removed and redirected, home tiles removed, the
//   false claims of the Listeners page replaced, Terms §3 without names, llms.txt.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const visible = (src: string) => src.replace(/^\s*\/\/.*$/gm, '');
const SERVICES = /spotify|apple music|youtube|deezer|soundcloud|tidal|amazon music|boomplay|last\.fm|lastfm/i;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(e) ? [p] : [];
  });
}

describe('COMPLY1g — pages naming streaming services removed (Decision 106 = A)', () => {
  it('the pages are gone and their addresses go to the home page', () => {
    expect(existsSync(join(root, 'src/app/works-with'))).toBe(false);
    expect(existsSync(join(root, 'src/app/streaming-partners'))).toBe(false);
    const cfg = read('next.config.ts');
    expect(cfg).toContain("{ source: '/works-with', destination: '/', permanent: true },");
    expect(cfg).toContain("{ source: '/works-with/:path*', destination: '/', permanent: true },");
    expect(cfg).toContain("{ source: '/streaming-partners', destination: '/', permanent: true },");
  });

  it('nothing links or lists them any more', () => {
    const offenders = walk(join(root, 'src'))
      .filter((f) => !f.includes('__tests__'))
      .filter((f) => /works-with|streaming-partners|generatePlatformMetadata|PLATFORM_META/.test(visible(readFileSync(f, 'utf8'))));
    expect(offenders).toEqual([]);
    expect(read('public/llms.txt')).not.toMatch(/streaming-partners/);
  });

  it('the pages changed by this lot name no streaming service', () => {
    for (const f of ['src/app/page.tsx', 'src/app/listeners/page.tsx', 'src/app/listeners/layout.tsx', 'src/lib/pathTexts.ts',
      'src/app/legal/terms/page.tsx', 'src/app/fr/legal/terms/page.tsx', 'src/app/legal/privacy/page.tsx',
      'src/app/fr/legal/privacy/page.tsx', 'public/llms.txt']) {
      expect([f, SERVICES.test(visible(read(f)))]).toEqual([f, false]);
    }
  });

  it('the Listeners page carries the validated texts (replaced by Decision 184 = A, 27/10/2026)', () => {
    const s = flat(read('src/lib/pathTexts.ts'));
    for (const t of [
      'Zik4U notices the music you play in the apps you already use. Nothing to curate, nothing to fill in.',
      'Every week, a look back at how you really listened.',
    ]) {
      expect(s).toContain(t);
    }
    expect(flat(read('src/app/listeners/layout.tsx'))).toContain("pathMetadata('listeners')");
  });
});

describe('COMPLY1e/f — English legal pages', () => {
  it('Terms §3 and §13 (Decisions 102 and 106)', () => {
    const s = flat(read('src/app/legal/terms/page.tsx'));
    expect(s).toContain("const LAST_UPDATED = 'October 31, 2026';"); // PHOTO1d (D221) // WEB-CGU1 (Decision 146)
    expect(s).toContain('Zik4U is not affiliated with, endorsed or sponsored by any music streaming service or music app. Their names and trademarks belong to their owners.');
    expect(s).toContain('If you use Zik4U as a consumer, we are responsible for the damage you suffer as a direct and foreseeable result of our failure to meet our obligations, as provided by law.');
    expect(s).not.toMatch(/€100/);
  });

  it('Privacy Policy: listening mood profile, 16-17 opt-in, 13 months', () => {
    const s = flat(read('src/app/legal/privacy/page.tsx'));
    for (const t of [
      'Your listening mood profile is on by default if you are 18 or older, and off unless you turn it on if you are 16 or 17.',
      'These moods describe your listening habits: Zik4U does not analyze the music itself, and does not read or infer your feelings.',
      'your daily listening moods are kept for 13 months, then deleted automatically; everything is deleted immediately when you turn it off.',
      'If you tell us you are 16 or 17, your listening mood profile stays off unless you turn it on.',
      '<Strong>Settings › Privacy › Listening mood profile</Strong>',
    ]) {
      expect(s).toContain(t);
    }
    expect(s).not.toMatch(/reads the mood|emotional music profile|emotional profile/i);
    expect(read('public/llms.txt')).not.toMatch(/emotional music profile/i);
  });
});

describe('COMPLY1e — French legal pages (Decision 103 = A)', () => {
  const pairs: Array<[string, string, string]> = [
    ['src/app/legal/privacy/page.tsx', 'src/app/fr/legal/privacy/page.tsx', '/legal/privacy'],
    ['src/app/legal/terms/page.tsx', 'src/app/fr/legal/terms/page.tsx', '/legal/terms'],
    ['src/app/legal/notice/page.tsx', 'src/app/fr/legal/notice/page.tsx', '/legal/notice'],
    ['src/app/delete-account/page.tsx', 'src/app/fr/delete-account/page.tsx', '/delete-account'],
  ];

  it('each page links to its translation, both ways', () => {
    for (const [en, fr, path] of pairs) {
      expect(read(en)).toContain(`altHref="/fr${path}"`);
      expect(read(fr)).toContain(`altHref="${path}"`);
      expect(read(fr)).toContain('lang="fr"');
    }
  });

  it('French frame: equal value, labels', () => {
    const s = read('src/components/legal/LegalPage.tsx');
    expect(s).toContain("export const FR_EQUAL_VALUE = 'Les versions française et anglaise ont la même valeur.';");
    expect(s).toContain("lastUpdated: 'Dernière mise à jour : ',");
    expect(s).toContain("switchTo: 'Français',");
    expect(s).toContain("switchTo: 'English',");
  });

  it('carry the validated French texts', () => {
    const p = flat(read('src/app/fr/legal/privacy/page.tsx'));
    expect(p).toContain('<Strong>Profil d&apos;humeurs d&apos;écoute</Strong> (voir section 5)');
    expect(p).toContain('Ces humeurs décrivent vos habitudes d&apos;écoute : Zik4U n&apos;analyse pas la musique elle-même, et ne lit ni ne déduit vos sentiments.');
    expect(p).toContain('vos humeurs d&apos;écoute quotidiennes sont conservées 13 mois, puis supprimées automatiquement ; tout est supprimé immédiatement quand vous le désactivez.');
    const t = flat(read('src/app/fr/legal/terms/page.tsx'));
    expect(t).toContain("Zik4U n'est ni affilié à, ni approuvé ou parrainé par un service de streaming ou une application musicale. Leurs noms et marques appartiennent à leurs propriétaires.");
    expect(t).toContain('notre responsabilité totale envers vous est limitée aux sommes versées entre vous et Zik4U au cours des 12 mois précédant la réclamation.');
    expect(flat(read('src/app/fr/delete-account/page.tsx'))).toContain('avec pour objet « Supprimer mon compte » et votre nom d&apos;utilisateur.');
    expect(flat(read('src/app/fr/legal/notice/page.tsx'))).toContain('Supabase Pte. Ltd, 65 Chulia Street #38-02/03, OCBC Centre, Singapour 049513.');
  });

  it('are in the sitemap and use no long dash in visible text', () => {
    const sm = read('src/app/sitemap.ts');
    for (const [, , path] of pairs) {
      expect(sm).toContain(`\`\${BASE_URL}/fr${path}\``);
    }
    for (const [, fr] of pairs) {
      expect(visible(read(fr))).not.toContain('—');
    }
  });
});
