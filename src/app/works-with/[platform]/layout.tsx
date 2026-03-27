import type { Metadata } from 'next';
import { generatePlatformMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ platform: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  return generatePlatformMetadata(platform);
}

export default function WorksWithLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
