/// <reference types="node" />
import { readFileSync } from 'fs';
import { join } from 'path';

// WEB-PRIV1 — public profile surfaces must show name, avatar, bio only (D3),
// exclude private and deleted accounts from the sitemap (D4), and mark private accounts noindex.

type Result = { data: unknown; error: unknown };
type Responses = Record<string, { single?: Result; list?: Result }>;

let responses: Responses = {};

function builder(table: string) {
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'is', 'or', 'not', 'order', 'limit', 'in', 'neq', 'gte']) {
    b[m] = () => b;
  }
  b.maybeSingle = () => Promise.resolve(responses[table]?.single ?? { data: null, error: null });
  b.single = b.maybeSingle;
  b.then = (resolve: (r: Result) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve(responses[table]?.list ?? { data: [], error: null }).then(resolve, reject);
  return b;
}

jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(() => ({ from: (t: string) => builder(t), rpc: jest.fn() })),
}));

import { getPublicProfile, normalizeHandle, listSitemapProfiles } from '@/lib/publicProfile';
import { profileMetadata } from '@/components/profile/MinimalProfileCard';
import sitemap, { LIST_PROFILES } from '@/app/sitemap';
import nextConfig from '../../next.config';

const baseUser = {
  id: 'u1', username: 'alice', display_name: 'Alice', avatar_url: null, bio: 'hi',
  is_private: false, is_creator: false, deleted_at: null,
};

beforeEach(() => {
  responses = {};
});

describe('getPublicProfile', () => {
  it('returns only name, avatar, bio and flags for a public account', async () => {
    responses = { users: { single: { data: baseUser, error: null } }, profiles: { single: { data: { profile_visibility: 'public' }, error: null } } };
    const p = await getPublicProfile('@alice');
    expect(p).toEqual({ username: 'alice', displayName: 'Alice', avatarUrl: null, bio: 'hi', isCreator: false, isPrivate: false });
  });

  it('treats a deleted account as not found', async () => {
    responses = { users: { single: { data: { ...baseUser, deleted_at: '2026-09-01T00:00:00Z' }, error: null } } };
    expect(await getPublicProfile('alice')).toBeNull();
  });

  it('flags users.is_private and profile_visibility=private, and fails closed on read error', async () => {
    responses = { users: { single: { data: { ...baseUser, is_private: true }, error: null } } };
    expect((await getPublicProfile('alice'))?.isPrivate).toBe(true);
    responses = { users: { single: { data: baseUser, error: null } }, profiles: { single: { data: { profile_visibility: 'private' }, error: null } } };
    expect((await getPublicProfile('alice'))?.isPrivate).toBe(true);
    responses = { users: { single: { data: baseUser, error: null } }, profiles: { single: { data: null, error: { message: 'boom' } } } };
    expect((await getPublicProfile('alice'))?.isPrivate).toBe(true);
  });

  it('decodes an encoded @ handle', () => {
    expect(normalizeHandle('%40bob')).toBe('bob');
  });
});

describe('profileMetadata', () => {
  it('marks private accounts noindex, public accounts indexable', () => {
    const pub = { username: 'a', displayName: 'A', avatarUrl: null, bio: null, isCreator: false, isPrivate: false };
    expect(profileMetadata(pub).robots).toBeUndefined();
    expect(profileMetadata({ ...pub, isPrivate: true }).robots).toEqual({ index: false, follow: false });
  });
});

describe('sitemap (pre-launch, decision 3 = B)', () => {
  it('lists no profile at all before launch', async () => {
    responses = {
      users: { list: { data: [{ id: 'u1', username: 'pub', is_private: false, deleted_at: null, updated_at: null }], error: null } },
      profiles: { list: { data: [], error: null } },
    };
    const urls = (await sitemap()).map((e) => e.url);
    expect(LIST_PROFILES).toBe(false);
    expect(urls.some((u) => u.includes('/card/') || u.includes('/creator/'))).toBe(false);
    expect(urls.some((u) => u.endsWith('/legal/privacy'))).toBe(true);
  });
});

describe('listSitemapProfiles (used once LIST_PROFILES is on)', () => {
  it('returns public accounts only', async () => {
    responses = {
      users: { list: { data: [
        { id: 'u1', username: 'pub', is_private: false, deleted_at: null, updated_at: null },
        { id: 'u2', username: 'flagged', is_private: true, deleted_at: null, updated_at: null },
        { id: 'u3', username: 'hiddenvis', is_private: false, deleted_at: null, updated_at: null },
        { id: 'u4', username: 'gone', is_private: false, deleted_at: '2026-01-01T00:00:00Z', updated_at: null },
      ], error: null } },
      profiles: { list: { data: [{ user_id: 'u3' }], error: null } },
    };
    expect((await listSitemapProfiles()).map((p) => p.username)).toEqual(['pub']);
  });

  it('returns nothing when the privacy read fails', async () => {
    responses = {
      users: { list: { data: [{ id: 'u1', username: 'pub', is_private: false, deleted_at: null, updated_at: null }], error: null } },
      profiles: { list: { data: null, error: { message: 'boom' } } },
    };
    expect(await listSitemapProfiles()).toEqual([]);
  });
});

describe('source guards', () => {
  const root = join(__dirname, '..', '..');
  const files = [
    'src/app/card/[username]/page.tsx',
    'src/app/card/[username]/opengraph-image.tsx',
    'src/app/creator/[username]/page.tsx',
    'src/components/profile/MinimalProfileCard.tsx',
    'src/lib/publicProfile.ts',
  ];
  const forbidden = ['scrobbles', 'listener_archetypes', 'get_music_signature', 'get_archetype_distribution', 'get_user_top_artists', "from('posts')", 'creator_tiers', 'current_mood'];

  it.each(files)('%s reads no listening, archetype, post or tier data', (f) => {
    const src = readFileSync(join(root, f), 'utf8').replace(/^\s*\/\/.*$/gm, '');
    for (const word of forbidden) expect(src).not.toContain(word);
  });

  it('serves /@username with the card', async () => {
    const rw = await (nextConfig.rewrites as () => Promise<unknown>)();
    const list = Array.isArray(rw) ? rw : [];
    expect(list).toContainEqual({ source: '/@:username', destination: '/card/:username' });
  });

  it('privacy policy carries clause 5c', () => {
    const src = readFileSync(join(root, 'src/app/legal/privacy/page.tsx'), 'utf8');
    expect(src).toContain('5c. Public Profiles, Search Engines &amp; Shared Links');
  });
});
