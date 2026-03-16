import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zik4U — Musical Identity Card',
  description: "Discover someone's musical identity on Zik4U",
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
