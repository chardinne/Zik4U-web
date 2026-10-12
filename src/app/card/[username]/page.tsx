import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicProfile } from '@/lib/publicProfile';
import { getSharedCard, previewImageUrl } from '@/lib/sharedCard';
import { MinimalProfileCard, profileMetadata } from '@/components/profile/MinimalProfileCard';
import { SharedFullCard } from '@/components/profile/SharedFullCard';

// WEB-PRIV1 — minimal card for everyone (D3).
// SHARE-KEY1 (part 2) — a link shared from the app carries ?k=<owner's live key>: with a
// valid, unrevoked key the full card is shown, never indexed, and the key is not leaked
// to other sites through the Referer header.
// DNA-SILLON decision 46 = A — the link preview is served by ./preview (route), which gets
// the key and checks it itself; without a valid key it draws the minimal preview.

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ k?: string | string[] }>;
}

function keyOf(sp: { k?: string | string[] }): string | undefined {
  return typeof sp.k === 'string' ? sp.k : undefined;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { username } = await params;
  const key = keyOf(await searchParams);
  const base = profileMetadata(await getPublicProfile(username));
  const image = { url: previewImageUrl(username, key), width: 1200, height: 630, alt: 'Zik4U profile' };
  const withImage: Metadata = {
    ...base,
    openGraph: { ...(base.openGraph ?? {}), images: [image] },
    twitter: { ...(base.twitter ?? {}), images: [image.url] },
  };
  if (key === undefined) return withImage;
  return { ...withImage, robots: { index: false, follow: false }, referrer: 'no-referrer' };
}

export default async function CardPage({ params, searchParams }: Props) {
  const { username } = await params;
  const key = keyOf(await searchParams);
  if (key !== undefined) {
    const shared = await getSharedCard(username, key);
    if (shared) return <SharedFullCard card={shared} />;
  }
  const profile = await getPublicProfile(username);
  if (!profile) redirect('/');
  return <MinimalProfileCard profile={profile} />;
}
