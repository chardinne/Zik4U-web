'use client';

import React, { useMemo } from 'react';

interface Props {
  color: string;
  size: number;
  variant: 'star' | 'satellite';
  /**
   * CSS value applied to `transform: scale()` on the root div.
   * Pass a CSS custom property reference (e.g. `"var(--cel-scale, 1)"`) so
   * responsive breakpoints can control the size without touching the SVG geometry.
   * Layout compensation is applied automatically via a matching negative marginBottom:
   *   `calc((scaleVar - 1) * outerSizePx)` — valid CSS since <number>*<length> is allowed.
   * When omitted the body renders at its natural size.
   */
  scaleVar?: string;
}

/**
 * Living celestial body — web port of the mobile BreathingSun (Direction C final).
 *
 * Layers (back → front):
 *   1. Halo     — feGaussianBlur corona, breathing via CSS scale animation.
 *   2. Dust ×2  — stardust field, two groups of 7 memoized circles, opacity pulsing
 *                 via CSS (dephased: 2 200ms / 3 400ms).
 *   3. Core     — off-center hot-spot radialGradient for 3D spherical relief (static).
 *   4. Ring     — satellite only: static inclined ellipse (SVG transform is a fixed
 *                 string, not animated — no layout/paint cost).
 *   5. Orbit    — satellite only: CSS rotation carries the orbiting dot (5 500ms/turn).
 *   6. Play     — geometrically centred path M9 6v12l9-6z, pointer-events none.
 *
 * Animations: CSS @keyframes on div wrappers (= GPU compositing layer, identical
 * perf model to Animated.View on mobile). prefers-reduced-motion disables all motion.
 */
export function CelestialBody({ color, size, variant, scaleVar }: Props) {
  const outerSize = size * 1.6;
  const cx = outerSize / 2;
  const cy = outerSize / 2;
  const uid = `cel_${size}_${variant}`;
  const dimmed = variant === 'satellite';

  // Stardust positions — deterministic, computed once per size change.
  const dustLayer1 = useMemo(() => {
    const os = size * 1.6;
    const ox = os / 2;
    const oy = os / 2;
    return Array.from({ length: 7 }, (_, i) => {
      const angle = (i * (360 / 7) * Math.PI) / 180;
      const r = size * (0.44 + (i % 3) * 0.05);
      return { cx: ox + r * Math.cos(angle), cy: oy + r * Math.sin(angle), r: 0.6 + (i % 4) * 0.2, op: 0.3 + (i % 3) * 0.2 };
    });
  }, [size]);

  const dustLayer2 = useMemo(() => {
    const os = size * 1.6;
    const ox = os / 2;
    const oy = os / 2;
    return Array.from({ length: 7 }, (_, i) => {
      const angle = ((i * (360 / 7) + 25) * Math.PI) / 180;
      const r = size * (0.50 + (i % 3) * 0.04);
      return { cx: ox + r * Math.cos(angle), cy: oy + r * Math.sin(angle), r: 0.5 + (i % 3) * 0.3, op: 0.25 + (i % 4) * 0.15 };
    });
  }, [size]);

  // Global keyframes + class bindings. Two instances per page → idempotent duplicate injection.
  const css = `
    @keyframes cel-breathe   { 0%,100% { transform: scale(1);    } 50% { transform: scale(1.06); } }
    @keyframes cel-twinkle-a { 0%,100% { opacity: 0.6; }          50% { opacity: 1;   } }
    @keyframes cel-twinkle-b { 0%,100% { opacity: 0.9; }          50% { opacity: 0.5; } }
    @keyframes cel-orbit     { from { transform: rotate(0deg); }   to   { transform: rotate(360deg); } }
    .cel-breathe   { animation: cel-breathe   3200ms ease-in-out infinite; }
    .cel-twinkle-a { animation: cel-twinkle-a 2200ms ease-in-out infinite; }
    .cel-twinkle-b { animation: cel-twinkle-b 3400ms ease-in-out infinite; }
    .cel-orbit     { animation: cel-orbit     5500ms linear     infinite; }
    @media (prefers-reduced-motion: reduce) {
      .cel-breathe, .cel-twinkle-a, .cel-twinkle-b, .cel-orbit { animation: none !important; }
    }
  `;

  // Shared layout for every absolute layer over the outerSize canvas.
  const canvas: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0,
    width: outerSize, height: outerSize,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={{
      position: 'relative',
      width: outerSize,
      height: outerSize,
      flexShrink: 0,
      // When scaleVar is provided, scale the body from its top-center and compensate the
      // unused layout space with a negative marginBottom so sibling content isn't pushed down.
      // calc((scaleVar - 1) * Npx) is valid CSS: <number> * <length> = <length>.
      ...(scaleVar && {
        transform: `scale(${scaleVar})`,
        transformOrigin: 'center top',
        marginBottom: `calc((${scaleVar} - 1) * ${outerSize}px)`,
      }),
    }}>
      <style>{css}</style>

      {/* 1 — Halo: breathing blurred corona */}
      <div className="cel-breathe" style={canvas}>
        <svg width={outerSize} height={outerSize} style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id={`halo_${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={color} stopOpacity={dimmed ? 0.3  : 0.55} />
              <stop offset="55%"  stopColor={color} stopOpacity={dimmed ? 0.15 : 0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </radialGradient>
            <filter id={`blur_${uid}`}>
              <feGaussianBlur stdDeviation={size * 0.06} />
            </filter>
          </defs>
          <circle cx={cx} cy={cy} r={size * 0.72} fill={`url(#halo_${uid})`} filter={`url(#blur_${uid})`} />
        </svg>
      </div>

      {/* 2a — Stardust field layer 1: opacity pulses (twinkle-a, 2 200ms) */}
      <div className="cel-twinkle-a" style={canvas}>
        <svg width={outerSize} height={outerSize}>
          <g>
            {dustLayer1.map((p, i) => (
              <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} fillOpacity={p.op} />
            ))}
          </g>
        </svg>
      </div>

      {/* 2b — Stardust field layer 2: opacity pulses (twinkle-b, 3 400ms — dephased) */}
      <div className="cel-twinkle-b" style={canvas}>
        <svg width={outerSize} height={outerSize}>
          <g>
            {dustLayer2.map((p, i) => (
              <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} fillOpacity={p.op} />
            ))}
          </g>
        </svg>
      </div>

      {/* 3 — Core: off-center hot-spot, spherical 3D relief (static) */}
      <div style={canvas}>
        <svg width={size} height={size}>
          <defs>
            <radialGradient id={`core_${uid}`} cx="44%" cy="36%" r="58%">
              <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={dimmed ? 0.65 : 1}    />
              <stop offset="14%"  stopColor="#FFFFFF" stopOpacity={dimmed ? 0.32 : 0.68} />
              <stop offset="42%"  stopColor={color}   stopOpacity={1}                    />
              <stop offset="72%"  stopColor={color}   stopOpacity={0.82}                 />
              <stop offset="100%" stopColor="#000000" stopOpacity={0.42}                 />
            </radialGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#core_${uid})`} />
        </svg>
      </div>

      {/* 4 — Satellite only: static inclined ring (SVG transform is a fixed string, not animated) */}
      {variant === 'satellite' && (
        <div style={canvas}>
          <svg width={outerSize} height={outerSize}>
            <g transform={`rotate(-18, ${cx}, ${cy})`}>
              <ellipse
                cx={cx} cy={cy}
                rx={size * 0.58} ry={size * 0.22}
                stroke={color} strokeWidth={1} strokeOpacity={0.4}
                fill="none"
              />
            </g>
          </svg>
        </div>
      )}

      {/* 5 — Satellite only: single CSS rotation carries the orbiting dot */}
      {variant === 'satellite' && (
        <div className="cel-orbit" style={canvas}>
          <svg width={outerSize} height={outerSize}>
            <circle cx={cx + size * 0.55} cy={cy} r={2.5} fill="#FFFFFF" fillOpacity={0.9} />
          </svg>
        </div>
      )}

      {/* 6 — Play icon: geometrically centred, pointer-events none */}
      <div style={{ ...canvas, pointerEvents: 'none' }}>
        <svg width={size * 0.2} height={size * 0.2} viewBox="0 0 24 24">
          <path d="M9 6v12l9-6z" fill="rgba(0,0,0,0.82)" />
        </svg>
      </div>
    </div>
  );
}
