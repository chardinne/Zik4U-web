import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intelligence Platform — Music Data & Listener Analytics for Labels',
  description: 'Zik4U Intelligence gives labels and researchers real-time access to cross-platform listening patterns, listener archetypes, pre-viral detection, and emotional music data. GDPR-compliant aggregate analytics.',
  keywords: [
    'music intelligence platform',
    'music data analytics',
    'label analytics',
    'listener data',
    'pre-viral artist detection',
    'music research platform',
    'cross-platform listening data',
    'music audience insights',
    'streaming analytics B2B',
    'music emotional data',
    'listener archetypes',
    'GDPR music analytics',
  ],
  openGraph: {
    title: 'Intelligence Platform — Music Data & Listener Analytics | Zik4U',
    description: 'Real-time cross-platform listening patterns, pre-viral detection, and listener archetypes. Built for labels, researchers, and music industry professionals.',
    url: 'https://zik4u.com/partner',
  },
  twitter: {
    title: 'Intelligence Platform — Music Data & Listener Analytics | Zik4U',
    description: 'Real-time cross-platform listening patterns, pre-viral detection, and listener archetypes for labels and researchers.',
  },
  alternates: {
    canonical: 'https://zik4u.com/partner',
  },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
