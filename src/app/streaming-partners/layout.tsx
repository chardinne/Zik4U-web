import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Streaming Partners — How Zik4U Works With Music Platforms',
  description: 'Zik4U captures listening metadata only — track title, artist, timestamp. We never touch audio streams, never store platform IDs, and return every play to the source platform via deep link.',
  keywords: [
    'streaming partnership',
    'music platform compliance',
    'listening metadata',
    'music data privacy',
    'spotify api compliance',
    'apple music privacy',
    'last.fm model',
    'scrobbling legal',
    'music app data usage',
    'GDPR music data',
  ],
  openGraph: {
    title: 'Streaming Partners — How Zik4U Works With Music Platforms | Zik4U',
    description: 'Metadata only. Never audio. Every stream credit returned to the source platform. The Last.fm model, with stronger privacy guarantees.',
    url: 'https://zik4u.com/streaming-partners',
  },
  twitter: {
    title: 'Streaming Partners — How Zik4U Works With Music Platforms | Zik4U',
    description: 'Metadata only. Never audio. Every stream credit returned to the source platform.',
  },
  alternates: {
    canonical: 'https://zik4u.com/streaming-partners',
  },
};

export default function StreamingPartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
