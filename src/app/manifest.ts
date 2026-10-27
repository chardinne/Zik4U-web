import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zik4U — You Are What You Listen To',
    short_name: 'Zik4U',
    description: 'The social network built on real listens. Discover people who listen like you, turn your music taste into identity, and monetize what you actually hear.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0A0A1A',
    theme_color: '#120E24',
    orientation: 'portrait',
    dir: 'ltr',
    lang: 'en',
    categories: ['social', 'music', 'entertainment'],
    icons: [
      {
        src: '/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Zik4U — Music Identity Dashboard',
      },
    ],
    // SITE1-5 (Decision 183 = A): no related store app listed until the store listings exist.
  };
}
