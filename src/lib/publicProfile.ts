import { createServiceClient } from '@/lib/supabase-server';

// WEB-PRIV1 — single entry point for every public profile surface of the site
// (/card, its link-preview image, /creator, sitemap).
//
// These pages read with the SERVICE key, which bypasses RLS and the database rule
// public.listening_visible_to. The site therefore applies the product rules itself:
//   D3 — visitors without an account see display name, avatar and bio only, for ALL profiles.
//   D4 — private accounts are excluded from the sitemap and marked noindex.
// Never read scrobbles, archetypes, signature, activity or compatibility here.

export interface PublicProfile {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isCreator: boolean;
  /** users.is_private OR profiles.profile_visibility = 'private' (fail-closed: true when unknown). */
  isPrivate: boolean;
}

export interface SitemapProfile {
  username: string;
  updatedAt: string | null;
}

interface UserRow {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_private: boolean | null;
  is_creator: boolean | null;
  deleted_at: string | null;
  updated_at?: string | null;
}

export function normalizeHandle(raw: string): string {
  let handle = raw;
  try {
    handle = decodeURIComponent(raw);
  } catch {
    // keep raw value
  }
  return handle.replace(/^@/, '').trim();
}

export async function getPublicProfile(rawHandle: string): Promise<PublicProfile | null> {
  const handle = normalizeHandle(rawHandle);
  if (!handle) return null;

  const sc = createServiceClient();
  const { data, error } = await sc
    .from('users')
    .select('id, username, display_name, avatar_url, bio, is_private, is_creator, deleted_at')
    .eq('username', handle)
    .maybeSingle();

  const user = data as UserRow | null;
  if (error || !user || !user.username || user.deleted_at) return null;

  const { data: visRow, error: visError } = await sc
    .from('profiles')
    .select('profile_visibility')
    .eq('user_id', user.id)
    .maybeSingle();

  const visibility = (visRow as { profile_visibility: string | null } | null)?.profile_visibility ?? null;
  const isPrivate = user.is_private === true || visibility === 'private' || !!visError;

  return {
    username: user.username,
    displayName: user.display_name ?? user.username,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    isCreator: user.is_creator === true,
    isPrivate,
  };
}

/** Public, non-deleted accounts only (D4). Fail-closed: any read error returns []. */
export async function listSitemapProfiles(limit = 5000): Promise<SitemapProfile[]> {
  const sc = createServiceClient();

  const [{ data: users, error: usersError }, { data: privateRows, error: privError }] = await Promise.all([
    sc
      .from('users')
      .select('id, username, is_private, deleted_at, updated_at')
      .is('deleted_at', null)
      .or('is_private.is.null,is_private.eq.false')
      .not('username', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(limit),
    sc.from('profiles').select('user_id').eq('profile_visibility', 'private'),
  ]);

  if (usersError || privError) return [];

  const hidden = new Set(((privateRows as { user_id: string }[] | null) ?? []).map((r) => r.user_id));

  return ((users as UserRow[] | null) ?? [])
    .filter((u) => !!u.username && !u.deleted_at && u.is_private !== true && !hidden.has(u.id))
    .map((u) => ({ username: u.username as string, updatedAt: u.updated_at ?? null }));
}
