/**
 * PHOTO1d (Zik4U session 72, Decisions 216 and 221 = A) — the profile photo on the site.
 * The photo lives in the PRIVATE bucket "avatars" (Zik4U 00238); users.avatar_url holds its
 * path. The site signs a temporary link with the service key; anything else shows no photo.
 * Texts of the Privacy Policy §3 validated word for word (project doc claude/PHOTO1-TEXTES.md §2).
 */
import * as fs from 'fs';
import * as path from 'path';
import { AVATAR_LINK_SECONDS, isStoredAvatarPath, signedAvatarUrl } from '@/lib/avatarLink';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const flat = (s: string) => s.replace(/\s+/g, ' ');
const PATH = 'bfda6f6f-3d5e-48b3-af59-e5ce37199da3/0f8fad5b-d9cb-469f-a165-70867728950e.jpg';

function client(result: { data: { signedUrl: string } | null; error: unknown }) {
  const calls: unknown[][] = [];
  const sc = {
    storage: {
      from: (bucket: string) => ({
        createSignedUrl: (p: string, s: number) => { calls.push([bucket, p, s]); return Promise.resolve(result); },
      }),
    },
  };
  return { sc: sc as never, calls };
}

describe('PHOTO1d — signed links', () => {
  it('a stored path gets a 7-day link from the private bucket', async () => {
    const { sc, calls } = client({ data: { signedUrl: 'https://x.supabase.co/storage/v1/object/sign/avatars/p?token=t' }, error: null });
    await expect(signedAvatarUrl(sc, PATH)).resolves.toBe('https://x.supabase.co/storage/v1/object/sign/avatars/p?token=t');
    expect(calls).toEqual([['avatars', PATH, 604800]]);
    expect(AVATAR_LINK_SECONDS).toBe(604800);
  });

  it('no photo for null, an old web address or anything else; no link on an error', async () => {
    const { sc, calls } = client({ data: null, error: { message: 'Object not found' } });
    await expect(signedAvatarUrl(sc, null)).resolves.toBeNull();
    await expect(signedAvatarUrl(sc, 'https://lh3.googleusercontent.com/a/x')).resolves.toBeNull();
    await expect(signedAvatarUrl(sc, '../other/x.jpg')).resolves.toBeNull();
    expect(calls).toEqual([]);
    await expect(signedAvatarUrl(sc, PATH)).resolves.toBeNull();
    expect(isStoredAvatarPath(PATH)).toBe(true);
  });

  it('both readers of the site sign the photo', () => {
    expect(read('lib/publicProfile.ts')).toContain('avatarUrl: await signedAvatarUrl(sc, user.avatar_url),');
    expect(read('lib/sharedCard.ts')).toContain('avatarUrl: await signedAvatarUrl(sc, user.avatar_url),');
  });
});

describe('PHOTO1d — Privacy Policy §3 (Decision 221 = A)', () => {
  it('EN, word for word', () => {
    expect(flat(read('app/legal/privacy/page.tsx'))).toContain(
      '<Strong>Profile photo.</Strong> If you choose one, we keep only a square copy, without the information your phone attaches to pictures (such as where it was taken). It is stored privately and shown through temporary links. When you change or remove it, the previous photo is deleted. We may remove a photo that breaks our Terms; we then tell you why by email.',
    );
  });

  it('FR, word for word', () => {
    expect(flat(read('app/fr/legal/privacy/page.tsx'))).toContain(
      "<Strong>Photo de profil.</Strong> Si vous en choisissez une, nous n&apos;en gardons qu&apos;une copie carrée, sans les informations que votre téléphone joint aux images (comme le lieu de la prise de vue). Elle est stockée de façon privée et affichée par des liens temporaires. Quand vous la changez ou la retirez, l&apos;ancienne est supprimée. Nous pouvons retirer une photo contraire à nos CGU ; nous vous en donnons alors la raison par e-mail.",
    );
  });
});
