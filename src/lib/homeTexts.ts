// SITE1-2 — texts of the new home page (M2), validated by Bertrand: Decision 176 = A (26/10/2026,
// planche-site1-M2.png and planche-site1-cas-limites.png), Decision 177 = B (live line).
// Asserted word for word by src/__tests__/site1-galaxy.test.ts. No long dash in visible text.

export const HOME_TEXTS = {
  kantQuote: '“Music is a language of the affects.”',
  kantSource: 'Immanuel Kant, 1790',
  titleTop: 'Your music.',
  titleBottom: 'As it really is.',
  subTouch: "Tap a planet: it's a song Bertrand plays on repeat. Zik4U drew it from his real listens. Yours is next.",
  subPointer: "Click a planet: it's a song Bertrand plays on repeat. Zik4U drew it from his real listens. Yours is next.",
  liveLabel: 'live',
  bandLabel: 'LIVE PROFILE',
  bandLead: 'This is the galaxy of Bertrand, founder of Zik4U.',
  bandListensBefore: 'Drawn from',
  bandListensAfter: 'real listens',
  bandRest: 'Every planet is a song he plays on repeat this week. The sun shines with how he listens. It redraws itself every 15 minutes.',
  fallbackCaption: 'This is the galaxy of Bertrand, founder of Zik4U.',
  whyLabel: "Why it's different",
  whyTitle: 'Nobody can fake a galaxy.',
  ideas: [
    { title: 'Captured, not declared.', body: 'Zik4U notices the music you play in the apps you already use. Nothing to fill in, nothing to curate.' },
    { title: 'Yours alone.', body: 'Your sun, your planets and your place in the universe come from your listens. Two people never get the same galaxy.' },
    { title: 'Alive.', body: 'Play something new and your galaxy moves. Loop a song all week and it becomes a planet.' },
  ],
  doorsLabel: 'Who are you?',
  doorsTitle: 'Three ways in.',
  doors: [
    { label: 'Listeners', body: 'See your real music identity.', href: '/listeners' },
    { label: 'Creators', body: 'Let fans into what you really listen to.', href: '/creators' },
    { label: 'Fans', body: "Get inside your favorite artist's actual world.", href: '/fans' },
  ],
  footerNote: 'Zik4U never plays music: every play opens your own music app.',
} as const;

/** "8 PM" for 20, "12 AM" for 0, "12 PM" for 12. */
export function hourLabel(h: number): string {
  const hh = ((h % 24) + 24) % 24;
  const n = hh % 12 === 0 ? 12 : hh % 12;
  return `${n} ${hh < 12 ? 'AM' : 'PM'}`;
}

/** "<n> plays this week · mostly around <hour>" (validated card line); "1 play" when there is one. */
export function playsLine(plays: number, peakHour: number | null): string {
  const p = `${plays} ${plays === 1 ? 'play' : 'plays'} this week`;
  return peakHour === null ? p : `${p} · mostly around ${hourLabel(peakHour)}`;
}

/** "4 min ago", "2 h ago", "3 d ago" (never "0 min"). */
export function agoLabel(fromIso: string, nowMs: number): string {
  const min = Math.max(1, Math.floor((nowMs - new Date(fromIso).getTime()) / 60000));
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export const lastRedrawnLabel = (fetchedAt: string, nowMs: number) => `Last redrawn ${agoLabel(fetchedAt, nowMs)}`;
export const lastHeardLabel = (playedAt: string, title: string, nowMs: number) => `Last heard ${agoLabel(playedAt, nowMs)} · ${title}`;
export const artistsLabel = (n: number) => `${n.toLocaleString('en-US')} artists`;
export const listensNumber = (n: number) => n.toLocaleString('en-US');
