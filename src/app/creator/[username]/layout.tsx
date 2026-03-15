import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
  'Creator Profile',
  "Subscribe to this creator's musical world on Zik4U.",
  '/creator',
);

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
