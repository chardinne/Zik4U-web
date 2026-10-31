import type { createServiceClient } from '@/lib/supabase-server';

/**
 * PHOTO1d (Zik4U session 72, migration 00238) — a profile photo lives in the PRIVATE bucket
 * "avatars"; users.avatar_url holds its path "<user id>/<uuid>.jpg". The site signs a
 * temporary link with the service key (7 days, far longer than any page cache). Anything that
 * is not such a path (null, an old web address) shows no photo: the site never displays an
 * image the member did not upload to Zik4U (Decision 216 = A).
 */
export const AVATAR_LINK_SECONDS = 7 * 24 * 3600;
const PATH_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/;

export function isStoredAvatarPath(value: string | null | undefined): value is string {
  return typeof value === 'string' && PATH_RE.test(value);
}

export async function signedAvatarUrl(
  sc: ReturnType<typeof createServiceClient>,
  raw: string | null | undefined,
): Promise<string | null> {
  if (!isStoredAvatarPath(raw)) return null;
  try {
    const { data, error } = await sc.storage.from('avatars').createSignedUrl(raw, AVATAR_LINK_SECONDS);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
