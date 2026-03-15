import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zik4U — Your Music. Your Identity.',
  description: 'Discover creators who listen like you. Turn your music taste into passive revenue.',
  openGraph: {
    title: 'Zik4U — Your Music. Your Identity.',
    description: 'Discover creators who listen like you.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#0A0A1A', color: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
