/// <reference types="node" />
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// KEYS1 K1c (Decisions 259 and 261 = A, 05/11/2026): the site reads ONLY the new Supabase secret
// key, through src/lib/supabaseKeys.ts, with no fallback to the legacy JWT keys.

const root = join(__dirname, '..', '..');
const srcFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === '__tests__' ? [] : srcFiles(p);
    return /\.(ts|tsx|js|mjs)$/.test(n) ? [p] : [];
  });

const ENV_BACKUP = process.env.SUPABASE_SECRET_KEY;
afterEach(() => {
  if (ENV_BACKUP === undefined) delete process.env.SUPABASE_SECRET_KEY;
  else process.env.SUPABASE_SECRET_KEY = ENV_BACKUP;
  jest.resetModules();
});

const load = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/lib/supabaseKeys') as typeof import('@/lib/supabaseKeys');
};

describe('KEYS1 K1c — site key', () => {
  it('no source file reads a legacy key variable', () => {
    const offenders = [...srcFiles(join(root, 'src')), join(root, 'next.config.ts')]
      .filter((f) => /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY/.test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(root.length + 1));
    expect(offenders).toEqual([]);
  });

  it('only src/lib/supabaseKeys.ts reads SUPABASE_SECRET_KEY', () => {
    const readers = srcFiles(join(root, 'src'))
      .filter((f) => /process\.env(\.SUPABASE_SECRET_KEY|\[['"]SUPABASE_SECRET_KEY)/.test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(root.length + 1));
    expect(readers).toEqual(['src/lib/supabaseKeys.ts']);
  });

  it('accepts a new secret key', () => {
    process.env.SUPABASE_SECRET_KEY = 'sb_secret_abc';
    expect(load().serverSecretKey()).toBe('sb_secret_abc');
  });

  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['legacy JWT', 'eyJhbGciOiJIUzI1NiJ9.x.y'],
    ['publishable key', 'sb_publishable_abc'],
  ])('fails closed on a %s value', (_label, value) => {
    if (value === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = value;
    expect(load().serverSecretKey()).toBe('');
  });

  it('the service client refuses to start without the new key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.x.y';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createServiceClient } = require('@/lib/supabase-server') as typeof import('@/lib/supabase-server');
    expect(() => createServiceClient()).toThrow('Supabase service env vars missing');
  });

  it('the waitlist refuses (500, no RPC) without the new key', async () => {
    jest.doMock('@/lib/supabase-server', () => ({ createServiceClient: () => { throw new Error('must not be called'); } }));
    process.env.SUPABASE_SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.x.y';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { POST } = require('@/app/api/waitlist/route') as typeof import('@/app/api/waitlist/route');
    const res = await POST({
      json: async () => ({ email: 'a@b.co', role: 'listener', website: '' }),
      headers: { get: () => null },
    } as never);
    expect(res.status).toBe(500);
  });
});
