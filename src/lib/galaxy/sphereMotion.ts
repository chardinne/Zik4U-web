// PERF1 — the motion curves of the living sphere, as pure worklets.
//
// Every looping animation of the sphere now lives on an Animated.View (opacity /
// scale / translate, GPU-composited); the SVG it wraps is static and rasterised once.
// Animating SVG props re-rasterised the whole full-width sphere on every frame
// (~100-250 ms per frame measured on the A54, 13/10/2026).
//
// A pulsing radius r(t) = baseR * f(t) becomes a circle drawn ONCE at its largest
// radius baseR * MAX and a view scale f(t) / MAX in ]0, 1]: same radius curve, the
// texture is only ever scaled down (stays crisp).

/** Satellite white-hot core: BPM pulse factor range [0.88, 1.12]. */
export const PETAL_PULSE_MAX = 1.12;
/** Nucleus: counter-phase pulse factor range [0.97, 1.03]. */
export const NUCLEUS_PULSE_MAX = 1.03;

/** Radius factor of a satellite core at cycle position t in [0, 1). */
export function petalPulseFactor(t: number): number {
  'worklet';
  return 0.88 + 0.24 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI));
}

/** Cycle position of a satellite core: its BPM sets the period, its phase desyncs it. */
export function petalCycle(timeMs: number, bpm: number, phaseOffset: number): number {
  'worklet';
  const periodMs = 60_000 / bpm;
  return ((timeMs % periodMs) / periodMs + phaseOffset) % 1;
}

/** Soft-halo twinkle: two superimposed sines per satellite, opacity in [base*floor, base]. */
export function petalTwinkleOpacity(
  timeMs: number,
  petalIndex: number,
  baseOpacity: number,
  floor: number,
): number {
  'worklet';
  const periodA = 2200 + petalIndex * 280; // 2200-3960ms
  const periodB = 1700 + petalIndex * 190; // 1700-2840ms
  const tA = (timeMs % periodA) / periodA;
  const tB = (timeMs % periodB) / periodB;
  const flicker = 0.5 + 0.5 * (0.6 * Math.sin(tA * 2 * Math.PI) + 0.4 * Math.sin(tB * 2 * Math.PI));
  return baseOpacity * (floor + (1 - floor) * flicker);
}

/** Outer halo breathing (8 s). */
export function haloOpacity(timeMs: number): number {
  'worklet';
  const t = (timeMs % 8000) / 8000;
  return 0.25 + 0.2 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI));
}

/** Cosmic mist (ex-membrane) scale, archetype-paced. */
export function membraneScale(timeMs: number, pulseMs: number): number {
  'worklet';
  const t = (timeMs % pulseMs) / pulseMs;
  return 0.97 + 0.06 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI));
}

/** Nucleus radius factor, counter-phase with the mist. */
export function nucleusFactor(timeMs: number, pulseMs: number): number {
  'worklet';
  const t = (timeMs % pulseMs) / pulseMs;
  return 0.97 + 0.06 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI + Math.PI));
}

/** PLANET1 (Decision 54 = C) — a planet's glow breathes at its title's rhythm: opacity factor in [0.7, 1]. */
export function planetGlowBreath(t: number): number {
  'worklet';
  return 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI));
}
