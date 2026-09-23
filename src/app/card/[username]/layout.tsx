import localFont from 'next/font/local';
import type { Metadata } from 'next';

const bebasNeue = localFont({
  src: '../../../fonts/bebas-neue-400.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Zik4U profile',
  description: 'A Zik4U profile.',
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <div className={bebasNeue.variable}>{children}</div>;
}
