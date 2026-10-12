'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FINGERPRINT_CENTER,
  FINGERPRINT_COLOR,
  FINGERPRINT_DOT_RADIUS,
  SILLON_CANVAS,
  SILLON_DISC_R,
  SILLON_GROOVE,
  SILLON_TEXTURE_RADII,
  SILLON_TURN_S,
  empreinteTransform,
  fingerprintAccessibilityLabel,
  fingerprintBubbleText,
  ringArcPath,
  type ListeningFingerprint,
} from '@/lib/listeningFingerprint';

// DNA-SILLON site (decisions 29, 33, 34, 44 = A) — the same record as the app's
// SillonDisc: halo, vinyl, groove texture, archetype rim, server-drawn empreinte, static
// sheen. One turn every 40 s; stopped when the visitor asks to reduce motion, when the
// tab is hidden or when the disc is off screen. Touch = the "Drawn from …" bubble.

const C = SILLON_CANVAS / 2;

export function SillonDisc({
  fingerprint,
  size,
  rimColor,
  username,
}: {
  fingerprint: ListeningFingerprint;
  size: number;
  rimColor: string;
  username: string;
}) {
  const [bubble, setBubble] = useState(false);
  const [running, setRunning] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let visible = true;
    let onScreen = true;
    const update = () => setRunning(visible && onScreen);
    const onVis = () => { visible = document.visibilityState === 'visible'; update(); };
    document.addEventListener('visibilitychange', onVis);
    onVis();
    let io: IntersectionObserver | null = null;
    if (ref.current && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => { onScreen = entries.some((e) => e.isIntersecting); update(); });
      io.observe(ref.current);
    }
    return () => { document.removeEventListener('visibilitychange', onVis); io?.disconnect(); };
  }, []);

  const paths = fingerprint.rings.map((ring, i) => ringArcPath(i, ring));
  const grooves = (
    <>
      <g fill="none" stroke={FINGERPRINT_COLOR} strokeWidth={SILLON_GROOVE} strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
      <circle cx={FINGERPRINT_CENTER} cy={FINGERPRINT_CENTER} r={FINGERPRINT_DOT_RADIUS} fill={FINGERPRINT_COLOR} />
    </>
  );

  return (
    <button
      ref={ref}
      type="button"
      data-testid="sillon-disc"
      onClick={() => setBubble((b) => !b)}
      aria-label={fingerprintAccessibilityLabel(username, fingerprint.listens)}
      style={{ position: 'relative', width: size, height: size, padding: 0, border: 'none', background: 'none', cursor: 'pointer', alignSelf: 'center', flexShrink: 0 }}
    >
      <style>{`
        @keyframes zik4u-sillon-turn { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .zik4u-sillon { animation: zik4u-sillon-turn ${SILLON_TURN_S}s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .zik4u-sillon { animation: none; } }
      `}</style>
      <svg
        className="zik4u-sillon"
        width={size}
        height={size}
        viewBox={`0 0 ${SILLON_CANVAS} ${SILLON_CANVAS}`}
        style={{ position: 'absolute', inset: 0, animationPlayState: running ? 'running' : 'paused' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sillonHalo">
            <stop offset="0.86" stopColor={rimColor} stopOpacity="0" />
            <stop offset="1" stopColor={rimColor} stopOpacity="0.35" />
          </radialGradient>
          <radialGradient id="sillonVinyl">
            <stop offset="0.3" stopColor="#1C1838" />
            <stop offset="0.96" stopColor="#0A0818" />
            <stop offset="1" stopColor={rimColor} stopOpacity="0.6" />
          </radialGradient>
          <filter id="sillonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <circle cx={C} cy={C} r={C} fill="url(#sillonHalo)" />
        <circle cx={C} cy={C} r={SILLON_DISC_R} fill="url(#sillonVinyl)" />
        <g fill="none" stroke="#FFFFFF" strokeOpacity={0.03} strokeWidth={1}>
          {SILLON_TEXTURE_RADII.map((r) => <circle key={r} cx={C} cy={C} r={r} />)}
        </g>
        <circle cx={C} cy={C} r={SILLON_DISC_R - 1} fill="none" stroke={rimColor} strokeOpacity={0.55} strokeWidth={2} />
        <g transform={empreinteTransform()}>
          <g filter="url(#sillonGlow)" opacity={0.6}>{grooves}</g>
          {grooves}
        </g>
      </svg>
      {/* Static sheen: the light stays put while the record turns. */}
      <svg width={size} height={size} viewBox={`0 0 ${SILLON_CANVAS} ${SILLON_CANVAS}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <linearGradient id="sillonSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.25" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.07" />
            <stop offset="0.75" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx={C} cy={C} r={SILLON_DISC_R} fill="url(#sillonSheen)" />
      </svg>
      {bubble && (
        <span
          role="status"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '8px 12px', borderRadius: 12, border: `1px solid ${FINGERPRINT_COLOR}`, background: 'rgba(20,16,44,0.94)', color: '#F0F0FF', fontSize: 13, whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {fingerprintBubbleText(fingerprint.listens)}
        </span>
      )}
    </button>
  );
}
