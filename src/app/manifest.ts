import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zik4U',
    short_name: 'Zik4U',
    description: 'The social network built on real listens. You are what you listen to.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A1A',
    theme_color: '#00D4FF',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['social', 'music', 'entertainment'],
    lang: 'en',
  };
}
