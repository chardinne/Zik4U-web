import { supabase } from './supabase';
import type { SearchResult, CreatorProfile } from '@/types';

export async function searchCreators(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return getFeaturedCreators();

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
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(12);

  if (error) throw error;
  return (data ?? []).map(mapToSearchResult);
}

export async function getFeaturedCreators(): Promise<SearchResult[]> {
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
  return (data ?? []).map(mapToSearchResult);
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
