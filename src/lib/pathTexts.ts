// SITE1-3 — texts of the Listeners / Creators / Fans pages, validated by Bertrand: Decision 184 = A
// (27/10/2026, planche-site1-3.png). Every item names a screen that exists in the app (checked
// against the app code on 27/10/2026). Asserted word for word by src/__tests__/site1-paths.test.ts.
// No long dash, no store link, no streaming service name.

import type { WaitlistRole } from '@/lib/waitlist';

export interface PathItem { title: string; body: string }
export interface PathStep { lead: string; rest: string }
export interface PathTexts {
  role: WaitlistRole;
  metaTitle: string;
  label: string;
  titleTop: string;
  titleBottom: string;
  sub: string;
  sectionLabel: string;
  sectionTitle: string;
  steps?: readonly PathStep[];
  money?: { big: string; body: string };
  toolsLabel?: string;
  items: readonly PathItem[];
  note?: string;
}

export const PATH_TEXTS = {
  listeners: {
    role: 'listener',
    metaTitle: 'For Listeners | Zik4U',
    label: 'For listeners',
    titleTop: 'Your galaxy.',
    titleBottom: 'Drawn from what you play.',
    sub: 'Zik4U notices the music you play in the apps you already use. Nothing to curate, nothing to fill in.',
    sectionLabel: 'What you get',
    sectionTitle: 'Your music, for real.',
    items: [
      { title: 'Your galaxy', body: 'A sun, planets and a place in the universe, redrawn from every real listen.' },
      { title: 'Your archetype', body: 'Seven listener profiles, from Night Explorer to Zen Drifter. Yours comes from your listens, not from a quiz.' },
      { title: 'Weekly insights', body: 'Every week, a look back at how you really listened.' },
      { title: 'Music compatibility', body: 'A score between you and anyone, from the music you both play.' },
      { title: 'Music Match', body: 'Meet people who listen like you. Only if you opt in.' },
    ],
  },
  creators: {
    role: 'creator',
    metaTitle: 'For Creators | Zik4U',
    label: 'For creators',
    titleTop: 'Let fans in.',
    titleBottom: 'Get paid for it.',
    sub: 'Fans subscribe to see what you actually listen to. Not a playlist you built for them. What you really play.',
    sectionLabel: 'How it works',
    sectionTitle: 'Four steps.',
    steps: [
      { lead: 'Listen as usual.', rest: 'Zik4U captures what you play in your own music apps.' },
      { lead: 'Set your tiers', rest: 'in the Creator Studio.' },
      { lead: 'Fans subscribe in the app,', rest: 'through the App Store or Google Play.' },
      { lead: 'You get paid.', rest: '' },
    ],
    money: { big: '80%', body: 'of the net amount Zik4U receives after the store commission. Every month a fan stays subscribed.' },
    toolsLabel: 'Your tools',
    items: [
      { title: 'Exclusive Drops', body: 'Share a track with the moment behind it, for subscribers only.' },
      { title: 'Creator analytics', body: 'Your revenue and your subscribers, at a glance.' },
      { title: 'Wrapped Creator', body: 'Shareable cards made from your real listens. Post them, your fans follow the link.' },
    ],
  },
  fans: {
    role: 'fan',
    metaTitle: 'For Fans | Zik4U',
    label: 'For fans',
    titleTop: 'Their real music.',
    titleBottom: 'Not their playlist.',
    sub: 'Subscribe to an artist and see what they actually play, in the morning, at night, when no one is watching.',
    sectionLabel: 'What you get',
    sectionTitle: 'Inside their world.',
    items: [
      { title: 'Their real listens', body: 'What they play, captured, not curated.' },
      { title: 'Exclusive Drops', body: 'A track they share with the moment behind it, for subscribers only.' },
      { title: 'Compatibility score', body: 'How close your music is to theirs.' },
      { title: 'Fan Card', body: 'Your card with the artist, ready to share.' },
    ],
    note: 'Artists join Zik4U at launch. Their profiles show up here when they do.',
  },
} as const satisfies Record<'listeners' | 'creators' | 'fans', PathTexts>;

export type PathKey = keyof typeof PATH_TEXTS;

/** Metadata of a path page: the page's own title and subtitle, nothing else promised. */
export function pathMetadata(key: PathKey) {
  const t = PATH_TEXTS[key];
  const url = `https://zik4u.com/${key}`;
  return {
    // absolute: the site's '%s | Zik4U' template would print "For Fans | Zik4U | Zik4U".
    title: { absolute: t.metaTitle },
    description: t.sub,
    openGraph: { title: t.metaTitle, description: t.sub, url },
    twitter: { title: t.metaTitle, description: t.sub },
    alternates: { canonical: url },
  };
}
