import type { Metadata, Viewport } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Zik4U — You Are What You Listen To.',
    template: '%s | Zik4U',
  },
  description: 'Zik4U captures everything you listen to, across all platforms, and turns it into your real music identity. Connect. Match. Subscribe. For real.',
  keywords: [
    'music social network',
    'music identity',
    'listening history',
    'music creators',
    'passive revenue music',
    'spotify social',
    'apple music social',
    'music subscription',
    'scrobbling',
    'music compatibility',
    'real listening data',
    'music analytics',
  ],
  authors: [{ name: 'Zik4U' }],
  creator: 'Zik4U',
  publisher: 'Zik4U',
  openGraph: {
    type: 'website',
    siteName: 'Zik4U',
    title: 'Zik4U — You Are What You Listen To.',
    description: 'The social network built on real listens. Discover, connect, and monetize what you actually hear.',
    url: BASE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zik4U — You Are What You Listen To.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zik4U — You Are What You Listen To.',
    description: 'The social network built on real listens. Discover people who listen like you.',
    images: ['/og-image.png'],
    creator: '@zik4u',
    site: '@zik4u',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  // SITE1-5 (Decision 183 = A): no app links until the store listings exist.
};

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  keywords?: string[],
): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title: `${title} | Zik4U`,
      description,
      url: `${BASE_URL}${path}`,
    },
    twitter: {
      title: `${title} | Zik4U`,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}${path}`,
    },
  };
}

export function generateCreatorMetadata(
  creatorName: string,
  username: string,
  bio: string | null,
  topArtists: string[],
): Metadata {
  const title = `${creatorName} on Zik4U`;
  const artistsStr = topArtists.length > 0
    ? `Listens to ${topArtists.slice(0, 3).join(', ')}.`
    : '';
  const description = bio
    ? `${bio.slice(0, 120)} ${artistsStr}`.trim()
    : `Subscribe to ${creatorName}'s musical world on Zik4U. ${artistsStr}`.trim();

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Zik4U`,
      description,
      url: `https://zik4u.com/creator/${username}`,
      type: 'profile',
    },
    twitter: {
      title: `${title} | Zik4U`,
      description,
    },
    alternates: {
      canonical: `https://zik4u.com/creator/${username}`,
    },
  };
}

export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A1A',
};

