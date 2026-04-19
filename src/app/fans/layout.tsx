import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Fans | Zik4U',
  description: 'Follow what your favorite creators really listen to. Not their curated playlist — their actual music, live. For real.',
  openGraph: {
    title: 'For Fans | Zik4U',
    description: 'Follow what your favorite creators really listen to. Their actual music, live. For real.',
    url: 'https://zik4u.com/fans',
  },
  twitter: {
    title: 'For Fans | Zik4U',
    description: 'Follow what your favorite creators really listen to. Not their curated playlist — their actual music, live.',
  },
  alternates: { canonical: 'https://zik4u.com/fans' },
};

export default function FansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
