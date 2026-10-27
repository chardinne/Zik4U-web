/**
 * GALAXY1 — Decision 58 = A of 14/10/2026: where the profile's system lives in the universe,
 * computed from the real listens already measured for the personal sun (get_sun_signature):
 *   - nebula : many new artists (variety ≥ 0.6) — a stellar nursery;
 *   - core   : a very active week (activity ≥ 1.2) — near the galactic core;
 *   - void   : loyal to very few artists (variety ≤ 0.2) — the edge of the void;
 *   - arm    : otherwise — inside a spiral arm of the Milky Way.
 * The first rule that matches wins, in this order. The place follows the listens: the
 * system travels. No signature (no real listen, hidden listening) = no place (the sky of
 * before stays).
 */
import type { SunSignature } from './sunSignature';

export type GalaxyPlace = 'nebula' | 'core' | 'void' | 'arm';

export const PLACE_NEBULA_MIN_VARIETY = 0.6;
export const PLACE_CORE_MIN_ACTIVITY = 1.2;
export const PLACE_VOID_MAX_VARIETY = 0.2;

export function galaxyPlace(sig: SunSignature | null | undefined): GalaxyPlace | null {
  if (!sig) { return null; }
  if (sig.variety >= PLACE_NEBULA_MIN_VARIETY) { return 'nebula'; }
  if (sig.activity >= PLACE_CORE_MIN_ACTIVITY) { return 'core'; }
  if (sig.variety <= PLACE_VOID_MAX_VARIETY) { return 'void'; }
  return 'arm';
}
