import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { defaultMetadata } from '@/lib/seo';
import { CookieBanner } from '@/components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = defaultMetadata;

// Static JSON-LD — no user data interpolated, safe per Next.js official docs pattern
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://zik4u.com/#website',
      url: 'https://zik4u.com',
      name: 'Zik4U',
      description: 'The social network built on real listening data. You are what you listen to.',
      publisher: { '@id': 'https://zik4u.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://zik4u.com/users?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://zik4u.com/#organization',
      name: 'Zik4U',
      url: 'https://zik4u.com',
      logo: { '@type': 'ImageObject', url: 'https://zik4u.com/opengraph-image', width: 1200, height: 630 },
      sameAs: [
        'https://twitter.com/zik4u',
        'https://apps.apple.com/app/zik4u/id6748722257',
        'https://play.google.com/store/apps/details?id=com.zik4u.app',
      ],
      contactPoint: { '@type': 'ContactPoint', email: 'partner@zik4u.com', contactType: 'Partnership' },
    },
    {
      '@type': 'MobileApplication',
      '@id': 'https://zik4u.com/#app',
      name: 'Zik4U',
      description: 'The social network built on real listening data. Music identity, compatibility scores, live listening rooms.',
      operatingSystem: ['iOS', 'Android'],
      applicationCategory: 'MusicApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      installUrl: [
        'https://apps.apple.com/app/zik4u/id6748722257',
        'https://play.google.com/store/apps/details?id=com.zik4u.app',
      ],
      creator: { '@id': 'https://zik4u.com/#organization' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A0A1A" />
        {/* Smart App Banner — iOS Safari */}
        <meta name="apple-itunes-app" content="app-id=6743844386, app-argument=zik4u://" />
        {/* Android App Banner */}
        <meta name="google-play-app" content="app-id=com.zik4u.app" />
        <link rel="alternate" href="android-app://com.zik4u.app/zik4u//" />
        {/* Schema.org JSON-LD — static constant, no user data, official Next.js pattern */}
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#0A0A1A', color: '#FFFFFF' }}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

