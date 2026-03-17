import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Zik4U: Your Music. Your Identity.',
    template: '%s | Zik4U',
  },
  description: 'The social network built on real listens. Discover, connect, and monetize what you actually hear. For real.',
  keywords: ['music social network', 'music creators', 'music identity', 'passive revenue music', 'spotify social', 'music subscription'],
  authors: [{ name: 'Zik4U' }],
  creator: 'Zik4U',
  openGraph: {
    type: 'website',
    siteName: 'Zik4U',
    title: 'Zik4U: Your Music. Your Identity.',
    description: 'Discover creators who listen like you. Turn your music taste into passive revenue.',
    url: BASE_URL,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Zik4U: Your Music. Your Identity.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zik4U: Your Music. Your Identity.',
    description: 'Discover creators who listen like you.',
    images: ['/opengraph-image'],
    creator: '@zik4u',
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
};

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
): Metadata {
  return {
    title,
    description,
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
