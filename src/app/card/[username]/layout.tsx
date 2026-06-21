import { Bebas_Neue } from 'next/font/google';
import type { Metadata } from 'next';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });

export const metadata: Metadata = {
  title: 'Zik4U: Musical Identity Card',
  description: "Discover someone's musical identity on Zik4U",
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <div className={bebasNeue.variable}>{children}</div>;
}
