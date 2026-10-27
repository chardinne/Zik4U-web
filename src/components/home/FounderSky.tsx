'use client';

// SITE1-2 — the founder's LIVE galaxy (Decisions 174 = A, 175 = M2, 177 = B of 26/10/2026).
// Web port of the app's profile sphere (LivingSignalSphere + GalaxyPlaceBackdrop, develop c4551f9):
// photographic sky of the place, personal sun (glow + photosphere + glare), photographic planets
// on their living orbit (one turn in 6 min), light turned toward the star, ring on the title on
// repeat. Same rules as the app (PERF1/ORBIT1): every SVG is static; per frame only CSS transforms
// change (orbit, perspective, hologram, light direction); the stepped look (phase, order, ring
// shadow) is re-derived once per second. Stops when hidden, off screen, or "reduce motion".
// Tap or click a planet: its card, with links to listen (Decision 180). Tap in the void: closed. The orbit holds while a finger is down.

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FounderGalaxy } from '@/lib/founderGalaxy';
import { LIVE_WINDOW_MS } from '@/lib/founderGalaxy';
import { HOME_TEXTS, homeListenLinks, lastHeardLabel, playsLine } from '@/lib/homeTexts';
import { ARCHETYPE_VISUAL_PROFILE, DEFAULT_ARCHETYPE_PROFILE } from '@/lib/galaxy/audioMood';
import { sunLook, SUN_LIVE_PULSE_FACTOR } from '@/lib/galaxy/sunSignature';
import { galaxyPlace } from '@/lib/galaxy/galaxyPlace';
import {
  HOLO_SKY,
  HOLO_STAR,
  PLANET_GLOW_OPACITY,
  PLANET_RING_TILT_DEG,
  PLANET_TWILIGHT_COLOR,
  planetColors,
  planetLightColors,
  planetLightRotation,
  planetTilt,
} from '@/lib/galaxy/planetLook';
import { orbitAdvance, orbitLook, sameOrbitLook, ORBIT_TICK_MS, type OrbitLook } from '@/lib/galaxy/planetOrbit';
import { buildSphere, planetAt, planetUnder, type Planet, type Sphere } from '@/lib/galaxy/sphereGeometry';
import {
  COSMIC_DITHER_OPACITY,
  COSMIC_DITHER_TILE,
  COSMIC_DITHER_URI,
  FOUNDER_FALLBACK_IMAGE,
  GALAXY_PLACE_IMAGE_RATIO,
  GALAXY_PLACE_IMAGES,
  PLANET_DISC_RADIUS,
  PLANET_HIGHLIGHT_URIS,
  PLANET_PHASES,
  PLANET_RIM_URIS,
  PLANET_RING_BACK_URI,
  PLANET_RING_FRONT_URI,
  PLANET_SHADE_URIS,
  PLANET_SPECULAR_URIS,
  PLANET_SURFACE_URIS,
  PLANET_TWILIGHT_URIS,
  SUN_CORE_URI,
  SUN_DISC_RADIUS,
  SUN_DISC_URI,
  SUN_GLARE_URI,
  SUN_GLOW_URI,
  SUN_GRAIN_URI,
} from '@/lib/galaxy/textures';
import styles from './home.module.css';
import { useNow } from './useNow';

const SUN_GLARE_SCALE = 1.9;
const SUN_GLARE_OPACITY = 0.75;
const PAD = 8; // the app draws the sphere at width - 16

type Tilt = { x: number; y: number };

const abs = (left: number, top: number, w: number, h = w): React.CSSProperties => ({ position: 'absolute', left, top, width: w, height: h });

export function FounderSky({ galaxy }: { galaxy: FounderGalaxy | null }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const now = useNow();

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    // The observer reports the first size right after observe(): no synchronous setState here.
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!galaxy || galaxy.tracks.length === 0) {
    return (
      <div ref={boxRef} className={styles.sky} data-testid="founder-sky-fallback">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOUNDER_FALLBACK_IMAGE} alt={HOME_TEXTS.fallbackCaption} className={styles.skyFallback} />
      </div>
    );
  }
  return (
    <div ref={boxRef} className={styles.sky} data-testid="founder-sky">
      {width > 0 && <LiveSky galaxy={galaxy} width={width} now={now} />}
    </div>
  );
}

function LiveSky({ galaxy, width, now }: { galaxy: FounderGalaxy; width: number; now: number | null }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const size = width - PAD * 2;
  const sphere = useMemo(() => buildSphere(size, galaxy.seed, galaxy.tracks), [size, galaxy.seed, galaxy.tracks]);
  const profile = (galaxy.archetype && ARCHETYPE_VISUAL_PROFILE[galaxy.archetype]) || DEFAULT_ARCHETYPE_PROFILE;
  const look = sunLook(profile, galaxy.sun);
  const place = galaxyPlace(galaxy.sun) ?? 'arm';
  const pulseMs = profile.pulseMs * (look.live ? SUN_LIVE_PULSE_FACTOR : 1);

  // ── living orbit + hologram (pointer on a computer), all in refs: no re-render per frame ──
  const orbitT = useRef(0);
  const held = useRef(false);
  const tilt = useRef<Tilt>({ x: 0, y: 0 });
  const tiltTarget = useRef<Tilt>({ x: 0, y: 0 });
  const planetEls = useRef<(HTMLDivElement | null)[]>([]);
  const lightEls = useRef<(HTMLDivElement | null)[]>([]);
  const sheenEls = useRef<(HTMLDivElement | null)[]>([]);
  const starEl = useRef<HTMLDivElement>(null);
  const glowEl = useRef<HTMLDivElement>(null);
  const skyEl = useRef<HTMLImageElement>(null);
  const rootEl = useRef<HTMLDivElement>(null);

  const [orbitLookState, setOrbitLookState] = useState<OrbitLook>(() =>
    orbitLook(sphere.planets.map((p) => p.angle), 0, sphere.cx, sphere.cy, sphere.orbitR, PLANET_PHASES));
  // No planet is chosen on arrival: the visitor sees the whole galaxy and taps a planet to read it.
  const [selected, setSelected] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let onScreen = true;
    let raf = 0;
    let last = performance.now();
    const apply = () => {
      const t = orbitT.current;
      const tl = tilt.current;
      sphere.planets.forEach((p, i) => {
        const a = planetAt(sphere, p, t, tl.x, tl.y);
        const el = planetEls.current[i];
        if (el) el.style.transform = `translate(${a.x.toFixed(2)}px, ${a.y.toFixed(2)}px) scale(${a.scale.toFixed(4)})`;
        const rot = `rotate(${planetLightRotation(a.x, a.y, sphere.cx, sphere.cy).toFixed(2)}deg)`;
        const le = lightEls.current[i];
        if (le) le.style.transform = rot;
        const se = sheenEls.current[i];
        if (se) se.style.transform = rot;
      });
      const star = `translate(${(-tl.x * HOLO_STAR).toFixed(2)}px, ${(-tl.y * HOLO_STAR).toFixed(2)}px)`;
      if (starEl.current) starEl.current.style.transform = star;
      if (glowEl.current) glowEl.current.style.transform = star;
      if (skyEl.current) skyEl.current.style.transform = `translate(${(-tl.x * HOLO_SKY).toFixed(2)}px, ${(-tl.y * HOLO_SKY).toFixed(2)}px)`;
    };
    const frame = (ts: number) => {
      const dt = ts - last;
      last = ts;
      if (!held.current && !reduce.matches) orbitT.current = orbitAdvance(orbitT.current, dt);
      const k = Math.min(1, dt / 160);
      tilt.current = {
        x: tilt.current.x + (tiltTarget.current.x - tilt.current.x) * k,
        y: tilt.current.y + (tiltTarget.current.y - tilt.current.y) * k,
      };
      apply();
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (visible && onScreen) { last = performance.now(); raf = requestAnimationFrame(frame); } else apply();
    };
    const onVis = () => { visible = document.visibilityState === 'visible'; run(); };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); });
    if (rootEl.current) io.observe(rootEl.current);
    const tick = setInterval(() => {
      if (!visible || !onScreen) return;
      const next = orbitLook(sphere.planets.map((p) => p.angle), orbitT.current, sphere.cx, sphere.cy, sphere.orbitR, PLANET_PHASES);
      setOrbitLookState((prev) => (sameOrbitLook(prev, next) ? prev : next));
    }, ORBIT_TICK_MS);
    apply();
    run();
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(tick);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [sphere]);

  // pointer → sphere coordinates (the site is zoomed: compare the drawn box to its layout width)
  const toSphere = (e: React.PointerEvent) => {
    const el = rootEl.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const k = r.width / el.clientWidth || 1;
    return { x: (e.clientX - r.left) / k - PAD, y: (e.clientY - r.top) / k - PAD, w: el.clientWidth, h: el.clientHeight };
  };
  const pick = (e: React.PointerEvent) => {
    const at = toSphere(e);
    if (!at) return;
    const i = planetUnder(sphere, at.x, at.y, orbitT.current, tilt.current.x, tilt.current.y);
    // Like the app: a tap (or click) on a planet opens its card, a tap in the void closes it.
    if (i === null) { setSelected(null); return; }
    if (i !== selected) setSelected(i);
    setBurst((b) => b + 1);
  };

  const track = selected === null ? null : galaxy.tracks[selected];
  const live = galaxy.lastClean && now !== null ? now - new Date(galaxy.lastClean.playedAt).getTime() < LIVE_WINDOW_MS : false;

  const skyW = width + HOLO_SKY * 2;
  const glowR = sphere.haloR * look.glowScale;
  const discHalf = (sphere.nucleusR * 1.15) / SUN_DISC_RADIUS;
  const { cx, cy } = sphere;

  return (
    <div
      ref={rootEl}
      className={styles.skyLive}
      role="img"
      aria-label={`${HOME_TEXTS.fallbackCaption} ${galaxy.tracks.length} songs on repeat this week.`}
      onPointerDown={() => { held.current = true; }}
      onPointerUp={(e) => { held.current = false; pick(e); }}
      onPointerCancel={() => { held.current = false; }}
      onPointerLeave={() => {
        held.current = false;
        tiltTarget.current = { x: 0, y: 0 };
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const at = toSphere(e);
        if (!at) return;
        tiltTarget.current = { x: Math.max(-1, Math.min(1, ((at.x + PAD) / at.w) * 2 - 1)), y: Math.max(-1, Math.min(1, ((at.y + PAD) / at.h) * 2 - 1)) };
      }}
    >
      {/* sky of the place (GALAXY1), deepest layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={skyEl} src={GALAXY_PLACE_IMAGES[place]} alt="" style={{ ...abs(-HOLO_SKY, -HOLO_SKY, skyW, skyW * GALAXY_PLACE_IMAGE_RATIO), maxWidth: 'none' }} draggable={false} />

      <div style={abs(PAD, PAD, size)}>
        {/* sun glow: light map filled with the sun colour, breathing */}
        <div ref={glowEl} style={abs(0, 0, size)}>
          <div className={styles.breathe} style={{ ...abs(0, 0, size), animationDuration: `${pulseMs}ms`, ['--o-lo' as string]: String(look.glowOpacity * 0.86), ['--o-hi' as string]: String(look.glowOpacity) }}>
            <svg width={size} height={size}>
              <defs>
                <mask id={`${uid}g`} maskUnits="userSpaceOnUse" x={cx - glowR} y={cy - glowR} width={glowR * 2} height={glowR * 2}>
                  <image href={SUN_GLOW_URI} x={cx - glowR} y={cy - glowR} width={glowR * 2} height={glowR * 2} preserveAspectRatio="none" />
                </mask>
              </defs>
              <rect x={cx - glowR} y={cy - glowR} width={glowR * 2} height={glowR * 2} fill={look.primary} mask={`url(#${uid}g)`} />
            </svg>
          </div>
        </div>

        {/* planets, far to near */}
        {orbitLookState.order.map((i) => {
          const p = sphere.planets[i];
          if (!p) return null;
          return (
            <PlanetView
              key={p.trackId}
              uid={`${uid}p${i}`}
              p={p}
              sphere={sphere}
              phase={orbitLookState.phases[i]}
              ringLight={orbitLookState.ringLight}
              star={look.primary}
              selected={i === selected}
              burst={i === selected ? burst : 0}
              wrapRef={(el) => { planetEls.current[i] = el; }}
              lightRef={(el) => { lightEls.current[i] = el; }}
              sheenRef={(el) => { sheenEls.current[i] = el; }}
            />
          );
        })}

        {/* photosphere + overexposed glare (SUN2 / GALAXY1), over the planets */}
        <div ref={starEl} style={abs(0, 0, size)}>
          <svg width={size} height={size}>
            <defs>
              <mask id={`${uid}d`} maskUnits="userSpaceOnUse" x={cx - discHalf} y={cy - discHalf} width={discHalf * 2} height={discHalf * 2}>
                <image href={SUN_DISC_URI} x={cx - discHalf} y={cy - discHalf} width={discHalf * 2} height={discHalf * 2} preserveAspectRatio="none" />
              </mask>
            </defs>
            <rect x={cx - discHalf} y={cy - discHalf} width={discHalf * 2} height={discHalf * 2} fill={look.discColor} mask={`url(#${uid}d)`} />
            <image href={SUN_CORE_URI} x={cx - discHalf} y={cy - discHalf} width={discHalf * 2} height={discHalf * 2} opacity={look.coreFactor} preserveAspectRatio="none" />
            <image href={SUN_GRAIN_URI} x={cx - discHalf} y={cy - discHalf} width={discHalf * 2} height={discHalf * 2} opacity={look.grainOpacity} preserveAspectRatio="none" />
            <image href={SUN_GLARE_URI} x={cx - discHalf * SUN_GLARE_SCALE} y={cy - discHalf * SUN_GLARE_SCALE} width={discHalf * SUN_GLARE_SCALE * 2} height={discHalf * SUN_GLARE_SCALE * 2} opacity={SUN_GLARE_OPACITY * look.coreFactor} preserveAspectRatio="none" />
          </svg>
        </div>

        {/* uniform blue-noise dither (anti-banding), static */}
        <svg width={size} height={size} style={abs(0, 0, size)} aria-hidden>
          <defs>
            <pattern id={`${uid}n`} patternUnits="userSpaceOnUse" width={COSMIC_DITHER_TILE} height={COSMIC_DITHER_TILE}>
              <image href={COSMIC_DITHER_URI} width={COSMIC_DITHER_TILE} height={COSMIC_DITHER_TILE} preserveAspectRatio="none" />
            </pattern>
          </defs>
          <rect width={size} height={size} fill={`url(#${uid}n)`} opacity={COSMIC_DITHER_OPACITY} />
        </svg>
      </div>

      {/* live line (D177 = B): cleaned titles only */}
      {galaxy.lastClean && now !== null && (
        <div className={`${styles.live} ${live ? '' : styles.liveOff}`} data-testid="founder-live">
          <i />
          {live ? (
            <><b>{HOME_TEXTS.liveLabel}</b><span>{galaxy.lastClean.title} · {galaxy.lastClean.artist}</span></>
          ) : (
            <span>{lastHeardLabel(galaxy.lastClean.playedAt, galaxy.lastClean.title, now)}</span>
          )}
        </div>
      )}

      {/* planet card (M2) */}
      {track && (
        <div
          className={styles.card}
          data-testid="planet-card"
          aria-live="polite"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          <button type="button" className={styles.cardClose} aria-label={HOME_TEXTS.closeCard} onClick={() => setSelected(null)}>×</button>
          <div className={styles.cardLine}><b>{track.title}</b><span> · {track.artist}</span></div>
          <em>{playsLine(track.playCount, track.peakLocalHour)}</em>
          <div className={styles.listen} data-testid="planet-listen">
            <span>{HOME_TEXTS.listenLabel}</span>
            {homeListenLinks(track.artist, track.title).map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlanetView({
  uid, p, sphere, phase, ringLight, star, selected, burst, wrapRef, lightRef, sheenRef,
}: {
  uid: string; p: Planet; sphere: Sphere; phase: number; ringLight: number; star: string; selected: boolean; burst: number;
  wrapRef: (el: HTMLDivElement | null) => void; lightRef: (el: HTMLDivElement | null) => void; sheenRef: (el: HTMLDivElement | null) => void;
}) {
  const { pr, glowR, ext, box } = p;
  const tex = (2 * pr) / PLANET_DISC_RADIUS;
  const t0 = ext - tex / 2;
  const pc = planetColors(p.moodColor);
  const lc = planetLightColors(pc, star);
  const sheenOpacity = p.family < 5 ? 0.5 : 0.3;
  const ringRot = `rotate(${PLANET_RING_TILT_DEG} ${ext} ${ext})`;
  const period = 60000 / p.bpm;
  const inner = abs(box - ext, box - ext, ext * 2);
  return (
    <div ref={wrapRef} style={{ ...abs(-box, -box, box * 2), willChange: 'transform' }}>
      {/* haze, breathing at the title's rhythm */}
      <div className={styles.breathe} style={{ ...abs(box - glowR, box - glowR, glowR * 2), animationDuration: `${period}ms`, animationDelay: `${-p.phaseOffset * period}ms`, ['--o-lo' as string]: String(PLANET_GLOW_OPACITY * 0.7), ['--o-hi' as string]: String(PLANET_GLOW_OPACITY) }}>
        <svg width={glowR * 2} height={glowR * 2}>
          <defs>
            <mask id={`${uid}h`} maskUnits="userSpaceOnUse" x={0} y={0} width={glowR * 2} height={glowR * 2}>
              <image href={SUN_GLOW_URI} width={glowR * 2} height={glowR * 2} preserveAspectRatio="none" />
            </mask>
          </defs>
          <rect width={glowR * 2} height={glowR * 2} fill={pc.rim} mask={`url(#${uid}h)`} />
        </svg>
      </div>
      {p.ringed && (
        <svg width={ext * 2} height={ext * 2} style={inner}>
          <defs>
            <mask id={`${uid}rb`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
              <image href={PLANET_RING_BACK_URI} width={ext * 2} height={ext * 2} preserveAspectRatio="none" transform={ringRot} />
            </mask>
          </defs>
          <rect width={ext * 2} height={ext * 2} fill={pc.ring} opacity={0.9} mask={`url(#${uid}rb)`} />
          <g mask={`url(#${uid}rb)`}>
            <rect x={ext} y={ext - pr * 0.95} width={ext} height={pr * 1.9} fill="#000000" opacity={0.85} transform={`rotate(${ringLight} ${ext} ${ext})`} />
          </g>
        </svg>
      )}
      <svg width={ext * 2} height={ext * 2} style={inner}>
        <defs>
          <mask id={`${uid}s`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
            <image href={PLANET_SURFACE_URIS[p.family]} x={t0} y={t0} width={tex} height={tex} preserveAspectRatio="none" transform={`rotate(${planetTilt(p.trackId)} ${ext} ${ext})`} />
          </mask>
        </defs>
        <circle cx={ext} cy={ext} r={pr * 0.995} fill={pc.dark} />
        <rect width={ext * 2} height={ext * 2} fill={pc.light} mask={`url(#${uid}s)`} />
      </svg>
      <div ref={lightRef} style={inner}>
        <svg width={ext * 2} height={ext * 2}>
          <defs>
            <mask id={`${uid}rim`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
              <image href={PLANET_RIM_URIS[phase]} x={t0} y={t0} width={tex} height={tex} preserveAspectRatio="none" />
            </mask>
            <mask id={`${uid}hl`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
              <image href={PLANET_HIGHLIGHT_URIS[phase]} x={t0} y={t0} width={tex} height={tex} preserveAspectRatio="none" />
            </mask>
            <mask id={`${uid}tw`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
              <image href={PLANET_TWILIGHT_URIS[phase]} x={t0} y={t0} width={tex} height={tex} preserveAspectRatio="none" />
            </mask>
          </defs>
          <image href={PLANET_SHADE_URIS[phase]} x={t0} y={t0} width={tex} height={tex} preserveAspectRatio="none" />
          <rect width={ext * 2} height={ext * 2} fill={lc.highlight} opacity={0.7} mask={`url(#${uid}hl)`} />
          <rect width={ext * 2} height={ext * 2} fill={PLANET_TWILIGHT_COLOR} opacity={0.12} mask={`url(#${uid}tw)`} />
          <rect width={ext * 2} height={ext * 2} fill={pc.rim} opacity={0.55} mask={`url(#${uid}rim)`} />
        </svg>
      </div>
      {p.ringed && (
        <svg width={ext * 2} height={ext * 2} style={inner}>
          <defs>
            <mask id={`${uid}rf`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
              <image href={PLANET_RING_FRONT_URI} width={ext * 2} height={ext * 2} preserveAspectRatio="none" transform={ringRot} />
            </mask>
          </defs>
          <rect width={ext * 2} height={ext * 2} fill={pc.ring} opacity={0.9} mask={`url(#${uid}rf)`} />
        </svg>
      )}
      <div ref={sheenRef} style={inner}>
        <svg width={ext * 2} height={ext * 2}>
          <defs>
            <mask id={`${uid}sh`} maskUnits="userSpaceOnUse" x={0} y={0} width={ext * 2} height={ext * 2}>
              <image href={PLANET_SPECULAR_URIS[phase]} x={t0} y={t0} width={tex} height={tex} preserveAspectRatio="none" />
            </mask>
          </defs>
          <rect width={ext * 2} height={ext * 2} fill={lc.specular} opacity={sheenOpacity} mask={`url(#${uid}sh)`} />
        </svg>
      </div>
      {selected && <div className={styles.selRing} style={abs(box - pr * 1.35, box - pr * 1.35, pr * 2.7)} />}
      {burst > 0 && <div key={burst} className={styles.burst} style={{ ...abs(box - sphere.petalBaseR, box - sphere.petalBaseR, sphere.petalBaseR * 2), borderColor: p.moodColor }} />}
    </div>
  );
}
