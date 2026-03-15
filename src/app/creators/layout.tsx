import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
  'Monetize Your Music Taste',
  'Turn your listening habits into passive revenue. Set up your creator profile, choose your subscription tiers, and start earning from fans who love your music taste.',
  '/creators',
);

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
