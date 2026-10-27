import type { Metadata, Viewport } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export const SITE_TITLE = 'Zik4U · Your music, as it really is.';
export const SITE_DESCRIPTION = 'Zik4U draws your galaxy from the music you really play, in the apps you already use. Join the waitlist.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    // SITE1-4 (Decision 185 = A, 27/10/2026): title and description of the site.
    default: SITE_TITLE,
    template: '%s | Zik4U',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'music social network',
    'music identity',
    'listening history',
    'music creators',
    'music subscription',
    'scrobbling',
    'music compatibility',
    'real listening data',
  ],
  authors: [{ name: 'Zik4U' }],
  creator: 'Zik4U',
  publisher: 'Zik4U',
  openGraph: {
    type: 'website',
    siteName: 'Zik4U',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
    // Decision 186 (27/10/2026): the X handle zik4u is not Zik4U's account; no X handle declared.
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

export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A1A',
};

