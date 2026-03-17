import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Creators — Monetize Your Real Music Taste',
  description: 'Turn your real listening data into passive revenue. Keep 80%. Your fans subscribe to discover what you actually listen to.',
  openGraph: {
    title: 'For Creators | Zik4U',
    description: 'Keep 80% of every subscription. Your real music taste — monetized.',
    url: 'https://zik4u.com/creators',
  },
  twitter: {
    title: 'For Creators | Zik4U',
    description: 'Keep 80% of every subscription. Monetize your real music taste.',
  },
  alternates: { canonical: 'https://zik4u.com/creators' },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
