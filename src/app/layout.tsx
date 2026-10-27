import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { defaultMetadata, defaultViewport, SITE_DESCRIPTION } from '@/lib/seo';

const inter = localFont({
  src: [
    { path: '../fonts/inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/inter-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/inter-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

// Static JSON-LD — no user data interpolated, safe per Next.js official docs pattern
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://zik4u.com/#website',
      url: 'https://zik4u.com',
      name: 'Zik4U',
      description: SITE_DESCRIPTION,
      publisher: { '@id': 'https://zik4u.com/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://zik4u.com/#organization',
      name: 'Zik4U',
      url: 'https://zik4u.com',
      logo: { '@type': 'ImageObject', url: 'https://zik4u.com/icon-512.png', width: 512, height: 512 },
      // SITE1-4: no X account declared (Decision 186), no partnership contact (B2B-OFF1).
      contactPoint: { '@type': 'ContactPoint', email: 'support@zik4u.com', contactType: 'customer support' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Store-ready meta */}
        <meta name="application-name" content="Zik4U" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Zik4U" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0A0A1A" />
        {/* SITE1-5 (Decision 183 = A): no app banner, no store link until the store listings exist. */}
        {/* Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Hreflang — geo targeting */}
        <link rel="alternate" hrefLang="en" href="https://zik4u.com" />
        <link rel="alternate" hrefLang="en-US" href="https://zik4u.com" />
        <link rel="alternate" hrefLang="en-GB" href="https://zik4u.com" />
        <link rel="alternate" hrefLang="fr" href="https://zik4u.com" />
        <link rel="alternate" hrefLang="x-default" href="https://zik4u.com" />
        {/* Schema.org JSON-LD — static constant, no user data, official Next.js pattern */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#0A0A1A', color: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}

