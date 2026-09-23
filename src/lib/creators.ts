import { supabase } from './supabase';
import type { SearchResult } from '@/types';

const DEMO_CREATORS: SearchResult[] = [
  {
    id: 'demo-1',
    username: 'alexsound',
    displayName: 'Alex Sound',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Kendrick Lamar', 'Frank Ocean', 'Tyler the Creator'],
    isCreator: true,
    isFeatured: true,
    minTierPrice: 4.99,
  },
  {
    id: 'demo-2',
    username: 'mariajazz',
    displayName: 'Maria Jazz',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Norah Jones', 'Billie Holiday', 'Amy Winehouse'],
    isCreator: true,
    isFeatured: true,
    minTierPrice: 9.99,
  },
  {
    id: 'demo-3',
    username: 'djkross',
    displayName: 'DJ Kross',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Daft Punk', 'Justice', 'Gesaffelstein'],
    isCreator: true,
    isFeatured: false,
    minTierPrice: 4.99,
  },
  {
    id: 'demo-4',
    username: 'lunabeats',
    displayName: 'Luna Beats',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    topArtists: ['SZA', 'Jhené Aiko', 'H.E.R.'],
    isCreator: true,
    isFeatured: false,
    minTierPrice: 9.99,
  },
  {
    id: 'demo-5',
    username: 'maxwaveform',
    displayName: 'Max Waveform',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Radiohead', 'Thom Yorke', 'Portishead'],
    isCreator: true,
    isFeatured: false,
    minTierPrice: 4.99,
  },
  {
    id: 'demo-6',
    username: 'zoevibes',
    displayName: 'Zoé Vibes',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    topArtists: ['Burna Boy', 'Wizkid', 'Davido'],
    isCreator: true,
    isFeatured: false,
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
        users!inner(is_creator, is_featured)
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
    const [featuredRes, allRes] = await Promise.all([
      supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          avatar_url,
          users!inner(is_creator, is_featured)
        `)
        .eq('users.is_creator', true)
        .eq('users.is_featured', true)
        .limit(6),
      supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          avatar_url,
          users!inner(is_creator, is_featured)
        `)
        .eq('users.is_creator', true)
        .limit(12),
    ]);

    const featured = (featuredRes.data ?? []).map(mapToSearchResult);
    const all = (allRes.data ?? []).map(mapToSearchResult);

    if (featured.length === 0 && all.length === 0) {
      return DEMO_CREATORS;
    }

    // Featured first, then fill up to 12 with the rest (deduplicated)
    const featuredIds = new Set(featured.map((c) => c.id));
    const rest = all.filter((c) => !featuredIds.has(c.id));
    return [...featured, ...rest].slice(0, 12);
  } catch {
    return DEMO_CREATORS;
  }
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
    isFeatured: row.users?.is_featured ?? false,
    minTierPrice: null,
  };
}
