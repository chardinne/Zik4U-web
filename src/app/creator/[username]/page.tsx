import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicProfile } from '@/lib/publicProfile';
import { MinimalProfileCard, profileMetadata } from '@/components/profile/MinimalProfileCard';

// WEB-PRIV1 — decision 1 = B: a creator page shows the minimal card (name, avatar, bio).
// Tiers and prices come back once store products exist (backlog rank 5).

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  return profileMetadata(profile?.isCreator ? profile : null);
}

export default async function CreatorPublicPage({ params }: Props) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile || !profile.isCreator) notFound();
  return <MinimalProfileCard profile={profile} />;
}
