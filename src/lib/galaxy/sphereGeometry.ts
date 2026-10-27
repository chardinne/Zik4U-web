// SITE1-2 — geometry of the profile sphere, ported from the app (LivingSignalSphere.tsx, develop
// c4551f9): same constants, same formulas, so the founder's planets sit on the site where they sit
// on his phone. Pure functions (tested by src/__tests__/site1-galaxy.test.ts).

import { deriveBpm, deriveMoodColorFromHour } from './audioMood';
import {
  PLANET_BODY_FACTOR,
  PLANET_GLOW_FACTOR,
  PLANET_ORBIT_COS_INC,
  PLANET_RING_INDEX,
  planetFamilies,
  planetParallax,
  planetPerspective,
  satelliteSizeRatio,
} from './planetLook';
import { orbitPoint } from './planetOrbit';
import { nearestSatelliteIndex } from './nearestSatelliteIndex';
import { PLANET_RING_EXTENT } from './textures';

export const MAX_PETALS = 7;
const SATELLITE_ANGLE_JITTER = 0.26;
const SAT_SIZE_MIN = 0.55;
const SAT_SIZE_MAX = 1.7;

export interface SphereTrack { trackId: string; playCount: number; peakLocalHour: number | null }

export interface Planet {
  index: number;
  trackId: string;
  angle: number;
  moodColor: string;
  bpm: number;
  phaseOffset: number;
  family: number;
  /** Body radius drawn at the nearest size (perspective max). */
  pr: number;
  glowR: number;
  ext: number;
  box: number;
  ringed: boolean;
}

export interface Sphere {
  size: number;
  cx: number;
  cy: number;
  half: number;
  haloR: number;
  nucleusR: number;
  orbitR: number;
  petalBaseR: number;
  perspMax: number;
  tapMax: number;
  planets: Planet[];
}

export function buildSphere(size: number, seed: number, tracks: readonly SphereTrack[]): Sphere {
  const half = size / 2;
  const cx = half;
  const cy = half;
  const orbitR = half * 0.66;
  const petalBaseR = half * 0.06;
  const zMax = orbitR * Math.sqrt(1 - PLANET_ORBIT_COS_INC ** 2);
  const perspMax = planetPerspective(zMax, orbitR);
  const list = tracks.slice(0, MAX_PETALS);
  const weights = list.map((t) => Math.max(t.playCount ?? 1, 1));
  const maxW = Math.max(...weights, 1);
  const minW = Math.min(...weights, maxW);
  const fams = planetFamilies(list.map((t) => t.trackId));
  const planets = list.map((t, i) => {
    const noise = ((seed * (i + 1)) % 100) / 100;
    const angle = (i / Math.max(list.length, 1)) * 2 * Math.PI + (noise * 2 - 1) * SATELLITE_ANGLE_JITTER;
    const ratio = satelliteSizeRatio(Math.max(t.playCount ?? 1, 1), minW, maxW, SAT_SIZE_MIN, SAT_SIZE_MAX);
    const pr = petalBaseR * ratio * PLANET_BODY_FACTOR * perspMax;
    const glowR = pr * PLANET_GLOW_FACTOR;
    const ringed = i === PLANET_RING_INDEX;
    const ext = pr * (ringed ? PLANET_RING_EXTENT : 1.12);
    const burstR = petalBaseR * 4 + 2;
    return {
      index: i,
      trackId: t.trackId,
      angle,
      moodColor: deriveMoodColorFromHour(t.peakLocalHour, t.trackId),
      bpm: deriveBpm(null, t.trackId),
      phaseOffset: noise,
      family: fams[i],
      pr,
      glowR,
      ext,
      box: Math.max(glowR, ext, burstR),
      ringed,
    };
  });
  return { size, cx, cy, half, haloR: half * 0.92, nucleusR: half * 0.2, orbitR, petalBaseR, perspMax, tapMax: orbitR * 0.55, planets };
}

/** Where planet p is drawn at orbit offset t with tilt (tx, ty) in [-1, 1] (hologram drift). */
export function planetAt(s: Sphere, p: Planet, t: number, tx = 0, ty = 0) {
  const at = orbitPoint(p.angle + t, s.cx, s.cy, s.orbitR);
  const amp = planetParallax(at.z, s.orbitR);
  return {
    x: at.x - tx * amp,
    y: at.y - ty * amp,
    z: at.z,
    scale: planetPerspective(at.z, s.orbitR) / s.perspMax,
  };
}

/** Index (in s.planets) of the planet under (x, y) in sphere coordinates, or null (app rule). */
export function planetUnder(s: Sphere, x: number, y: number, t: number, tx = 0, ty = 0): number | null {
  const pts = s.planets.map((p) => planetAt(s, p, t, tx, ty));
  return nearestSatelliteIndex(x, y, pts, s.tapMax);
}
