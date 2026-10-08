/// <reference types="node" />
// SEC-COCKPIT c2 (Zik4U migration 00198, decisions of 08/10) — the public site reads
// with the service key, so it hides a suspended account itself: no profile page,
// no shared card even with the live key, never in the sitemap.

type Result = { data: unknown; error: unknown };
const KEY = 'ab'.repeat(32);

let users: Result;
let listRows: Result;
let reads: string[];
let eqs: Array<[string, string, unknown]>;

function builder(table: string) {
  const filters: Record<string, unknown> = {};
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'order', 'limit', 'neq', 'gte', 'is', 'or', 'not', 'in']) b[m] = () => b;
  b.eq = (col: string, val: unknown) => { filters[col] = val; eqs.push([table, col, val]); return b; };
  const answer = (): Result => {
    reads.push(table);
    if (table === 'users') return users;
    if (table === 'share_keys') return { data: filters.key === KEY ? { user_id: 'u1' } : null, error: null };
    if (table === 'profiles') return { data: [], error: null };
    return { data: null, error: null };
  };
  b.maybeSingle = () => Promise.resolve(answer());
  b.then = (res: (r: Result) => unknown, rej: (e: unknown) => unknown) =>
    Promise.resolve(table === 'users' ? listRows : answer()).then(res, rej);
  return b;
}

jest.mock('@/lib/supabase-server', () => ({
  createServiceClient: jest.fn(() => ({ from: (t: string) => builder(t), rpc: () => Promise.resolve({ data: null, error: null }) })),
}));

import { getPublicProfile, listSitemapProfiles } from '@/lib/publicProfile';
import { getSharedCard } from '@/lib/sharedCard';

const alice = {
  id: 'u1', username: 'alice', display_name: 'Alice', avatar_url: null, bio: null,
  is_private: false, is_creator: false, deleted_at: null, is_banned: false,
};

beforeEach(() => {
  users = { data: alice, error: null };
  listRows = { data: [], error: null };
  reads = [];
  eqs = [];
});

describe('a suspended account is not shown by the public site', () => {
  it('profile page: shown when active, not found when suspended', async () => {
    expect(await getPublicProfile('alice')).not.toBeNull();
    users = { data: { ...alice, is_banned: true }, error: null };
    expect(await getPublicProfile('alice')).toBeNull();
  });

  it('shared card: no card for a suspended account, even with its live key', async () => {
    users = { data: { ...alice, is_banned: true }, error: null };
    expect(await getSharedCard('alice', KEY)).toBeNull();
    expect(reads).not.toContain('share_keys');
  });

  it('sitemap: asks the base for non-suspended accounts and drops any suspended row', async () => {
    listRows = { data: [
      { id: 'u1', username: 'alice', is_private: false, deleted_at: null, is_banned: false, updated_at: null },
      { id: 'u2', username: 'bob', is_private: false, deleted_at: null, is_banned: true, updated_at: null },
    ], error: null };
    const rows = await listSitemapProfiles();
    expect(rows.map((r) => r.username)).toEqual(['alice']);
    expect(eqs).toContainEqual(['users', 'is_banned', false]);
  });
});
