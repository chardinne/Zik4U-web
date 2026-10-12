// DNA-SILLON site (decisions 25, 44 = A, 12/10/2026) — port of the app module
// src/features/profile/domain/listeningFingerprint.ts (Zik4U develop f0dfd9e), unchanged.
//
// The geometry is computed by the SERVER only (get_listening_fingerprint, Zik4U 00210)
// from the account's real listens; this module validates the answer and turns it into
// SVG paths. The site never draws anything it did not receive.

/** Electric violet of the brand pack. */
export const FINGERPRINT_COLOR = '#9B7BFF';
export const FINGERPRINT_INNER_RADIUS = 13;
export const FINGERPRINT_RING_STEP = 14;
export const FINGERPRINT_STROKE = 8;
export const FINGERPRINT_DOT_RADIUS = 5;
export const FINGERPRINT_MAX_RINGS = 5;
export const FINGERPRINT_VIEWBOX =
  2 * (FINGERPRINT_INNER_RADIUS + FINGERPRINT_RING_STEP * (FINGERPRINT_MAX_RINGS - 1) + FINGERPRINT_STROKE);
export const FINGERPRINT_CENTER = FINGERPRINT_VIEWBOX / 2;

export interface FingerprintRing {
  /** Middle of the opening, degrees (0 = 3 o'clock, clockwise). */
  centre: number;
  /** Width of the opening, degrees. */
  gap: number;
}

export interface ListeningFingerprint {
  listens: number;
  rings: FingerprintRing[];
}

const finite = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/** Validates the server answer (shape v = 1). Anything else is treated as "nothing to draw". */
export function parseFingerprint(raw: unknown): ListeningFingerprint | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as { v?: unknown; listens?: unknown; rings?: unknown };
  if (r.v !== 1 || !finite(r.listens) || r.listens < 0 || !Array.isArray(r.rings)) return null;
  if (r.rings.length > FINGERPRINT_MAX_RINGS) return null;
  const rings: FingerprintRing[] = [];
  for (const ring of r.rings) {
    const c = (ring as { centre?: unknown })?.centre;
    const g = (ring as { gap?: unknown })?.gap;
    const centre = typeof c === 'string' ? Number(c) : c;
    const gap = typeof g === 'string' ? Number(g) : g;
    if (!finite(centre) || !finite(gap) || gap <= 0 || gap >= 360) return null;
    rings.push({ centre, gap });
  }
  return { listens: r.listens, rings };
}

const round2 = (x: number) => Math.round(x * 100) / 100;

/** SVG arc of one groove: the full circle minus its opening, drawn clockwise. */
export function ringArcPath(index: number, ring: FingerprintRing): string {
  const r = FINGERPRINT_INNER_RADIUS + FINGERPRINT_RING_STEP * index;
  const c = FINGERPRINT_CENTER;
  const start = ((ring.centre + ring.gap / 2) * Math.PI) / 180;
  const end = ((ring.centre - ring.gap / 2 + 360) * Math.PI) / 180;
  const x1 = round2(c + r * Math.cos(start));
  const y1 = round2(c + r * Math.sin(start));
  const x2 = round2(c + r * Math.cos(end));
  const y2 = round2(c + r * Math.sin(end));
  const large = 360 - ring.gap > 180 ? 1 : 0;
  return `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const count = (n: number) => Math.max(0, Math.floor(n));
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Decision 36 — "MY GROOVES · 1,022 REAL LISTENS". */
export function fingerprintCaption(listens: number): string {
  const n = count(listens);
  return `MY GROOVES · ${n.toLocaleString('en-US')} REAL ${plural(n, 'LISTEN', 'LISTENS')}`;
}

/** Decision 29 — the bubble shown when the disc is touched. */
export function fingerprintBubbleText(listens: number): string {
  const n = count(listens);
  if (n === 0) return 'No real listens yet';
  return `Drawn from ${n.toLocaleString('en-US')} real ${plural(n, 'listen', 'listens')}`;
}

/** Decision 21, text 7 — what a screen reader says. */
export function fingerprintAccessibilityLabel(username: string, listens: number): string {
  const n = count(listens);
  return `Music identity of @${username}, drawn from ${n.toLocaleString('en-US')} real ${plural(n, 'listen', 'listens')}`;
}

/** Decision 36 — A-side title and numbering. */
export const CONSTELLATION_LABEL = 'A-SIDE · MY CONSTELLATION';
export function trackNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/** Decision 46 — "1,022 REAL LISTENS" on the link preview. */
export function listensLine(listens: number): string {
  const n = count(listens);
  return `${n.toLocaleString('en-US')} REAL ${plural(n, 'LISTEN', 'LISTENS')}`;
}

// ── The vinyl (same constants as the app's SillonDisc.tsx, planche m3) ──
export const SILLON_CANVAS = 236;
export const SILLON_DISC_R = 112;
export const SILLON_GROOVE = 6;
export const SILLON_EMPREINTE_RATIO = 0.88;
/** Decision 33 — one slow turn every 40 s. */
export const SILLON_TURN_S = 40;

/** Fine groove texture radii of the vinyl. */
export const SILLON_TEXTURE_RADII: number[] = (() => {
  const out: number[] = [];
  for (let r = SILLON_DISC_R * 0.37; r < SILLON_DISC_R * 0.98; r += 1.9) out.push(Math.round(r * 10) / 10);
  return out;
})();

/** transform that places the empreinte (viewBox FINGERPRINT_VIEWBOX) inside the disc. */
export function empreinteTransform(): string {
  const scale = (2 * SILLON_DISC_R * SILLON_EMPREINTE_RATIO) / FINGERPRINT_VIEWBOX;
  const offset = SILLON_CANVAS / 2 - FINGERPRINT_CENTER * scale;
  return `translate(${round2(offset)} ${round2(offset)}) scale(${Math.round(scale * 10000) / 10000})`;
}
