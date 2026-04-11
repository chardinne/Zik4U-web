import type { Metadata, Viewport } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Zik4U — You Are What You Listen To.',
    template: '%s | Zik4U',
  },
  description: 'The social network built on real listens. Discover people who listen like you, turn your music taste into identity, and monetize what you actually hear.',
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
  publisher: 'Zik4U Inc.',
  openGraph: {
    type: 'website',
    siteName: 'Zik4U',
    title: 'Zik4U — You Are What You Listen To.',
    description: 'The social network built on real listens. Discover, connect, and monetize what you actually hear.',
    url: BASE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
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
    images: ['/opengraph-image'],
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
  other: {
    'al:ios:url': 'zik4u://',
    'al:ios:app_store_id': '6748722257',
    'al:ios:app_name': 'Zik4U',
    'al:android:url': 'zik4u://',
    'al:android:package': 'com.zik4u.app',
    'al:android:app_name': 'Zik4U',
    'al:web:url': 'https://zik4u.com',
    'al:web:should_fallback': 'true',
  },
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

const PLATFORM_META: Record<string, { name: string; description: string; keywords: string[] }> = {
  spotify: {
    name: 'Spotify',
    description: 'How Zik4U works with Spotify — metadata-only capture, full stream credit to Spotify, zero audio access. Your streams stay yours, we just make them social.',
    keywords: ['spotify social', 'spotify listening history', 'spotify identity', 'spotify music social network', 'spotify data privacy'],
  },
  'apple-music': {
    name: 'Apple Music',
    description: 'How Zik4U works with Apple Music — MusicKit metadata capture, your library stays private, your listening identity becomes social. No audio, no account data.',
    keywords: ['apple music social', 'apple music listening history', 'musickit privacy', 'apple music identity', 'apple music scrobble'],
  },
  'youtube-music': {
    name: 'YouTube Music',
    description: 'How Zik4U works with YouTube Music — automatic detection via system notifications, no OAuth required, full stream credit stays with YouTube Music.',
    keywords: ['youtube music social', 'youtube music scrobble', 'youtube music listening history', 'youtube music identity', 'youtube music privacy'],
  },
  soundcloud: {
    name: 'SoundCloud',
    description: 'How Zik4U works with SoundCloud — OAuth PKCE capture of listening metadata, no audio stored, your SoundCloud discoveries become part of your unified music identity.',
    keywords: ['soundcloud social', 'soundcloud listening history', 'soundcloud scrobble', 'soundcloud identity', 'soundcloud music network'],
  },
  deezer: {
    name: 'Deezer',
    description: 'Connect Deezer to Zik4U and turn your Flow listening into a real social identity. Compatibility scores, archetypes, and live listening rooms — powered by your actual Deezer plays.',
    keywords: ['deezer social', 'deezer scrobble', 'deezer listening history', 'deezer identity', 'deezer music social network', 'deezer zik4u'],
  },
  tidal: {
    name: 'Tidal',
    description: 'Tidal HiFi listeners have the deepest musical identities. Zik4U makes that identity visible — behavioral archetypes, compatibility scores, and social connections built from your real Tidal listening.',
    keywords: ['tidal social', 'tidal scrobble', 'tidal hifi identity', 'tidal music network', 'tidal listening history', 'tidal zik4u'],
  },
  lastfm: {
    name: 'Last.fm',
    description: 'Last.fm users already understand scrobbling. Zik4U is what comes next — the social layer, the creator economy, and the live listening rooms that Last.fm never built.',
    keywords: ['lastfm zik4u', 'last.fm alternative', 'scrobbling social network', 'lastfm social', 'lastfm identity', 'scrobble app 2025'],
  },
  'amazon-music': {
    name: 'Amazon Music',
    description: 'Connect Amazon Music to Zik4U and give your listening an identity. Passive detection on Android — no login required. Compatibility scores and real social connections from your actual plays.',
    keywords: ['amazon music social', 'amazon music scrobble', 'amazon music identity', 'amazon music listening history', 'amazon music zik4u'],
  },
  boomplay: {
    name: 'Boomplay',
    description: 'Zik4U is the first music social platform that includes Boomplay\'s 100 million users in the global music identity graph. Connect Boomplay, discover who listens like you — worldwide.',
    keywords: ['boomplay social', 'boomplay scrobble', 'boomplay identity', 'african music social network', 'boomplay zik4u', 'afrobeats social'],
  },
};

// Separate viewport export — required by Next.js 14+ (cannot be in metadata)
export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A1A',
};

export function generatePlatformMetadata(platform: string): Metadata {
  const meta = PLATFORM_META[platform];
  if (!meta) return {};

  const title = `${meta.name} + Zik4U — How It Works`;
  const path = `/works-with/${platform}`;

  return {
    title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: `${title} | Zik4U`,
      description: meta.description,
      url: `${BASE_URL}${path}`,
    },
    twitter: {
      title: `${title} | Zik4U`,
      description: meta.description,
    },
    alternates: {
      canonical: `${BASE_URL}${path}`,
    },
  };
}
