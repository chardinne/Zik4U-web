/**
 * PLANET1 — Decisions 54 (C) and 55 (A) of 14/10/2026.
 *
 * The satellites of the profile sphere are realistic planets (Decision 54 = C):
 *   - body    = a surface family chosen by the title (same title, same planet on every
 *               profile; two titles of one profile never share a family while one is free),
 *               filled with the title's mood colour, slightly tilted;
 *   - light   = the lit face looks at the personal sun, the night side away from it;
 *   - ring    = the title on repeat (the first defining track, the ON REPEAT pill of the
 *               Music DNA card) wears a ring;
 *   - life    = only the glow breathes, at the title's rhythm; the body is still.
 * Size (Decision 55 = A): when every title has the same number of listens (or there is
 * a single title), every planet takes the middle size instead of the smallest.
 *
 * GALAXY1 — Decisions 56 = A ("Photographie") and 57 = A (natural tones) of 14/10/2026:
 * the planets are lit by the star in 3D (real phases: near planets are crescents, far ones
 * nearly full), scaled by perspective, drawn far-to-near, in natural photographic tones
 * tinted by the mood; the ring has divisions; the glow becomes a thin breathing haze.
 *
 * LIGHT1 — Decisions 59 = A (true light) and 60 = A (hologram) of 14/10/2026: the star's
 * light is cast for real (sharper terminator, deep night, sub-solar HDR highlight, sheen,
 * warm twilight band, light tinted by the star); tilting the phone moves every layer by
 * its depth (sky least, star, far planets, near planets most) and the sheen glides.
 *
 * ORBIT1 — Decision 61 = A of 14/10/2026: the planets travel on their orbit (planetOrbit.ts);
 * the helpers called per frame on the UI thread are worklets.
 */

export const PLANET_FAMILY_COUNT = 8;
/** Planet radius = satellite core radius × this (the visible corona of before). */
export const PLANET_BODY_FACTOR = 1.5;
/** Glow radius = planet radius × this. */
export const PLANET_GLOW_FACTOR = 2.6;
/** Glow peak opacity (before the breathing) — GALAXY1: a thin atmospheric haze (was 0.55). */
export const PLANET_GLOW_OPACITY = 0.3;
/** Ring tilt on screen (degrees). */
export const PLANET_RING_TILT_DEG = -18;
/** Index of the ringed planet: the title on repeat (ON REPEAT = definingTracks[0]). */
export const PLANET_RING_INDEX = 0;

/** Same 32-bit hash as deriveBpm / deriveMoodColorFromHour (audioMood.ts). */
export function trackHash(key: string): number {
  // eslint-disable-next-line no-bitwise
  const hash = key.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
  return Math.abs(hash);
}

/** Surface family per title, in order: the title's own family, or the next free one. */
export function planetFamilies(trackIds: readonly string[]): number[] {
  const taken = new Set<number>();
  return trackIds.map((id) => {
    let fam = trackHash(id) % PLANET_FAMILY_COUNT;
    if (taken.size < PLANET_FAMILY_COUNT) {
      while (taken.has(fam)) { fam = (fam + 1) % PLANET_FAMILY_COUNT; }
    }
    taken.add(fam);
    return fam;
  });
}

/** Surface tilt of a title, in degrees, within [-25, 24]. */
export function planetTilt(trackId: string): number {
  return (Math.floor(trackHash(trackId) / PLANET_FAMILY_COUNT) % 50) - 25;
}

/** Rotation (degrees) that turns the shade (light from -x) toward the sun at (sunX, sunY). */
export function planetLightRotation(x: number, y: number, sunX: number, sunY: number): number {
  'worklet';
  return (Math.atan2(sunY - y, sunX - x) * 180) / Math.PI - 180;
}

/** Decision 55 = A — size ratio of a satellite: equal listens (or one title) = middle size. */
export function satelliteSizeRatio(weight: number, minW: number, maxW: number, minRatio: number, maxRatio: number): number {
  if (maxW <= minW) { return (minRatio + maxRatio) / 2; }
  const normalized = (weight - minW) / Math.max(maxW - minW, 1);
  return minRatio + (maxRatio - minRatio) * normalized;
}

/** Orbit inclination of the sphere (screen squash 0.75 = cos i). */
export const PLANET_ORBIT_COS_INC = 0.75;
/** GALAXY1 — the star sits a little in front of the orbit plane (toward the viewer), so the
 *  near planets are side-lit crescents and the far ones nearly full (× orbit radius). */
export const PLANET_STAR_DEPTH = 0.9;
/** GALAXY1 — perspective: a planet at depth z is scaled by 1 + z / (PERSPECTIVE × orbit). */
export const PLANET_PERSPECTIVE = 4;

/** Depth of a planet on the inclined orbit (+ = toward the viewer), in px. */
export function planetDepth(angle: number, orbitR: number): number {
  'worklet';
  return orbitR * Math.sin(angle) * Math.sqrt(1 - PLANET_ORBIT_COS_INC ** 2);
}

/** Perspective scale of a planet at depth z. */
export function planetPerspective(z: number, orbitR: number): number {
  'worklet';
  return 1 + z / (PLANET_PERSPECTIVE * orbitR);
}

/** Phase of a planet: angle (degrees) between the view axis and the light from the star. */
export function planetPhaseAngle(dx: number, dy: number, z: number, orbitR: number): number {
  const lx = -dx;
  const ly = -dy;
  const lz = PLANET_STAR_DEPTH * orbitR - z;
  const n = Math.hypot(lx, ly, lz) || 1;
  return (Math.acos(Math.max(-1, Math.min(1, lz / n))) * 180) / Math.PI;
}

/** Index of the nearest generated phase (planetTextures PLANET_PHASES). */
export function planetPhaseIndex(angle: number, phases: readonly number[]): number {
  let best = 0;
  phases.forEach((p, i) => { if (Math.abs(p - angle) < Math.abs(phases[best] - angle)) { best = i; } });
  return best;
}

export interface PlanetColors {
  /** Bright albedo (Decision 57 = A: natural tones tinted by the mood). */
  light: string;
  /** Dark albedo. */
  dark: string;
  /** Lit-limb atmospheric scattering. */
  rim: string;
  /** Ring material. */
  ring: string;
}

const hexToRgb = (h: string): [number, number, number] =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const rgbToHex = (c: number[]) =>
  `#${c.map((u) => Math.round(Math.min(1, Math.max(0, u)) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** Decision 57 = A — natural photographic tones, tinted by the mood colour (natural share 0.2). */
export function planetColors(mood: string): PlanetColors {
  const m = /^#[0-9a-f]{6}$/i.test(mood) ? hexToRgb(mood) : hexToRgb('#FF3CAC');
  const ochre = [0.86, 0.74, 0.62];
  const lightRaw = m.map((u, i) => u * 0.6 + ochre[i] * 0.38);
  const lmax = Math.max(...lightRaw) || 1;
  const light = lightRaw.map((u) => (u / lmax) * 0.92);
  const darkBase = [0.22, 0.12, 0.09];
  const dark = m.map((u, i) => u * 0.2 + darkBase[i] * 0.8);
  const sky = [0.55, 0.75, 1.0];
  const rim = m.map((u, i) => sky[i] * 0.6 + u * 0.4);
  const cream = [0.9, 0.85, 0.78];
  const ring = light.map((u, i) => u * 0.55 + cream[i] * 0.45);
  return { light: rgbToHex(light), dark: rgbToHex(dark), rim: rgbToHex(rim), ring: rgbToHex(ring) };
}

// ─── LIGHT1 — Decisions 59 = A (true light) and 60 = A (hologram) of 14/10/2026 ───────────

/** Share of the star colour in the light it casts (the rest is white daylight). */
export const PLANET_LIGHT_STAR_SHARE = 0.22;
/** Warm band where day turns into night (Rayleigh reddening). */
export const PLANET_TWILIGHT_COLOR = '#FF7A45';

export interface PlanetLightColors {
  /** HDR excess around the sub-solar point: the planet's bright albedo pushed toward the light. */
  highlight: string;
  /** Sheen (specular) — the light itself. */
  specular: string;
}

/** Colours of the light a planet receives from the profile's star. */
export function planetLightColors(colorsOfPlanet: PlanetColors, star: string): PlanetLightColors {
  const s = /^#[0-9a-f]{6}$/i.test(star) ? hexToRgb(star) : [1, 1, 1];
  const daylight = [1.0, 0.98, 0.95];
  const light = daylight.map((u, i) => u * (1 - PLANET_LIGHT_STAR_SHARE) + s[i] * PLANET_LIGHT_STAR_SHARE);
  const albedo = hexToRgb(colorsOfPlanet.light);
  const highlight = albedo.map((u, i) => (u * 0.5 + 0.5) * light[i]);
  return { highlight: rgbToHex(highlight), specular: rgbToHex(light) };
}

/** Hologram (Decision 60 = A): parallax amplitudes in dp at full tilt — the nearer, the more it moves. */
export const HOLO_SKY = 4;
export const HOLO_STAR = 9;
export const HOLO_PLANET_MID = 15;
export const HOLO_PLANET_SPREAD = 10;
/** The sheen glides over the planet faster than the planet itself (× planet radius). */
export const HOLO_SHEEN = 0.14;

/** Parallax amplitude of a planet at depth z: far ones ~5 dp, near ones ~25 dp. */
export function planetParallax(z: number, orbitR: number): number {
  'worklet';
  const zMax = orbitR * Math.sqrt(1 - PLANET_ORBIT_COS_INC ** 2) || 1;
  return HOLO_PLANET_MID + HOLO_PLANET_SPREAD * Math.max(-1, Math.min(1, z / zMax));
}
