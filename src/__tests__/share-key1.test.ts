/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// SHARE-KEY1 / WEB-PRIV1 part 2 — the full card is served ONLY for the owner's live key.

type Result = { data: unknown; error: unknown };
const KEY = 'ab'.repeat(32);
const OTHER = 'cd'.repeat(32);

let users: Result;
let keyRows: Array<{ user_id: string; key: string }>;
let reads: string[];

function builder(table: string) {
  const filters: Record<string, unknown> = {};
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'order', 'limit', 'neq', 'gte']) b[m] = () => b;
  b.eq = (col: string, val: unknown) => { filters[col] = val; return b; };
  const answer = (): Result => {
    reads.push(table);
    if (table === 'users') return users;
    if (table === 'share_keys') {
      const row = keyRows.find((r) => r.user_id === filters.user_id && r.key === filters.key);
      return { data: row ? { user_id: row.user_id } : null, error: null };
    }
    if (table === 'listener_archetypes') {
      return { data: { archetype: 'night_explorer', confidence: 0.8, total_scrobbles_snapshot: 120, archetype_secondary: null, archetype_secondary_confidence: null, archetype_previous: null, archetype_shifted_at: null }, error: null };
    }
    if (table === 'scrobbles') {
      return { data: [
        { track_title: 'Song A', artist_name: 'Artist 1', played_at: '2026-09-24T10:00:00Z' },
        { track_title: 'Song A', artist_name: 'Artist 1', played_at: '2026-09-24T09:00:00Z' },
        { track_title: 'Song B', artist_name: 'Artist 2', played_at: '2026-09-24T08:00:00Z' },
      ], error: null };
    }
    return { data: null, error: null };
  };
  b.maybeSingle = () => Promise.resolve(answer());
  b.then = (res: (r: Result) => unknown, rej: (e: unknown) => unknown) => Promise.resolve(answer()).then(res, rej);
  return b;
}

jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(() => ({
    from: (t: string) => builder(t),
    rpc: (fn: string) => { reads.push(`rpc:${fn}`); return Promise.resolve({ data: fn === 'get_archetype_distribution' ? [{ archetype: 'night_explorer', percentage: 2 }] : null, error: null }); },
  })),
}));

import { getSharedCard, isShareKey } from '@/lib/sharedCard';

const alice = { id: 'u1', username: 'alice', display_name: 'Alice', avatar_url: null, bio: null, deleted_at: null };

beforeEach(() => {
  users = { data: alice, error: null };
  keyRows = [{ user_id: 'u1', key: KEY }, { user_id: 'u2', key: OTHER }];
  reads = [];
});

describe('getSharedCard', () => {
  it('accepts only 64-hex keys', () => {
    expect(isShareKey(KEY)).toBe(true);
    for (const bad of [undefined, '', 'abc', KEY.toUpperCase(), `${KEY}0`, 42]) expect(isShareKey(bad)).toBe(false);
  });

  it('a malformed key reads nothing at all', async () => {
    expect(await getSharedCard('alice', 'nope')).toBeNull();
    expect(reads).toEqual([]);
  });

  it('a wrong or revoked key never reaches the listening data', async () => {
    expect(await getSharedCard('alice', 'ef'.repeat(32))).toBeNull();
    expect(reads).toEqual(['users', 'share_keys']);
    keyRows = [];
    expect(await getSharedCard('alice', KEY)).toBeNull();
    expect(reads).not.toContain('scrobbles');
  });

  it("another account's key does not open this card", async () => {
    expect(await getSharedCard('alice', OTHER)).toBeNull();
    expect(reads).not.toContain('scrobbles');
  });

  it('a deleted account shows nothing', async () => {
    users = { data: { ...alice, deleted_at: '2026-09-01T00:00:00Z' }, error: null };
    expect(await getSharedCard('alice', KEY)).toBeNull();
    expect(reads).toEqual(['users']);
  });

  it("the owner's live key opens the full card (private accounts included)", async () => {
    const card = await getSharedCard('%40alice', KEY);
    expect(card).not.toBeNull();
    expect(card?.lastPlayed).toEqual({ title: 'Song A', artist: 'Artist 1' });
    expect(card?.onRepeat).toEqual({ title: 'Song A', artist: 'Artist 1' });
    expect(card?.topArtists).toEqual([{ artist_name: 'Artist 1', play_count: 2 }, { artist_name: 'Artist 2', play_count: 1 }]);
    expect(card?.archetype).toBe('night_explorer');
    expect(card?.rarity).toBe('legendary');
    expect(card?.isForming).toBe(false);
    expect(reads.indexOf('share_keys')).toBeLessThan(reads.indexOf('scrobbles'));
  });
});

describe('source guards (part 2)', () => {
  const root = join(__dirname, '..', '..');
  const read = (f: string) => readFileSync(join(root, f), 'utf8').replace(/^\s*\/\/.*$/gm, '');

  it('the shared card loader checks the key before any listening read', () => {
    const src = read('src/lib/sharedCard.ts');
    const gate = src.indexOf("from('share_keys')");
    expect(gate).toBeGreaterThan(-1);
    for (const word of ["from('scrobbles')", "from('listener_archetypes')", "rpc('get_music_signature'", "rpc('get_archetype_distribution'"]) {
      expect(src.indexOf(word)).toBeGreaterThan(gate);
    }
    expect(src).not.toContain("from('posts')");
    expect(src).not.toContain('creator_tiers');
  });

  it('the full card component renders only what it is given', () => {
    const src = read('src/components/profile/SharedFullCard.tsx');
    expect(src).not.toContain('createServiceClient');
    expect(src).not.toContain('scrobbles');
  });

  it('the card page marks shared links noindex and keeps the key out of the Referer', () => {
    const src = read('src/app/card/[username]/page.tsx');
    expect(src).toContain('robots: { index: false, follow: false }');
    expect(src).toContain("referrer: 'no-referrer'");
    expect(src).toContain('getSharedCard(username, key)');
  });

  it('the privacy policy carries "Links you share" again', () => {
    const src = readFileSync(join(root, 'src/app/legal/privacy/page.tsx'), 'utf8');
    expect(src).toContain('Links you share.');
    expect(src).toContain("const LAST_UPDATED = 'September 24, 2026'");
  });
});
