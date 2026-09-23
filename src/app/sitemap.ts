import { MetadataRoute } from 'next';
import { listSitemapProfiles } from '@/lib/publicProfile';

// Regenerated hourly so privacy changes reach the sitemap.
export const revalidate = 3600;

// Pre-launch switch (WEB-PRIV1 decision 3 = B). Set to true at launch.
export const LIST_PROFILES = false;

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

  // WEB-PRIV1 decision 3 = B: no profile is listed before launch (test accounts and
  // e-mail-derived usernames must not reach search engines). Turn LIST_PROFILES on at
  // launch, after purging test accounts.
  if (!LIST_PROFILES) return staticRoutes;

  // WEB-PRIV1 — public, non-deleted accounts only (D4). Private accounts never listed.
  // Creator pages are not listed: their canonical URL is the card (decision 1 = B).
  try {
    const profiles = await listSitemapProfiles();
    const cardRoutes: MetadataRoute.Sitemap = profiles.map((p) => ({
      url: `${BASE_URL}/card/${encodeURIComponent(p.username)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));
    return [...staticRoutes, ...cardRoutes];
  } catch {
    // Service env vars missing (e.g. at build time): static routes only.
    return staticRoutes;
  }
}
