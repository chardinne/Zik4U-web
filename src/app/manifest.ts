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
    theme_color: '#00D4FF',
    orientation: 'portrait',
    dir: 'ltr',
    lang: 'en',
    categories: ['social', 'music', 'entertainment'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
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
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/opengraph-image',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Zik4U — Music Identity Dashboard',
      },
    ],
    related_applications: [
      {
        platform: 'itunes',
        url: 'https://apps.apple.com/app/zik4u/id6748722257',
        id: '6748722257',
      },
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.zik4u.app',
        id: 'com.zik4u.app',
      },
    ],
    prefer_related_applications: false,
  };
}
