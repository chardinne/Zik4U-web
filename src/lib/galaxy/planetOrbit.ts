/**
 * ORBIT1 — Decision 61 = A of 14/10/2026: the living orbit.
 *
 * The planets travel on their inclined orbit around the personal sun, slowly enough to
 * be tapped (one turn in ORBIT_PERIOD_MS); the orbit stops while a finger is on the
 * sphere. Everything that follows the orbit continuously (position, perspective scale,
 * hologram amplitude, direction of the light) is a view transform computed on the UI
 * thread from one shared angle (PERF1 rule: no SVG prop animated per frame). What can
 * only change by steps (phase texture, far-to-near order, the planet's shadow on its
 * ring) is re-derived from a snapshot of the angle at most once per ORBIT_TICK_MS.
 * Satellites keep their spacing (they all turn at the same speed): tap zones stay distinct.
 */
import {
  PLANET_ORBIT_COS_INC,
  PLANET_RING_INDEX,
  planetDepth,
  planetLightRotation,
  planetPhaseAngle,
  planetPhaseIndex,
} from './planetLook';

/** One full turn (ms) — 6 min: a planet drifts about 1° per second. */
export const ORBIT_PERIOD_MS = 360_000;
/** A frame step is capped so a resumed app never makes the planets jump. */
export const ORBIT_MAX_STEP_MS = 100;
/** Cadence (ms) at which the stepped look (phase, order, ring shadow) is re-derived. */
export const ORBIT_TICK_MS = 1000;
/** The ringed planet's shadow on its ring is redrawn by steps of this many degrees. */
export const ORBIT_RING_LIGHT_STEP_DEG = 3;

const TURN = 2 * Math.PI;

/** Orbit angle after dtMs (radians, kept in [0, 2π)). */
export function orbitAdvance(t: number, dtMs: number): number {
  'worklet';
  const step = Math.min(Math.max(dtMs, 0), ORBIT_MAX_STEP_MS);
  return (t + (TURN * step) / ORBIT_PERIOD_MS) % TURN;
}

/** Screen position (x, y) and depth z (+ = toward the viewer) at an orbit angle. */
export function orbitPoint(angle: number, cx: number, cy: number, orbitR: number): { x: number; y: number; z: number } {
  'worklet';
  return {
    x: cx + orbitR * Math.cos(angle),
    y: cy + orbitR * PLANET_ORBIT_COS_INC * Math.sin(angle),
    z: planetDepth(angle, orbitR),
  };
}

export interface OrbitLook {
  /** Planet slots, far to near. */
  order: number[];
  /** Generated phase index per slot (planetTextures PLANET_PHASES). */
  phases: number[];
  /** Direction of the light on the ringed planet (degrees), stepped by ORBIT_RING_LIGHT_STEP_DEG. */
  ringLight: number;
}

/** Stepped look of the planets at orbit offset t (null slot = no planet). */
export function orbitLook(
  baseAngles: readonly (number | null)[],
  t: number,
  cx: number,
  cy: number,
  orbitR: number,
  phaseList: readonly number[],
): OrbitLook {
  const points = baseAngles.map((a) => (a === null ? null : orbitPoint(a + t, cx, cy, orbitR)));
  const order = points
    .map((p, i) => ({ i, z: p ? p.z : 0 }))
    .sort((a, b) => a.z - b.z)
    .map((o) => o.i);
  const phases = points.map((p) => (p ? planetPhaseIndex(planetPhaseAngle(p.x - cx, p.y - cy, p.z, orbitR), phaseList) : 0));
  const ring = points[PLANET_RING_INDEX];
  const ringLight = ring
    ? Math.round(planetLightRotation(ring.x, ring.y, cx, cy) / ORBIT_RING_LIGHT_STEP_DEG) * ORBIT_RING_LIGHT_STEP_DEG
    : 0;
  return { order, phases, ringLight };
}

/**
 * Same base angles, compared by VALUE. A caller that rebuilds an equal array on every
 * render (the Discover teaser passes no tracks: a default `[]` is a new array each time)
 * must not look like a new orbit — compared by reference, the orbit tick re-rendered
 * forever and froze the JS thread (A54, 16/10/2026).
 */
export function sameAngles(a: ReadonlyArray<number | null>, b: ReadonlyArray<number | null>): boolean {
  if (a === b) { return true; }
  if (a.length !== b.length) { return false; }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) { return false; }
  }
  return true;
}

/** Same look → no re-render. */
export function sameOrbitLook(a: OrbitLook, b: OrbitLook): boolean {
  return a.order.join() === b.order.join() && a.phases.join() === b.phases.join() && a.ringLight === b.ringLight;
}
