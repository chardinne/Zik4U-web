// SITE2 — texts of /bertrand, the founder's real profile (Decision 188 = V2 of 27/10/2026,
// planche-site2-bertrand.png). Asserted word for word by src/__tests__/site2-founder-page.test.ts.
// No long dash in visible text.

import { listensNumber } from '@/lib/homeTexts';

export const FOUNDER_PAGE_TEXTS = {
  metaTitle: "Bertrand's Music DNA | Zik4U",
  label: 'A real profile, live',
  titleTop: 'This is Bertrand.',
  titleBottom: 'For real.',
  sub: 'Founder of Zik4U. Everything on this page comes from what he really played, and redraws itself every 15 minutes.',
  galaxyLabel: '01 · His galaxy',
  galaxyFallbackTitle: 'His galaxy.',
  galaxyTouch: { sun: 'sun', before: 'The ', middle: ' shines with how he listens. Each ', planet: 'planet', after: ' is a song he plays on repeat this week. Tap one.' },
  galaxyPointerEnd: ' is a song he plays on repeat this week. Click one.',
  dnaLabel: '02 · His Music DNA',
  dnaFallbackTitle: 'His Music DNA.',
  dnaArchetype: { before: 'His ', word: 'archetype', after: ' comes from his listens, not from a quiz.' },
  dnaRecord: { before: ' The ', word: 'record', after: ' is the fingerprint of his week.' },
  yoursLabel: '03 · Yours',
  yoursTitle: 'Yours is next.',
  cardFooter: 'zik4u.com/bertrand',
} as const;

/** "1,442 real listens." */
export const galaxyTitle = (listens: number) => `${listensNumber(listens)} real listens.`;
/** "Cultural Nomad." */
export const dnaTitle = (archetypeLabel: string) => `${archetypeLabel}.`;
