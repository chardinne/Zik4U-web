/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// EMO1d paquet 1 (Zik4U session 102, D324 = A, texts validated by Bertrand on 15/11/2026,
// claude/EMO1d-TEXTES.md §4) — the Privacy Policy names the skipped tracks captured since
// 10/11/2026 (D298, migration 00247: short_plays, 90 days then per-track counts only).

const root = join(__dirname, '..', '..');
const flat = (p: string) => readFileSync(join(root, p), 'utf8').replace(/\s+/g, ' ');
const en = flat('src/app/legal/privacy/page.tsx');
const fr = flat('src/app/fr/legal/privacy/page.tsx');

describe('EMO1d — skipped tracks in the Privacy Policy (EN + FR)', () => {
  it('carries the validated English text', () => {
    expect(en).toContain('<Strong>Skipped tracks.</Strong> If your emotional mirror is on, Zik4U also records the tracks you start and then leave after at least 10 seconds, before they count as a listen (title, artist, the app, when you started it, how long you listened, and whether you moved to another track or closed the player). They are never shown or counted as listens. They help describe how you listen.');
    expect(en).toContain('<Strong>Skipped tracks</Strong>: kept for 90 days, then only counted per track without anyone&apos;s identity; deleted immediately when you turn off your emotional mirror.'); // EMO2 R3 (text 2.5)
    expect(en).toContain("const LAST_UPDATED = 'November 24, 2026';");
  });

  it('carries the French translation', () => {
    expect(fr).toContain('<Strong>Titres zappés.</Strong> Si votre miroir émotionnel est activé, Zik4U enregistre aussi les titres que vous lancez puis quittez après au moins 10 secondes');
    expect(fr).toContain('<Strong>Titres zappés</Strong> : conservés 90 jours, puis seulement comptés par titre, sans l&apos;identité de personne ; supprimés immédiatement quand vous désactivez votre miroir émotionnel.'); // EMO2 R3 (texte 2.5)
    expect(fr).toContain("const LAST_UPDATED = '24 novembre 2026';");
  });

  it('places the skipped tracks right after the listening mood profile, in both languages', () => {
    expect(en.indexOf('<Strong>Skipped tracks.</Strong>')).toBeGreaterThan(en.indexOf('A listener archetype is derived from your listening habits'));
    expect(en.indexOf('<Strong>Skipped tracks.</Strong>')).toBeLessThan(en.indexOf('<Strong>Music Match</Strong> (see section 6)'));
    expect(fr.indexOf('<Strong>Titres zappés.</Strong>')).toBeLessThan(fr.indexOf('<Strong>Music Match</Strong> (voir section 6)'));
  });

  it('has no long dash in the new text', () => {
    for (const s of [en, fr]) {
      const i = Math.max(s.indexOf('Skipped tracks.'), s.indexOf('Titres zappés.'));
      expect(s.slice(i, i + 600)).not.toMatch(/\u2014|\u2013/);
    }
  });
});
