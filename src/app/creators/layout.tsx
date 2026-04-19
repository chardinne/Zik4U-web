import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Creators | Zik4U',
  description: 'Monetize your real music taste. Your fans subscribe to what you actually listen to. 80% revenue. No algorithm. For real.',
  openGraph: {
    title: 'For Creators | Zik4U',
    description: 'Monetize your real music taste. 80% revenue. No algorithm. For real.',
    url: 'https://zik4u.com/creators',
  },
  twitter: {
    title: 'For Creators | Zik4U',
    description: 'Monetize your real music taste. 80% revenue. No algorithm. For real.',
  },
  alternates: { canonical: 'https://zik4u.com/creators' },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
