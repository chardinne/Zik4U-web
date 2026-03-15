import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
  'Discover Music Creators',
  'Find creators who share your music taste. Subscribe from $4.99/month and access their exclusive musical world.',
  '/users',
);

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
