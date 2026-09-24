import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicProfile } from '@/lib/publicProfile';
import { getSharedCard } from '@/lib/sharedCard';
import { MinimalProfileCard, profileMetadata } from '@/components/profile/MinimalProfileCard';
import { SharedFullCard } from '@/components/profile/SharedFullCard';

// WEB-PRIV1 — minimal card for everyone (D3).
// SHARE-KEY1 (part 2) — a link shared from the app carries ?k=<owner's live key>: with a
// valid, unrevoked key the full card is shown, never indexed, and the key is not leaked
// to other sites through the Referer header.

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
  if (key === undefined) return base;
  return { ...base, robots: { index: false, follow: false }, referrer: 'no-referrer' };
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
