import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicProfile } from '@/lib/publicProfile';
import { MinimalProfileCard, profileMetadata } from '@/components/profile/MinimalProfileCard';

// WEB-PRIV1 — minimal card for everyone (D3). The full shared card arrives with SHARE-KEY1.

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return profileMetadata(await getPublicProfile(username));
}

export default async function CardPage({ params }: Props) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) redirect('/');
  return <MinimalProfileCard profile={profile} />;
}
