import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/users`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/creators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fans`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/listeners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/become-creator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/streaming-partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${BASE_URL}/works-with/spotify`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/apple-music`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/youtube-music`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/soundcloud`,    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/deezer`,        lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/tidal`,          lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/lastfm`,         lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/amazon-music`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with/boomplay`,       lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/works-with`,                lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic creator profile pages + card pages (share-to-install)
  try {
    const [{ data: creators }, { data: activeUsers }] = await Promise.all([
      supabase
        .from('users')
        .select('username, updated_at')
        .eq('is_creator', true)
        .not('username', 'is', null)
        .limit(5000),
      supabase
        .from('profiles')
        .select('username, updated_at')
        .not('username', 'is', null)
        .limit(500),
    ]);

    const creatorRoutes: MetadataRoute.Sitemap = (creators ?? []).map((creator) => ({
      url: `${BASE_URL}/creator/${creator.username}`,
      lastModified: creator.updated_at ? new Date(creator.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    const cardRoutes: MetadataRoute.Sitemap = (activeUsers ?? []).map((u) => ({
      url: `${BASE_URL}/card/${u.username}`,
      lastModified: u.updated_at ?? new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...creatorRoutes, ...cardRoutes];
  } catch {
    // If DB is unavailable during build, return only static routes
    return staticRoutes;
  }
}
