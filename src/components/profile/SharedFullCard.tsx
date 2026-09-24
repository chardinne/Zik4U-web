import {
  ARCHETYPE_LABELS,
  ARCHETYPE_VISUAL_PROFILE,
  DEFAULT_ARCHETYPE_PROFILE,
  CONSTELLATION_PALETTE,
  RARITY_THRESHOLDS,
  TAGLINE_FALLBACK,
} from '@/lib/cosmicCard';
import type { SharedCard } from '@/lib/sharedCard';
import { ListenButton } from './ListenButton';
import { CelestialBody } from './CelestialBody';

// SHARE-KEY1 / WEB-PRIV1 part 2 — the full music card, rendered ONLY for a link that
// carries its owner's valid share key (data from getSharedCard). Pure rendering.

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

export function SharedFullCard({ card }: { card: SharedCard }) {
  const archetypeProfile =
    card.archetype && ARCHETYPE_VISUAL_PROFILE[card.archetype]
      ? ARCHETYPE_VISUAL_PROFILE[card.archetype]
      : DEFAULT_ARCHETYPE_PROFILE;
  const displayName = card.displayName;
  const DEEP_LINK = `zik4u://profile/${encodeURIComponent(card.username)}`;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A1A', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 48px' }}>
      <style>{`
        /* Responsive scale for celestial bodies — mobile-first.
           --cel-scale drives transform:scale() + marginBottom compensation in CelestialBody.
           Steps at natural breakpoints; clamp() used for gap below. */
        .cel-col { --cel-scale: 0.72; }
        @media (min-width: 400px) { .cel-col { --cel-scale: 0.85; } }
        @media (min-width: 600px) { .cel-col { --cel-scale: 1; } }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '2px', color: '#A78BFA', fontWeight: 600 }}>
            MUSIC DNA
          </span>
        </div>

        {/* ── Identity row ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          {card.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.avatarUrl}
              alt={displayName}
              width={28}
              height={28}
              style={{ borderRadius: '50%', border: '2px solid rgba(0,212,255,0.4)', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #FF3CAC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
              🎵
            </div>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#00D4FF', fontWeight: 600 }}>
            @{card.username}
          </span>
        </div>

        {/* ── Twin stars diptych — last played (emitting star) + on repeat (satellite) ── */}
        {/* gap uses clamp() for fluid spacing; cel-col drives --cel-scale for responsive body size */}
        {(card.lastPlayed || card.onRepeat) && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 'clamp(4px, 2vw, 16px)', marginBottom: 32, width: '100%' }}>
            {card.lastPlayed && (
              <div className="cel-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <ListenButton variant="sun" title={card.lastPlayed.title} artist={card.lastPlayed.artist}>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>LAST PLAYED</span>
                  <CelestialBody variant="star" color={archetypeProfile.primary} size={100} scaleVar="var(--cel-scale, 0.72)" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                    {card.lastPlayed.title}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
                    {card.lastPlayed.artist}
                  </span>
                </ListenButton>
              </div>
            )}
            {card.onRepeat && (
              <div className="cel-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <ListenButton variant="sun" title={card.onRepeat.title} artist={card.onRepeat.artist}>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>ON REPEAT</span>
                  <CelestialBody variant="satellite" color={archetypeProfile.secondary} size={76} scaleVar="var(--cel-scale, 0.72)" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
                    {card.onRepeat.title}
                  </span>
                </ListenButton>
              </div>
            )}
          </div>
        )}

        {/* ── FORMING state ───────────────────────────────────────────────── */}
        {card.isForming ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 28, textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 34, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>
              EMERGING IDENTITY
            </span>
            <div style={{ width: '100%', maxWidth: 280, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(card.totalScrobbles / 20, 1) * 100}%`,
                  background: `linear-gradient(90deg, ${archetypeProfile.secondary}, ${archetypeProfile.primary})`,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8888BB', letterSpacing: '0.5px' }}>
              {card.totalScrobbles} / 20 tracks to unlock your full DNA
            </span>
          </div>
        ) : (
          /* ── Normal state ──────────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>

            {/* Archetype hero */}
            <div>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 34,
                color: '#fff',
                letterSpacing: '0.05em',
                lineHeight: 1,
                textShadow: `0 0 12px ${archetypeProfile.primary}80`,
              }}>
                {ARCHETYPE_LABELS[card.archetype ?? ''] ?? card.archetype}
              </span>
            </div>

            {/* Archetype shift badge */}
            {card.showShift && card.archetypePrevious && (
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#FFB800', letterSpacing: '0.5px' }}>
                ↗ shifting from {ARCHETYPE_LABELS[card.archetypePrevious] ?? card.archetypePrevious}
              </span>
            )}

            {/* Rarity badge */}
            {card.rarity !== 'common' && (
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: RARITY_THRESHOLDS[card.rarity].color,
                  border: `1px solid ${RARITY_THRESHOLDS[card.rarity].color}`,
                  borderRadius: 999,
                  padding: '3px 10px',
                  letterSpacing: '0.5px',
                }}>
                  Top {card.rarityPct.toFixed(1)}% · {RARITY_THRESHOLDS[card.rarity].label}
                </span>
              </div>
            )}

            {/* Secondary archetype */}
            {card.secondary && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                also {ARCHETYPE_LABELS[card.secondary.archetype] ?? card.secondary.archetype}{' '}
                {Math.round(card.secondary.confidence * 100)}%
              </span>
            )}

            {/* Tagline */}
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.4 }}>
              &ldquo;{TAGLINE_FALLBACK}&rdquo;
            </span>

            {/* MY CONSTELLATION */}
            {card.topArtists.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>MY CONSTELLATION</span>
                {card.topArtists.map((a, i) => (
                  <div key={a.artist_name} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: CONSTELLATION_PALETTE[i % CONSTELLATION_PALETTE.length], flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.artist_name}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8888BB' }}>
                        {a.play_count}
                      </span>
                      <ListenButton variant="row" artist={a.artist_name} />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ── Bio ─────────────────────────────────────────────────────────── */}
        {card.bioText && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>BIO</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              {card.bioText}
            </span>
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingTop: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8888BB' }}>
            zik4u.com/@{card.username}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: archetypeProfile.primary }}>
            ZIK4U
          </span>
        </div>

        {/* ── CTA — unchanged from existing page ──────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
            Listen to what {displayName} hears
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Real music. Real identity. For real.
          </p>

          <a
            href={APP_STORE_URL}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#000', borderRadius: 14, padding: '14px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
          >
            <span style={{ fontSize: 22 }}>🍎</span>
            Download on the App Store
          </a>

          <a
            href={PLAY_STORE_URL}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(90deg, #00D4FF, #00FFB2)', color: '#0A0A1A', borderRadius: 14, padding: '14px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
          >
            <span style={{ fontSize: 22 }}>▶</span>
            Get it on Google Play
          </a>

          <a
            href={DEEP_LINK}
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginTop: 4 }}
          >
            Already have Zik4U? Open in app →
          </a>
        </div>

      </div>
    </main>
  );
}
