import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find a Creator — See What They Really Listen To',
  description: 'Your favorite creator is on Zik4U. Subscribe to their musical world and discover what they actually listen to, in real time.',
  openGraph: {
    title: 'Find a Creator | Zik4U',
    description: 'See what your favorite artist really listens to. Subscribe on Zik4U.',
    url: 'https://zik4u.com/fans',
  },
  twitter: {
    title: 'Find a Creator | Zik4U',
    description: 'Your favorite creator is on Zik4U.',
  },
  alternates: { canonical: 'https://zik4u.com/fans' },
};

export default function FansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
