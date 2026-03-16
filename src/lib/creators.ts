import { supabase } from './supabase';
import type { SearchResult, CreatorProfile } from '@/types';

const DEMO_CREATORS: SearchResult[] = [
  {
    id: 'demo-1',
    username: 'alexsound',
    displayName: 'Alex Sound',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Kendrick Lamar', 'Frank Ocean', 'Tyler the Creator'],
    isCreator: true,
    minTierPrice: 4.99,
  },
  {
    id: 'demo-2',
    username: 'mariajazz',
    displayName: 'Maria Jazz',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Norah Jones', 'Billie Holiday', 'Amy Winehouse'],
    isCreator: true,
    minTierPrice: 9.99,
  },
  {
    id: 'demo-3',
    username: 'djkross',
    displayName: 'DJ Kross',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Daft Punk', 'Justice', 'Gesaffelstein'],
    isCreator: true,
    minTierPrice: 4.99,
  },
  {
    id: 'demo-4',
    username: 'lunabeats',
    displayName: 'Luna Beats',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    topArtists: ['SZA', 'Jhené Aiko', 'H.E.R.'],
    isCreator: true,
    minTierPrice: 9.99,
  },
  {
    id: 'demo-5',
    username: 'maxwaveform',
    displayName: 'Max Waveform',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Radiohead', 'Thom Yorke', 'Portishead'],
    isCreator: true,
    minTierPrice: 4.99,
  },
  {
    id: 'demo-6',
    username: 'zoevibes',
    displayName: 'Zoé Vibes',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Burna Boy', 'Wizkid', 'Davido'],
    isCreator: true,
    minTierPrice: 19.99,
  },
];

export async function searchCreators(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return getFeaturedCreators();

  // Limit input length to prevent ILIKE pattern exhaustion on DB
  const safeQuery = query.trim().slice(0, 100);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        users!inner(is_creator)
      `)
      .eq('users.is_creator', true)
      .or(`username.ilike.%${safeQuery}%,display_name.ilike.%${safeQuery}%`)
      .limit(12);

    if (error) throw error;

    const results = (data ?? []).map(mapToSearchResult);

    // Fallback sur démos filtrées si aucun résultat réel
    if (results.length === 0) {
      const q = safeQuery.toLowerCase();
      return DEMO_CREATORS.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.topArtists.some((a) => a.toLowerCase().includes(q)),
      );
    }

    return results;
  } catch {
    return DEMO_CREATORS;
  }
}

export async function getFeaturedCreators(): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        users!inner(is_creator)
      `)
      .eq('users.is_creator', true)
      .limit(12);

    if (error) throw error;

    const realCreators = (data ?? []).map(mapToSearchResult);

    // Si pas de vrais créateurs en base, afficher les démos
    if (realCreators.length === 0) {
      return DEMO_CREATORS;
    }

    return realCreators;
  } catch {
    // En cas d'erreur Supabase, afficher les démos
    return DEMO_CREATORS;
  }
}

export async function getCreatorProfile(username: string): Promise<CreatorProfile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      display_name,
      avatar_url,
      bio,
      users!inner(is_creator)
    `)
    .eq('username', username)
    .eq('users.is_creator', true)
    .single();

  if (error || !profile) return null;

  const { data: tiers } = await supabase
    .from('creator_tiers')
    .select(`
      id,
      name,
      description,
      perks,
      creator_revenue_tiers!inner(price_web, sort_order)
    `)
    .eq('creator_id', profile.id)
    .order('creator_revenue_tiers(sort_order)');

  const { data: topArtistsData } = await supabase
    .rpc('get_user_top_artists', { p_user_id: profile.id, p_limit: 3 });

  const { count } = await supabase
    .from('creator_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', profile.id)
    .eq('status', 'active');

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name ?? profile.username,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    isCreator: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topArtists: (topArtistsData ?? []).map((a: any) => a.artist_name as string),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tiers: (tiers ?? []).map((t: any) => ({
      id: t.id as string,
      name: t.name as string,
      description: t.description as string | null,
      priceWeb: (t.creator_revenue_tiers?.price_web ?? t.creator_revenue_tiers?.[0]?.price_web ?? 0) as number,
      perks: (t.perks ?? []) as string[],
      sortOrder: (t.creator_revenue_tiers?.sort_order ?? t.creator_revenue_tiers?.[0]?.sort_order ?? 0) as number,
    })),
    totalSubscribers: count ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToSearchResult(row: any): SearchResult {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name ?? row.username,
    avatarUrl: row.avatar_url,
    topArtists: [],
    isCreator: row.users?.is_creator ?? false,
    minTierPrice: null,
  };
}
