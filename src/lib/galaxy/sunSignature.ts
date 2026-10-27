/**
 * SUN1 + SUN2 — Decisions 49 (B "La signature"), 50 (A), 51 (no rays), 52 (A) and 53 (A)
 * of 13/10/2026.
 *
 * The sun at the heart of the profile sphere is personal. The SERVER computes the numbers
 * (get_sun_signature, migration 00214) from the account's real listens; this module
 * validates the answer and derives how the sun is drawn — as LIGHT, not as colour rings
 * (Decision 52: the profile's colour, rendered as a real sun):
 *   - colour    = archetype colour rotated by hue_shift degrees (evenings → colder,
 *                 mornings → warmer); the nebula and the background keep their colour;
 *   - light     = activity of the last 7 days vs the weekly average of 28 days, bounded
 *                 [0.25, 1.5]: wider and brighter glow, hotter core — never off;
 *   - surface   = granulation whose strength follows the variety of artists (Decision 53;
 *                 the rays of SUN1 are removed, Decision 51);
 *   - live      = listening right now: faster pulse, brighter glow.
 * Decision 50: the Music DNA disc border + halo, the story and the web card take the
 * same sun colour (sunColor).
 * null (no signature: hidden listening, no real listen, invalid answer) = the archetype
 * sun, exactly as before.
 */
import type { ArchetypeVisualProfile } from './audioMood';

export interface SunSignature {
  listens: number;
  hueShift: number;
  activity: number;
  variety: number;
  live: boolean;
}

export const SUN_ACTIVITY_MIN = 0.25;
export const SUN_ACTIVITY_MAX = 1.5;
export const SUN_HUE_SHIFT_MAX = 25;
/** Live: the pulse runs this much faster, the glow this much brighter. */
export const SUN_LIVE_PULSE_FACTOR = 0.5;
export const SUN_LIVE_GLOW_BOOST = 1.2;
/** The glow never reaches the edge of the sphere canvas (no clipped square). */
export const SUN_GLOW_SCALE_MAX = 1.05;

const num = (x: unknown): number | null => {
  const n = typeof x === 'string' && x.trim() !== '' ? Number(x) : x;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
};

/** Validates the server answer (shape v = 1). Anything else = no signature (archetype sun). */
export function parseSunSignature(raw: unknown): SunSignature | null {
  if (!raw || typeof raw !== 'object') { return null; }
  const r = raw as Record<string, unknown>;
  if (r.v !== 1 || typeof r.live !== 'boolean') { return null; }
  const listens = num(r.listens);
  const hueShift = num(r.hue_shift);
  const activity = num(r.activity);
  const variety = num(r.variety);
  if (listens === null || hueShift === null || activity === null || variety === null) {
    return null;
  }
  if (listens < 1 || Math.abs(hueShift) > SUN_HUE_SHIFT_MAX) { return null; }
  if (activity < SUN_ACTIVITY_MIN || activity > SUN_ACTIVITY_MAX) { return null; }
  if (variety < 0 || variety > 1) { return null; }
  return { listens, hueShift, activity, variety, live: r.live };
}

const HEX = /^#([0-9a-f]{6})$/i;

function hexToRgb(hex: string): [number, number, number] | null {
  const m = HEX.exec(hex);
  if (!m) { return null; }
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255) as [number, number, number];
}

const toHex = (u: number) => Math.round(Math.min(1, Math.max(0, u)) * 255).toString(16).padStart(2, '0');

/** Rotates the hue of a #RRGGBB colour (HSL), saturation and lightness kept. */
export function shiftHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) { return hex; }
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) { return hex.toUpperCase(); }
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) { h = 60 * (((g - b) / d) % 6); } else if (max === g) { h = 60 * ((b - r) / d + 2); } else { h = 60 * ((r - g) / d + 4); }
  h = (((h + degrees) % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const o = l - c / 2;
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return `#${toHex(r1 + o)}${toHex(g1 + o)}${toHex(b1 + o)}`.toUpperCase();
}

/** Linear mix of two #RRGGBB colours (t = share of b). */
export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) { return a; }
  return `#${ca.map((u, i) => toHex(u + (cb[i] - u) * t)).join('')}`.toUpperCase();
}

export interface SunLook {
  /** true = the realistic sun (signature present); false = the archetype sun of before. */
  realistic: boolean;
  primary: string;
  secondary: string;
  /** Photosphere colour (mostly primary, a touch of secondary). */
  discColor: string;
  /** Archetype halo strength (archetype sun only). */
  glowAlpha: number;
  /** Glow radius as a share of the sphere halo radius. */
  glowScale: number;
  /** Glow opacity (before the breathing). */
  glowOpacity: number;
  /** Opacity of the white-hot core. */
  coreFactor: number;
  /** Opacity of the granulation (variety). */
  grainOpacity: number;
  live: boolean;
}

/** How the sun is drawn: the archetype sun when there is no signature. */
export function sunLook(base: ArchetypeVisualProfile, sig: SunSignature | null | undefined): SunLook {
  if (!sig) {
    return {
      realistic: false,
      primary: base.primary,
      secondary: base.secondary,
      discColor: base.primary,
      glowAlpha: base.glowAlpha,
      glowScale: 1,
      glowOpacity: 1,
      coreFactor: 1,
      grainOpacity: 0,
      live: false,
    };
  }
  const a = sig.activity / SUN_ACTIVITY_MAX;
  const primary = shiftHue(base.primary, sig.hueShift);
  const secondary = shiftHue(base.secondary, sig.hueShift);
  return {
    realistic: true,
    primary,
    secondary,
    discColor: mixHex(primary, secondary, 0.25),
    glowAlpha: base.glowAlpha,
    glowScale: Math.min(SUN_GLOW_SCALE_MAX, 0.75 + 0.3 * a),
    glowOpacity: Math.min(1, (0.6 + 0.4 * a) * (sig.live ? SUN_LIVE_GLOW_BOOST : 1)),
    coreFactor: Math.min(1, 0.9 + 0.15 * a),
    grainOpacity: 0.15 + 0.6 * sig.variety,
    live: sig.live,
  };
}

/**
 * Decision 50 — the colour the Music DNA disc border + halo, the story and the web card
 * take: the personal sun's colour (from the archetype base the sphere itself uses). Without
 * a signature, `fallback` (the colour these surfaces used before SUN1) is kept.
 */
export function sunColor(base: ArchetypeVisualProfile, sig: SunSignature | null | undefined, fallback: string): string {
  return sig ? sunLook(base, sig).primary : fallback;
}
