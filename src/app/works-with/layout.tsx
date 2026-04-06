import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Works with 14+ music sources — Zik4U',
  description: 'Zik4U connects with Spotify, Apple Music, YouTube Music, Deezer, Tidal, SoundCloud, Last.fm, Amazon Music, Boomplay and more. One unified identity across every platform.',
  keywords: ['music social network', 'spotify alternative', 'scrobbling app', 'music identity', 'deezer social', 'boomplay social', 'last.fm alternative', 'tidal social'],
  openGraph: {
    title: 'Works with 14+ music sources — Zik4U',
    description: 'The only music social platform that works across every ecosystem. Spotify, Deezer, Boomplay, Tidal, Last.fm and more.',
    url: 'https://zik4u.com/works-with',
  },
  alternates: { canonical: 'https://zik4u.com/works-with' },
};

export default function WorksWithRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
