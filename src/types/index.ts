export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isCreator: boolean;
  topArtists: string[];
  tiers: CreatorTier[];
  totalSubscribers: number;
}

export interface CreatorTier {
  id: string;
  name: string;
  description: string | null;
  priceWeb: number;
  perks: string[];
  sortOrder: number;
}

export interface SearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  topArtists: string[];
  isCreator: boolean;
  isFeatured: boolean;
  minTierPrice: number | null;
  subscriberCount?: number;
}
