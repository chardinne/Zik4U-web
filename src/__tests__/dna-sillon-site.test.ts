/// <reference types="node" />
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

// DNA-SILLON site — decisions 44, 45 and 46 = A (12/10/2026): the shared card of the site
// is the app's Music DNA card (record, pills, A-side in bars), titles as cleaned by the
// server, and a link preview that shows the record when the link carries its live key.

import {
  fingerprintAccessibilityLabel,
  fingerprintBubbleText,
  fingerprintCaption,
  listensLine,
  parseFingerprint,
  ringArcPath,
  CONSTELLATION_LABEL,
} from '@/lib/listeningFingerprint';
import { displayTrack, onRepeatOf, previewImageUrl } from '@/lib/sharedCard';

jest.mock('@/lib/supabase-server', () => ({ createServiceClient: jest.fn() }));

const root = join(__dirname, '..', '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8').replace(/^\s*\/\/.*$/gm, '');

// Real answer of get_listening_fingerprint (account bbr, 12/10/2026) and the paths the
// app module (Zik4U develop f0dfd9e) draws from it.
const REAL = { v: 1, rings: [{ gap: 115.62, centre: 175.3 }, { gap: 77.5, centre: 259.65 }, { gap: 118.43, centre: 90.32 }, { gap: 92.59, centre: 227.82 }, { gap: 101.1, centre: 5.33 }], listens: 1022 };
const APP_PATHS = [
  'M69.2 66.6 A13 13 0 1 1 71 88.53',
  'M89.84 53.25 A27 27 0 1 1 56.59 59.32',
  'M41.66 97.79 A41 41 0 1 1 112.11 98.18',
  'M80.95 22.14 A55 55 0 1 1 22.02 75.54',
  'M115.7 134.12 A69 69 0 1 1 125.6 28.02',
];

describe('empreinte (port of the app module)', () => {
  it('draws exactly the paths of the app', () => {
    const fp = parseFingerprint(REAL);
    expect(fp?.listens).toBe(1022);
    expect(fp?.rings.map((r, i) => ringArcPath(i, r))).toEqual(APP_PATHS);
  });

  it('refuses anything that is not a v1 answer', () => {
    for (const bad of [null, 'x', {}, { ...REAL, v: 2 }, { ...REAL, listens: -1 }, { ...REAL, rings: 'no' },
      { ...REAL, rings: [...REAL.rings, REAL.rings[0]] }, { ...REAL, rings: [{ centre: 1, gap: 0 }] }, { ...REAL, rings: [{ centre: 1, gap: 360 }] }]) {
      expect(parseFingerprint(bad)).toBeNull();
    }
    expect(parseFingerprint({ v: 1, listens: 0, rings: [] })).toEqual({ listens: 0, rings: [] });
    expect(parseFingerprint({ v: 1, listens: 3, rings: [{ centre: '40.5', gap: '120' }] })?.rings).toEqual([{ centre: 40.5, gap: 120 }]);
  });

  it('carries the texts of decisions 21, 29, 36 and 46 word for word', () => {
    expect(fingerprintCaption(1022)).toBe('MY GROOVES · 1,022 REAL LISTENS');
    expect(fingerprintCaption(1)).toBe('MY GROOVES · 1 REAL LISTEN');
    expect(fingerprintBubbleText(1022)).toBe('Drawn from 1,022 real listens');
    expect(fingerprintBubbleText(0)).toBe('No real listens yet');
    expect(fingerprintAccessibilityLabel('bertrand', 1022)).toBe('Music identity of @bertrand, drawn from 1,022 real listens');
    expect(CONSTELLATION_LABEL).toBe('A-SIDE · MY CONSTELLATION');
    expect(listensLine(1022)).toBe('1,022 REAL LISTENS');
  });
});

describe('titles (decision 45) and ON REPEAT', () => {
  const raw = { track_title: 'Renaud - Toujours debout (Clip officiel)', artist_name: 'Renaud' };

  it('shows the title cleaned by the server, the captured one otherwise', () => {
    expect(displayTrack({ ...raw, track_title_normalized: 'Toujours debout', artist_name_normalized: 'Renaud' }))
      .toEqual({ title: 'Toujours debout', artist: 'Renaud' });
    expect(displayTrack({ ...raw, track_title_normalized: null, artist_name_normalized: '  ' })).toEqual({ title: raw.track_title, artist: 'Renaud' });
    expect(displayTrack(raw)).toEqual({ title: raw.track_title, artist: 'Renaud' });
  });

  it('ON REPEAT = the most played cleaned track, artist conflicts left out', () => {
    const goeland = { track_title: 'Coeur de goéland', artist_name: 'Pierre Bachelet' };
    const clip = { ...raw, track_title_normalized: 'Toujours debout', artist_name_normalized: 'Renaud' };
    const plain = { track_title: 'toujours debout ', artist_name: 'RENAUD' };
    const conflict = { track_title: 'X', artist_name: 'Y', artist_name_confidence: 'conflict' };
    // the clip and the plain listen are the same track once cleaned: 2 against 1
    expect(onRepeatOf([goeland, clip, plain])).toEqual({ title: 'Toujours debout', artist: 'Renaud' });
    expect(onRepeatOf([conflict, conflict, conflict, goeland])).toEqual({ title: 'Coeur de goéland', artist: 'Pierre Bachelet' });
    expect(onRepeatOf([])).toBeNull();
  });
});

describe('link preview (decision 46)', () => {
  const KEY = 'ab'.repeat(32);

  it('carries the key only when it is a well-formed key', () => {
    expect(previewImageUrl('bertrand', KEY)).toBe(`/card/bertrand/preview?k=${KEY}`);
    expect(previewImageUrl('bertrand', undefined)).toBe('/card/bertrand/preview');
    expect(previewImageUrl('bertrand', 'x"><script>')).toBe('/card/bertrand/preview');
    expect(previewImageUrl('a b', undefined)).toBe('/card/a%20b/preview');
  });

  it('the page points both previews at the route, the old file-based image is gone', () => {
    const page = read('src/app/card/[username]/page.tsx');
    expect(page).toContain('previewImageUrl(username, key)');
    expect(page).toContain('openGraph: { ...(base.openGraph ?? {}), images: [image] }');
    expect(page).toContain('twitter: { ...(base.twitter ?? {}), images: [image.url] }');
    expect(existsSync(join(root, 'src/app/card/[username]/opengraph-image.tsx'))).toBe(false);
  });

  it('the route checks the key through getSharedCard, falls back to the minimal preview, never caches a keyed image', () => {
    const route = read('src/app/card/[username]/preview/route.tsx');
    expect(route).toContain('if (isShareKey(key))');
    expect(route).toContain('await getSharedCard(username, key)');
    expect(route).toContain('<MinimalPreview profile={profile} />');
    expect(route).toContain("'Cache-Control': 'private, no-store'");
    expect(route.indexOf('getSharedCard(')).toBeLessThan(route.indexOf('<SillonPreview'));
    expect(route).not.toContain('createServiceClient');
  });

  it('previews follow the Satori rules (no box-shadow, blur or text-shadow) and render only what they are given', () => {
    for (const f of ['src/components/profile/SillonPreview.tsx', 'src/components/profile/MinimalPreview.tsx']) {
      const src = read(f);
      for (const word of ['boxShadow', 'filter', 'textShadow', 'createServiceClient', "from('"]) expect(src).not.toContain(word);
    }
  });

  it('ships the Bebas Neue TTF converted from the site font', () => {
    const ttf = readFileSync(join(root, 'src/fonts/bebas-neue-400.ttf'));
    expect(createHash('sha256').update(ttf).digest('hex')).toBe('834ae21611dcad8bbb74707eee4b09177f63d943ef0bf5ffd4eadbcfb4952a03');
  });
});

describe('the card (decision 44 = A)', () => {
  it('mirrors the app card: record, caption, pills, A-side in bars', () => {
    const card = read('src/components/profile/SharedFullCard.tsx');
    expect(card).toContain('<SillonDisc fingerprint={card.fingerprint}');
    expect(card).toContain('{fingerprintCaption(card.fingerprint.listens)}');
    expect(card).toContain('label="LAST PLAYED" track={card.lastPlayed} showArtist');
    expect(card).toContain('label="ON REPEAT" track={card.onRepeat} showArtist={false}');
    expect(card).toContain('{CONSTELLATION_LABEL}');
    expect(card).toContain('{trackNumber(i)}');
    expect(card).toContain('For real.');
    expect(card).not.toContain('CelestialBody');
    // globals.css zooms the site by 1.25: the card cancels it to keep the app's proportions
    expect(read('src/app/globals.css')).toContain('zoom: 1.25;');
    expect(card).toContain('export const CARD_ZOOM = 0.8;');
    expect(card).toContain("<main style={{ zoom: CARD_ZOOM, minHeight: '125vh'");
    expect(existsSync(join(root, 'src/components/profile/CelestialBody.tsx'))).toBe(false);
  });

  it('the disc turns once every 40 s and stops for reduced motion, a hidden tab or off screen', () => {
    const disc = read('src/components/profile/SillonDisc.tsx');
    expect(read('src/lib/listeningFingerprint.ts')).toContain('export const SILLON_TURN_S = 40;');
    expect(disc).toContain('@media (prefers-reduced-motion: reduce) { .zik4u-sillon { animation: none; } }');
    expect(disc).toContain("document.visibilityState === 'visible'");
    expect(disc).toContain('new IntersectionObserver');
    expect(disc).toContain("animationPlayState: running ? 'running' : 'paused'");
    expect(disc).toContain('{fingerprintBubbleText(fingerprint.listens)}');
  });

  it('platforms open under the line (pill and A-side row), search by name only', () => {
    const btn = read('src/components/profile/ListenButton.tsx');
    expect(btn).toContain("variant: 'pill' | 'row'");
    expect(btn).toContain('https://open.spotify.com/search/');
    expect(btn).toContain('https://music.apple.com/search?term=');
    expect(btn).toContain('https://music.youtube.com/search?q=');
  });
});
