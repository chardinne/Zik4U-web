import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Listeners — Discover Who Listens Like You',
  description: 'Find people with the same music taste. Share your Now Card. Free, forever.',
  openGraph: {
    title: 'For Listeners | Zik4U',
    description: 'Music compatibility score, real listening feed, shareable Now Card. Free.',
    url: 'https://zik4u.com/listeners',
  },
  twitter: {
    title: 'For Listeners | Zik4U',
    description: 'Find your sound twin. Free, forever.',
  },
  alternates: { canonical: 'https://zik4u.com/listeners' },
};

export default function ListenersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
