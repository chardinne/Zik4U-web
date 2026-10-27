/**
 * Mood color derivation for Living Signal petals.
 *
 * VOIE 3 SIMPLE — peak_local_hour mapping.
 * The mood color of a track is derived from the user's median listening hour
 * for that track, in the user's local IANA timezone. This is the "For real."
 * promise: the color encodes WHEN you listen to the track, which carries more
 * personal meaning than any audio feature could.
 *
 * VOIE 1 — BPM remains hash-based (no real audio data, intentional).
 *
 * Ranges (local hour, inclusive lower, exclusive upper):
 *  Morning   05–11   gold    #FFB800   morning_warrior  rising energy
 *  Day       11–17   cyan    #00D4FF   social_listener  productive neutral
 *  Evening   17–22   pink    #FF3CAC   deep_feeler      decompression
 *  Night     22–05   purple  #7B2FFF   night_explorer   contemplation
 */

const MOOD_MORNING = '#FFB800';
const MOOD_DAY     = '#00D4FF';
const MOOD_EVENING = '#FF3CAC';
const MOOD_NIGHT   = '#7B2FFF';

const MOOD_PALETTE = [MOOD_MORNING, MOOD_DAY, MOOD_EVENING, MOOD_NIGHT];

export function deriveMoodColorFromHour(
  peakLocalHour: number | null,
  trackKey: string,
): string {
  if (peakLocalHour !== null && peakLocalHour >= 0 && peakLocalHour <= 23) {
    if (peakLocalHour >= 5  && peakLocalHour < 11) { return MOOD_MORNING; }
    if (peakLocalHour >= 11 && peakLocalHour < 17) { return MOOD_DAY; }
    if (peakLocalHour >= 17 && peakLocalHour < 22) { return MOOD_EVENING; }
    return MOOD_NIGHT;
  }
  // Fallback (rare: no scrobbles in window or invalid hour) — deterministic hash
  const hash = trackKey.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
  return MOOD_PALETTE[Math.abs(hash) % MOOD_PALETTE.length];
}

export function deriveBpm(_bpm: number | null, trackKey: string): number {
  // BPM remains hash-based (Voie 1) — Zik4U does not pull real audio features
  // from any third-party API. The petal pulse rate is symbolic, derived
  // deterministically per track to ensure visual variety across petals.
  const hash = trackKey.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
  return 70 + (Math.abs(hash) % 71);
}

/**
 * Temporal aura color based on the CURRENT system hour (when the user is
 * looking at the Sphere), not the per-track peak hour. This shifts the
 * Sphere's overall atmosphere throughout the day.
 *
 *  05-11  morning   warm gold     #FFB800
 *  11-17  day       clear cyan    #00D4FF
 *  17-22  evening   warm rose     #FF3CAC
 *  22-05  night     deep indigo   #7B2FFF
 *
 * Returns the dominant aura color for the given hour (0-23).
 */
export function deriveTemporalAuraColor(currentHour: number): string {
  const hour = ((currentHour % 24) + 24) % 24;
  if (hour >= 5  && hour < 11) { return MOOD_MORNING; }
  if (hour >= 11 && hour < 17) { return MOOD_DAY; }
  if (hour >= 17 && hour < 22) { return MOOD_EVENING; }
  return MOOD_NIGHT;
}

/**
 * Per-archetype visual profile. Each archetype has a primary atmosphere
 * color, a secondary tint (used for the nucleus gradient inner stop), a
 * pulse rhythm (ms per full membrane+nucleus breathing cycle), and a glow
 * alpha multiplier (0..1) for halo and petal corona intensity.
 *
 * The pulse rhythm encodes the perceived temperament:
 *  - Night explorer = slow, contemplative breathing (5000ms)
 *  - Morning warrior = quicker, more energetic (3000ms)
 *  - Deep feeler = slow but intense glow
 *  - Social listener = neutral default (4000ms)
 */
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
  primary: '#7B2FFF',
  secondary: '#3B1A8A',
  pulseMs: 4000,
  glowAlpha: 0.30,
};

/**
 * Background star field — 60 static distant stars distributed with Gaussian
 * density (denser near center, sparser at edges). Deterministic per user
 * (seeded from userId).
 *
 * Each star has:
 *   - x, y: normalized [-1, 1] coordinates (will be scaled to canvas size)
 *   - r: radius in CSS px [0.5, 2.5]
 *   - opacity: [0.15, 0.45]
 *
 * Purpose: dissolve the sense of "icon on black canvas" — the Sphere lives
 * inside an actual starry sky. 100% static (no animation), so the field is
 * computed once per render and contributes ~0 to per-frame cost.
 */

export interface BackgroundStar {
  x: number; // normalized [-1, 1]
  y: number; // normalized [-1, 1]
  r: number; // px [0.5, 2.5]
  opacity: number; // [0.15, 0.60] (band-core stars get a +0.15 boost)
}

// V3.5.3 — Milky Way band tuning (starting values, tunable on device).
export const MILKYWAY_ANGLE = (-32 * Math.PI) / 180; // diagonal axis of the band (≈ -32°)
const MILKYWAY_BAND_THICKNESS = 0.22; // perpendicular gaussian spread of the band
const MILKYWAY_OFFBAND_FRACTION = 0.2; // ~20% of stars stay dispersed wide (background, not dead)

/**
 * V3.5.3 — deterministic star field shaped into a diagonal Milky Way band:
 * stars cluster along an axis (uniform position `along` + a tight gaussian
 * perpendicular `perp`), rotated by `angleRad`. ~20% stay in a wide gaussian
 * dispersion so the background isn't dead. Band-core stars (small perp offset)
 * are slightly brighter. Backward-compatible: extra params are optional.
 */
export function buildBackgroundStarField(
  seed: number,
  count: number = 150,
  angleRad: number = MILKYWAY_ANGLE,
  bandThickness: number = MILKYWAY_BAND_THICKNESS,
): BackgroundStar[] {
  // Deterministic pseudo-random generator from seed
  let state = seed || 1;
  const next = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  // Box-Muller transform for Gaussian distribution
  const gaussian = (): number => {
    const u1 = next() || 0.0001;
    const u2 = next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const clamp = (v: number): number => Math.max(-1, Math.min(1, v));
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  const stars: BackgroundStar[] = [];
  for (let i = 0; i < count; i++) {
    let x: number;
    let y: number;
    let inBandCore = false;

    if (next() < MILKYWAY_OFFBAND_FRACTION) {
      // Wide dispersed background star
      x = clamp(gaussian() * 0.45);
      y = clamp(gaussian() * 0.45);
    } else {
      // Star on the diagonal band: uniform along the axis, tight gaussian across.
      const along = next() * 2 - 1;
      const perp = gaussian() * bandThickness;
      x = clamp(along * cosA - perp * sinA);
      y = clamp(along * sinA + perp * cosA);
      inBandCore = Math.abs(perp) < bandThickness * 0.6;
    }

    // Most stars are tiny (0.5-1.2px), a few (~10%) are slightly larger
    const sizeRoll = next();
    const r = sizeRoll < 0.10
      ? 1.5 + sizeRoll * 10 // [1.5, 2.5] for the ~10%
      : 0.5 + sizeRoll * 0.8; // [0.5, 1.3] for the rest
    // Opacity inversely proportional to size for a more natural look
    let opacity = 0.15 + next() * 0.30;
    // Band core reads brighter/denser than the diffuse background.
    if (inBandCore) { opacity = Math.min(0.6, opacity + 0.15); }
    stars.push({ x, y, r, opacity });
  }
  return stars;
}
