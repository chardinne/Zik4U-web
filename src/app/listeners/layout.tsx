import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Listeners | Zik4U',
  description: 'Build your real music identity across Spotify, Apple Music, YouTube Music and 10+ sources. Your archetype. Your matches. For real.',
  openGraph: {
    title: 'For Listeners | Zik4U',
    description: 'Build your real music identity across 10+ sources. Your archetype. Your matches. For real.',
    url: 'https://zik4u.com/listeners',
  },
  twitter: {
    title: 'For Listeners | Zik4U',
    description: 'Build your real music identity across Spotify, Apple Music, YouTube Music and 10+ sources. For real.',
  },
  alternates: { canonical: 'https://zik4u.com/listeners' },
};

export default function ListenersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
