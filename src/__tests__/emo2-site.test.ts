/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// EMO2 R3 (Zik4U session 105, Decision 333 = A; texts 2.4 and 2.5 of claude/EMO1d-TEXTES.md,
// validated by Bertrand on 15/11/2026, Decisions 325-327) — the Privacy Policy describes the
// emotional mirror the app ships in R2 (develop, 17/11/2026), in English and in French.

const root = join(__dirname, '..', '..');
const flat = (p: string) => readFileSync(join(root, p), 'utf8').replace(/\s+/g, ' ');
const en = flat('src/app/legal/privacy/page.tsx');
const fr = flat('src/app/fr/legal/privacy/page.tsx');

describe('EMO2 R3 — emotional mirror in the Privacy Policy (EN)', () => {
  it('section 5 is text 2.4, word for word', () => {
    for (const t of [
      '<Section id="emotional-profile" title="5. Your listening moods and your emotional mirror">',
      '<Strong>Your listening mood profile.</Strong> Every night, Zik4U sorts the listens of the day before into listening moods (for example Late Night, Explorer or Deep Focus) based on when and how you listened, and derives a listener archetype from your last 30 days. Your archetype is shown on your Music DNA card; your listening moods are never shared with anyone. If you are 18 or older it is on by default (legitimate interest: your music identity is what Zik4U is for); if you are 16 or 17 it stays off unless you turn it on. Turning it off deletes your archetype and the moods behind it.',
      '<Strong>Your emotional mirror (18 and older, only if you turn it on).</Strong> Zik4U describes each track by the emotions it usually carries (for example Nostalgia, Melancholy or Joy), worked out from the track itself: its sound and what it is about. Zik4U never uses your voice, your face or any body signal. With your permission, Zik4U uses these descriptions, your listens and your skipped tracks to show you a private weekly mirror, and invites you, at most once a week, to say how a few tracks felt to you. Your answers are private, dated, and can be changed or deleted one by one. Other members only see, for a track answered by 20 or more different people, its most frequent emotion, with no names and no numbers.',
      '<Strong>What it is not.</Strong> It reflects music, not your health. Zik4U makes no health or mental-health assessment, does not use it for advertising, and never alerts you about how you feel.',
      '<Strong>Your choice.</Strong> Your emotional mirror is based on your explicit consent, given when you turn it on. Turn it off anytime in <Strong>Settings › Privacy › Emotional mirror</Strong>: your mirror, your answers and your skipped tracks are deleted, and trends shown to others are recalculated without your answers.',
    ]) {
      expect(en).toContain(t);
    }
  });

  it('sections 3, 4, 11 and 12 carry text 2.5', () => {
    expect(en).toContain('<Strong>Emotional mirror</Strong> (see section 5), only if you turn it on: the emotions you give to tracks (and when), your weekly mirror, and how you answered (time taken, how long after listening).');
    expect(en).toContain("['Emotional mirror and your answers', 'Listening, skipped tracks, your answers', 'Your explicit consent (you turn it on)']");
    expect(en).toContain('<Strong>Emotional mirror</Strong>: your answers and mirror are kept while it is on; everything is deleted immediately when you turn it off.');
    expect(en).toContain('and to withdraw your consent to your emotional mirror at any time');
  });

  it('no longer promises that Zik4U never reads the music or feelings', () => {
    expect(en).not.toContain('does not analyze the music itself');
    expect(en).not.toContain('does not read or infer your feelings');
    expect(en).not.toContain('not your health or your emotions');
    expect(en).toContain("const LAST_UPDATED = 'November 24, 2026';");
  });
});

describe('EMO2 R3 — the French translation', () => {
  it('section 5 and the other sections', () => {
    for (const t of [
      '<Section id="emotional-profile" title="5. Vos humeurs d\'écoute et votre miroir émotionnel">',
      '<Strong>Votre miroir émotionnel (18 ans et plus, seulement si vous l&apos;activez).</Strong>',
      'Zik4U n&apos;utilise jamais votre voix, votre visage ni aucun signal de votre corps.',
      '<Strong>Ce que ce n&apos;est pas.</Strong> Il reflète la musique, pas votre santé.',
      '<Strong>« Settings › Privacy › Emotional mirror »</Strong>',
      '<Strong>Miroir émotionnel</Strong> (voir section 5), seulement si vous l&apos;activez',
      "['Miroir émotionnel et vos réponses', 'Écoutes, titres zappés, vos réponses', \"Votre consentement explicite (vous l'activez)\"]",
      '<Strong>Miroir émotionnel</Strong> : vos réponses et votre miroir sont conservés tant qu&apos;il est activé',
      'du droit de retirer à tout moment votre consentement à votre miroir émotionnel',
      "const LAST_UPDATED = '24 novembre 2026';",
    ]) {
      expect(fr).toContain(t);
    }
    expect(fr).not.toContain('ne lit ni ne déduit vos sentiments');
  });

  it('has no long dash in the new texts', () => {
    for (const [s, k] of [[en, 'Your emotional mirror (18'], [fr, 'Votre miroir émotionnel (18']] as const) {
      const i = s.indexOf(k);
      expect(i).toBeGreaterThan(0);
      expect(s.slice(i, i + 1600)).not.toMatch(/—|–/);
    }
  });
});
