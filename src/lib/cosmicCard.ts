export const ARCHETYPE_LABELS: Record<string, string> = {
  night_explorer:  'Night Explorer',
  morning_warrior: 'Morning Warrior',
  deep_feeler:     'Deep Feeler',
  cultural_nomad:  'Cultural Nomad',
  obsessive_fan:   'Obsessive Fan',
  social_listener: 'Social Listener',
  zen_drifter:     'Zen Drifter',
};

export interface ArchetypeVisualProfile {
  primary: string;
  secondary: string;
  pulseMs: number;
  glowAlpha: number;
}

export const ARCHETYPE_VISUAL_PROFILE: Record<string, ArchetypeVisualProfile> = {
  night_explorer:  { primary: '#7B2FFF', secondary: '#3B1A8A', pulseMs: 5000, glowAlpha: 0.35 },
  morning_warrior: { primary: '#FFB800', secondary: '#FF6A00', pulseMs: 3000, glowAlpha: 0.40 },
  deep_feeler:     { primary: '#FF3CAC', secondary: '#7B2FFF', pulseMs: 4500, glowAlpha: 0.45 },
  cultural_nomad:  { primary: '#00FFB2', secondary: '#00D4FF', pulseMs: 4000, glowAlpha: 0.30 },
  obsessive_fan:   { primary: '#FF3CAC', secondary: '#FF6A00', pulseMs: 3500, glowAlpha: 0.50 },
  social_listener: { primary: '#00D4FF', secondary: '#FFB800', pulseMs: 4000, glowAlpha: 0.30 },
  zen_drifter:     { primary: '#00FFB2', secondary: '#3B1A8A', pulseMs: 6000, glowAlpha: 0.25 },
};

export const DEFAULT_ARCHETYPE_PROFILE: ArchetypeVisualProfile = {
  primary: '#7B2FFF', secondary: '#3B1A8A', pulseMs: 4000, glowAlpha: 0.30,
};

// Base archetype color only — no hue-seed/diversity/volume modulation from mobile
// (invisible to a passing visitor, porting cost not justified).

export const TAGLINE_FALLBACK = "Music tells the story words can't.";
// Mobile removed mood from generateTagline → always returns this fallback regardless of archetype.
// Web parity: do not port the per-archetype tagline table, just use this fallback.

export const CONSTELLATION_PALETTE = ['#00D4FF', '#7B2FFF', '#FFB800', '#00FFB2'];

export const RARITY_THRESHOLDS = {
  common:    { max: 100, label: 'Common',    color: '#aaa' },
  uncommon:  { max: 20,  label: 'Uncommon',  color: '#00D4FF' },
  rare:      { max: 10,  label: 'Rare',      color: '#7B2FFF' },
  legendary: { max: 3,   label: 'Legendary', color: '#FF3CAC' },
} as const;

export type Rarity = keyof typeof RARITY_THRESHOLDS;

export function toRarity(pct: number): Rarity {
  if (pct <= RARITY_THRESHOLDS.legendary.max) return 'legendary';
  if (pct <= RARITY_THRESHOLDS.rare.max) return 'rare';
  if (pct <= RARITY_THRESHOLDS.uncommon.max) return 'uncommon';
  return 'common';
}

export interface MusicSignatureData {
  peak_hour: number | null;
  top_artist: string | null;
  all_time_artist: string | null;
  total_scrobbles: number;
  current_streak: number;
  unique_artists_30d: number;
  unique_artists_total: number;
  member_since: string | null;
  music_genres: string[];
}

export interface MusicBadge { id: string; label: string; color: string; }
export interface MusicBioResult { signature: string; badges: MusicBadge[]; isEmpty: boolean; }

function peakHourLabel(hour: number): string {
  if (hour >= 22 || hour < 5) return '🌙 Night owl';
  if (hour >= 5 && hour < 12) return '☀️ Early bird';
  if (hour >= 12 && hour < 18) return '🌅 Audiophile';
  return '🌆 Evening';
}

// Direct port of GenerateMusicBioUseCase (mobile) — logic unchanged.
export function generateMusicBio(data: MusicSignatureData | null): MusicBioResult {
  if (!data || data.total_scrobbles === 0) return { signature: '', badges: [], isEmpty: true };

  const parts: string[] = [];
  if (data.peak_hour !== null) parts.push(peakHourLabel(data.peak_hour));
  const artist = data.top_artist ?? data.all_time_artist;
  if (artist) parts.push(`Fan of ${artist}`);
  if (data.current_streak >= 1) parts.push(`${data.current_streak}d streak`);
  else parts.push(`${data.total_scrobbles} plays`);

  const badges: MusicBadge[] = [];
  if (data.current_streak >= 7) badges.push({ id: 'streak', label: `🔥 ${data.current_streak}d streak`, color: '#FF3CAC' });
  if (data.unique_artists_total >= 100) badges.push({ id: 'explorer', label: `🌍 ${data.unique_artists_total} artists`, color: '#00FFB2' });
  if (data.total_scrobbles >= 1000) badges.push({ id: 'melomane', label: `🎵 ${data.total_scrobbles} plays`, color: '#00D4FF' });
  if (badges.length < 3 && data.member_since) {
    const years = Math.floor((Date.now() - new Date(data.member_since).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (years >= 1) badges.push({ id: 'veteran', label: `⭐ ${years} year${years > 1 ? 's' : ''} on Zik4U`, color: '#7B2FFF' });
  }

  return { signature: parts.join(' · '), badges: badges.slice(0, 3), isEmpty: false };
}

// Listen buttons — search by name, platform-agnostic, zero third-party music API.
export function buildListenSearchUrls(title: string, artist: string) {
  const q = encodeURIComponent(`${artist} ${title}`.trim());
  return {
    spotify:     `https://open.spotify.com/search/${q}`,
    appleMusic:  `https://music.apple.com/search?term=${q}`,
    youtubeMusic: `https://music.youtube.com/search?q=${q}`,
  };
}
