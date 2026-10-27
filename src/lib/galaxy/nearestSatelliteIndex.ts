/**
 * V3.2.0 — Pure nearest-satellite resolver for sphere tap detection.
 *
 * Replaces the per-satellite <Circle onPress> hit zones (fragile on Android
 * react-native-svg, and overlapping once ORBIT_INCLINATION squashed the orbit
 * vertically). The sphere now wires a single GestureDetector overlay; on tap it
 * calls this helper to map the touch point to the closest satellite center.
 *
 * Extracted from the component so the geometry is unit-testable without mounting
 * the sphere (which carries ~20 worklets and the native SVG/gesture modules).
 *
 * - Euclidean distance from (tapX, tapY) to each satellite center.
 * - Returns the index of the closest satellite, or `null` when the satellite
 *   list is empty OR the closest one is farther than `maxDistance` (tap landed
 *   in the void between/around satellites — caller should no-op).
 * - No React Native / Reanimated dependency: callable from a worklet-bridged JS
 *   callback and from Jest.
 */
export interface SatellitePoint {
  x: number;
  y: number;
}

export function nearestSatelliteIndex(
  tapX: number,
  tapY: number,
  satellites: SatellitePoint[],
  maxDistance: number,
): number | null {
  if (satellites.length === 0) {
    return null;
  }
  let bestIndex = -1;
  let bestDistSq = Infinity;
  for (let i = 0; i < satellites.length; i++) {
    const dx = satellites[i].x - tapX;
    const dy = satellites[i].y - tapY;
    const distSq = dx * dx + dy * dy;
    // Strict `<` keeps the FIRST satellite on a tie (lowest index wins).
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestIndex = i;
    }
  }
  if (bestDistSq > maxDistance * maxDistance) {
    return null;
  }
  return bestIndex;
}
