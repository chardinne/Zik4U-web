import { readFileSync } from 'fs';
import { join } from 'path';
import { PATH_TEXTS, pathMetadata } from '@/lib/pathTexts';

// SITE1-3 — Decisions 182 = A and 184 = A (27/10/2026): short Listeners / Creators / Fans pages,
// texts of planche-site1-3.png word for word, only what exists in the app.

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const all = JSON.stringify(PATH_TEXTS);

describe('SITE1-3 — validated texts (Decision 184 = A)', () => {
  it('keeps the titles and subtitles word for word', () => {
    expect([PATH_TEXTS.listeners.titleTop, PATH_TEXTS.listeners.titleBottom]).toEqual(['Your galaxy.', 'Drawn from what you play.']);
    expect(PATH_TEXTS.listeners.sub).toBe('Zik4U notices the music you play in the apps you already use. Nothing to curate, nothing to fill in.');
    expect([PATH_TEXTS.creators.titleTop, PATH_TEXTS.creators.titleBottom]).toEqual(['Let fans in.', 'Get paid for it.']);
    expect(PATH_TEXTS.creators.sub).toBe('Fans subscribe to see what you actually listen to. Not a playlist you built for them. What you really play.');
    expect([PATH_TEXTS.fans.titleTop, PATH_TEXTS.fans.titleBottom]).toEqual(['Their real music.', 'Not their playlist.']);
    expect(PATH_TEXTS.fans.sub).toBe('Subscribe to an artist and see what they actually play, in the morning, at night, when no one is watching.');
  });
  it('keeps the items of each page', () => {
    expect(PATH_TEXTS.listeners.items.map((i) => i.title)).toEqual(['Your galaxy', 'Your archetype', 'Weekly insights', 'Music compatibility', 'Music Match']);
    expect(PATH_TEXTS.creators.items.map((i) => i.title)).toEqual(['Exclusive Drops', 'Creator analytics', 'Wrapped Creator']);
    expect(PATH_TEXTS.fans.items.map((i) => i.title)).toEqual(['Their real listens', 'Exclusive Drops', 'Compatibility score', 'Fan Card']);
    expect(PATH_TEXTS.listeners.items[4].body).toBe('Meet people who listen like you. Only if you opt in.');
    expect(PATH_TEXTS.fans.note).toBe('Artists join Zik4U at launch. Their profiles show up here when they do.');
  });
  it('states the creator share exactly as the Terms do', () => {
    expect(PATH_TEXTS.creators.money).toEqual({ big: '80%', body: 'of the net amount Zik4U receives after the store commission. Every month a fan stays subscribed.' });
    expect(PATH_TEXTS.creators.steps.map((s) => `${s.lead} ${s.rest}`.trim())).toEqual([
      'Listen as usual. Zik4U captures what you play in your own music apps.',
      'Set your tiers in the Creator Studio.',
      'Fans subscribe in the app, through the App Store or Google Play.',
      'You get paid.',
    ]);
  });
  it('promises nothing the app does not have (27/10/2026 audit)', () => {
    expect(all).not.toMatch(/Letter|Evolving|Portrait|synchronicit|Pulse|Trolley|\$25|real time|real-time|streaming service|Connect your|17\+|Moving|rank|Download/i);
    expect(all).not.toMatch(/Spotify|Apple Music|Deezer|SoundCloud|Tidal|YouTube/);
    expect(all).not.toContain('—');
  });
  it('uses the page texts as metadata, nothing more', () => {
    const m = pathMetadata('fans');
    expect(m.title).toEqual({ absolute: 'For Fans | Zik4U' });
    expect(m.description).toBe(PATH_TEXTS.fans.sub);
    expect(m.alternates.canonical).toBe('https://zik4u.com/fans');
  });
});

describe('SITE1-3 — pages', () => {
  it('each page renders the shared path page, with its own layout metadata', () => {
    for (const k of ['listeners', 'creators', 'fans']) {
      expect(read(`src/app/${k}/page.tsx`)).toContain(`<PathPage page="${k}" />`);
      expect(read(`src/app/${k}/page.tsx`)).not.toContain("'use client'");
      expect(read(`src/app/${k}/layout.tsx`)).toContain(`pathMetadata('${k}')`);
    }
  });
  it('one waitlist form, profile picked by the page, no store link, no demo profile', () => {
    const s = read('src/components/paths/PathPage.tsx');
    expect((s.match(/<WaitlistForm /g) ?? []).length).toBe(1);
    expect(s).toContain('<WaitlistForm defaultRole={t.role} />');
    expect([PATH_TEXTS.listeners.role, PATH_TEXTS.creators.role, PATH_TEXTS.fans.role]).toEqual(['listener', 'creator', 'fan']);
    expect(s).not.toMatch(/apps\.apple\.com|play\.google\.com|@alexsound|@mariajazz|DEMO_CREATORS|searchCreators/);
  });
});
