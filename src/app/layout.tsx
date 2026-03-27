import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { defaultMetadata } from '@/lib/seo';
import { CookieBanner } from '@/components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0A0A1A" />
        {/* Smart App Banner — iOS Safari */}
        <meta name="apple-itunes-app" content="app-id=6743844386, app-argument=zik4u://" />
        {/* Android App Banner */}
        <meta name="google-play-app" content="app-id=com.zik4u.app" />
        <link rel="alternate" href="android-app://com.zik4u.app/zik4u//" />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#0A0A1A', color: '#FFFFFF' }}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
