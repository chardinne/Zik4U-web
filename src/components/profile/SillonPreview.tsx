import { ARCHETYPE_LABELS, ARCHETYPE_VISUAL_PROFILE, DEFAULT_ARCHETYPE_PROFILE } from '@/lib/cosmicCard';
import {
  FINGERPRINT_CENTER,
  FINGERPRINT_COLOR,
  FINGERPRINT_DOT_RADIUS,
  SILLON_CANVAS,
  SILLON_DISC_R,
  SILLON_GROOVE,
  empreinteTransform,
  listensLine,
  ringArcPath,
} from '@/lib/listeningFingerprint';
import type { SharedCard } from '@/lib/sharedCard';
import { fit } from './MinimalPreview';

// DNA-SILLON site, decision 46 = A (12/10/2026) — link-preview image of a card shared
// WITH its owner's live key: the record, @handle, archetype, real listens, "For real.".
// Pure rendering of getSharedCard's answer (the route checks the key). Satori rules:
// no box-shadow, no blur filter, no text-shadow (resvg panics); TTF fonts only.

const C = SILLON_CANVAS / 2;
export const PREVIEW_DISC_SIZE = 470;

export function SillonPreview({ card }: { card: SharedCard & { fingerprint: NonNullable<SharedCard['fingerprint']> } }) {
  const profile = card.archetype && ARCHETYPE_VISUAL_PROFILE[card.archetype] ? ARCHETYPE_VISUAL_PROFILE[card.archetype] : DEFAULT_ARCHETYPE_PROFILE;
  const rim = profile.primary;
  const title = card.isForming ? 'EMERGING IDENTITY' : (ARCHETYPE_LABELS[card.archetype ?? ''] ?? card.archetype ?? '').toUpperCase();
  const paths = card.fingerprint.rings.map((ring, i) => ringArcPath(i, ring));

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '1200px', height: '630px', padding: '0 80px', background: 'radial-gradient(ellipse at 70% 28%, #211546 0%, #0d0a22 55%, #060410 100%)', fontFamily: 'Inter' }}>
      <svg width={PREVIEW_DISC_SIZE} height={PREVIEW_DISC_SIZE} viewBox={`0 0 ${SILLON_CANVAS} ${SILLON_CANVAS}`}>
        <defs>
          <radialGradient id="h"><stop offset="0.86" stopColor={rim} stopOpacity="0" /><stop offset="1" stopColor={rim} stopOpacity="0.35" /></radialGradient>
          <radialGradient id="v"><stop offset="0.3" stopColor="#1C1838" /><stop offset="0.96" stopColor="#0A0818" /><stop offset="1" stopColor={rim} stopOpacity="0.6" /></radialGradient>
        </defs>
        <circle cx={C} cy={C} r={C} fill="url(#h)" />
        <circle cx={C} cy={C} r={SILLON_DISC_R} fill="url(#v)" />
        <circle cx={C} cy={C} r={SILLON_DISC_R - 1} fill="none" stroke={rim} strokeOpacity={0.55} strokeWidth={2} />
        <g transform={empreinteTransform()}>
          <g fill="none" stroke={FINGERPRINT_COLOR} strokeOpacity={0.25} strokeWidth={SILLON_GROOVE + 4} strokeLinecap="round">
            {paths.map((d, i) => <path key={`g${i}`} d={d} />)}
          </g>
          <g fill="none" stroke={FINGERPRINT_COLOR} strokeWidth={SILLON_GROOVE} strokeLinecap="round">
            {paths.map((d, i) => <path key={i} d={d} />)}
          </g>
          <circle cx={FINGERPRINT_CENTER} cy={FINGERPRINT_CENTER} r={FINGERPRINT_DOT_RADIUS} fill={FINGERPRINT_COLOR} />
        </g>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 56, flex: 1 }}>
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 5, color: '#A78BFA' }}>ZIK4U · MUSIC DNA</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#00D4FF', marginTop: 22 }}>{`@${fit(card.username, 22)}`}</div>
        <div style={{ display: 'flex', fontFamily: 'Bebas', fontSize: card.isForming ? 88 : 110, lineHeight: 0.92, color: '#F0F0FF', marginTop: 16 }}>{title}</div>
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#A78BFA', marginTop: 18 }}>{listensLine(card.fingerprint.listens)}</div>
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: '#00FFB2', marginTop: 34 }}>For real.</div>
      </div>
    </div>
  );
}
