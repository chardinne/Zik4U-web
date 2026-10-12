import {
  ARCHETYPE_LABELS,
  ARCHETYPE_VISUAL_PROFILE,
  DEFAULT_ARCHETYPE_PROFILE,
  CONSTELLATION_PALETTE,
  RARITY_THRESHOLDS,
  TAGLINE_FALLBACK,
} from '@/lib/cosmicCard';
import { CONSTELLATION_LABEL, fingerprintCaption, trackNumber } from '@/lib/listeningFingerprint';
import type { SharedCard, SharedTrack } from '@/lib/sharedCard';
import { ListenButton } from './ListenButton';
import { SillonDisc } from './SillonDisc';

// SHARE-KEY1 / WEB-PRIV1 part 2 — the full music card, rendered ONLY for a link that
// carries its owner's valid share key (data from getSharedCard). Pure rendering.
//
// DNA-SILLON site (decision 44 = A, 12/10/2026) — the mirror of the app's Music DNA card
// (planche of 12/10): the record (server-drawn empreinte), MY GROOVES, archetype, rarity,
// tagline, LAST PLAYED / ON REPEAT pills, A-side in bars, bio, then the store buttons.

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

export const SHARED_DISC_SIZE = 236;
const FOIL = 'linear-gradient(135deg, #C9B6FF, #7EE8FF, #FFC4EC, #FFE28A)';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
/** globals.css zooms the whole site by 1.25; the card keeps the app's proportions (planche of 12/10). */
export const CARD_ZOOM = 0.8;
const LABEL: React.CSSProperties = { fontFamily: MONO, fontSize: 9, letterSpacing: '1.5px', color: '#A78BFA' };

function Planet({ color, satellite }: { color: string; satellite?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 22,
        height: 22,
        margin: 7,
        borderRadius: '50%',
        flexShrink: 0,
        opacity: satellite ? 0.8 : 1,
        background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${color} 38%, #071226 100%)`,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
}

function TrackPill({ label, track, showArtist, color, satellite }: { label: string; track: SharedTrack; showArtist: boolean; color: string; satellite?: boolean }) {
  return (
    <ListenButton variant="pill" title={track.title} artist={track.artist}>
      <Planet color={color} satellite={satellite} />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '1.6px', color: '#8888BB' }}>{label}</span>
        <span style={{ fontSize: 13, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.title}
          {showArtist && <span style={{ color: '#8888BB' }}>{` · ${track.artist}`}</span>}
        </span>
      </span>
    </ListenButton>
  );
}

export function SharedFullCard({ card }: { card: SharedCard }) {
  const archetypeProfile =
    card.archetype && ARCHETYPE_VISUAL_PROFILE[card.archetype]
      ? ARCHETYPE_VISUAL_PROFILE[card.archetype]
      : DEFAULT_ARCHETYPE_PROFILE;
  const rim = archetypeProfile.primary;
  const displayName = card.displayName;
  const DEEP_LINK = `zik4u://profile/${encodeURIComponent(card.username)}`;
  const topCount = Math.max(1, ...card.topArtists.map((a) => a.play_count));

  const lastPlayedPill = card.lastPlayed ? (
    <TrackPill label="LAST PLAYED" track={card.lastPlayed} showArtist color={rim} />
  ) : null;

  return (
    <main style={{ zoom: CARD_ZOOM, minHeight: '125vh', backgroundColor: '#0A0A1A', color: '#F0F0FF', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 48px' }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>

        <section
          data-testid="sillon-card"
          style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #151033, #0E0C22)', border: '1px solid rgba(123,47,255,0.25)', borderRadius: 18, padding: '16px 16px 14px' }}
        >
          {/* ── Header + identity ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '2px', color: '#A78BFA' }}>MUSIC DNA</span>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '2px', color: '#8888BB' }}>zik4u</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, minWidth: 0 }}>
            {card.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.avatarUrl} alt={displayName} width={28} height={28} style={{ borderRadius: '50%', border: '2px solid rgba(0,212,255,0.4)', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #00D4FF', color: '#00D4FF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {card.username.charAt(0).toUpperCase()}
              </span>
            )}
            <span style={{ fontFamily: MONO, fontSize: 13, color: '#00D4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{card.username}</span>
          </div>

          {/* ── The record ────────────────────────────────────────────────── */}
          {card.fingerprint && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
              <SillonDisc fingerprint={card.fingerprint} size={SHARED_DISC_SIZE} rimColor={rim} username={card.username} />
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '2.2px', color: '#A78BFA', marginTop: 10, textAlign: 'center' }}>
                {fingerprintCaption(card.fingerprint.listens)}
              </span>
            </div>
          )}

          {card.isForming ? (
            /* ── Emerging identity (as the app: LAST PLAYED only) ─────────── */
            <>
              <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 32, lineHeight: '34px', letterSpacing: 1, textAlign: 'center', margin: '6px 0 0' }}>EMERGING IDENTITY</h1>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, margin: '10px 32px 0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round(Math.min(card.totalScrobbles / 20, 1) * 100)}%`, background: '#A78BFA', borderRadius: 2 }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#8888BB', textAlign: 'center', marginTop: 6, letterSpacing: '0.5px' }}>
                {card.totalScrobbles} / 20 tracks to unlock your full DNA
              </span>
              {lastPlayedPill && <div style={{ marginTop: 14 }}>{lastPlayedPill}</div>}
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 40, lineHeight: '42px', letterSpacing: 1, textAlign: 'center', margin: '6px 0 0', textShadow: `0 0 14px ${rim}` }}>
                {(ARCHETYPE_LABELS[card.archetype ?? ''] ?? card.archetype ?? '').toUpperCase()}
              </h1>

              {card.rarity !== 'common' && (
                <div style={{ textAlign: 'center', marginTop: 2 }}>
                  <span style={{ display: 'inline-block', background: FOIL, border: `1px solid ${RARITY_THRESHOLDS[card.rarity].color}`, borderRadius: 8, padding: '3px 8px', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#1A1033' }}>
                    {`${RARITY_THRESHOLDS[card.rarity].label.toUpperCase()} · TOP ${card.rarityPct}%`}
                  </span>
                </div>
              )}

              {(card.secondary || (card.showShift && card.archetypePrevious)) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 8, marginTop: 4, fontFamily: MONO, fontSize: 11, letterSpacing: '0.5px' }}>
                  {card.secondary && (
                    <span style={{ color: '#8888BB' }}>
                      also <span style={{ color: '#F0F0FF' }}>{(ARCHETYPE_LABELS[card.secondary.archetype] ?? card.secondary.archetype).toUpperCase()}</span>{' '}
                      {Math.round(card.secondary.confidence * 100)}%
                    </span>
                  )}
                  {card.showShift && card.archetypePrevious && (
                    <span style={{ color: '#FFB800' }}>shifting from {ARCHETYPE_LABELS[card.archetypePrevious] ?? card.archetypePrevious}</span>
                  )}
                </div>
              )}

              <p style={{ fontStyle: 'italic', fontSize: 13, lineHeight: '18px', opacity: 0.85, textAlign: 'center', margin: '8px 0 0' }}>
                &ldquo;{TAGLINE_FALLBACK}&rdquo;
              </p>

              {(lastPlayedPill || card.onRepeat) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                  {lastPlayedPill}
                  {card.onRepeat && (
                    <TrackPill label="ON REPEAT" track={card.onRepeat} showArtist={false} color={archetypeProfile.secondary} satellite />
                  )}
                </div>
              )}

              {card.topArtists.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
                  <span style={{ ...LABEL, marginBottom: 8 }}>{CONSTELLATION_LABEL}</span>
                  {card.topArtists.map((a, i) => {
                    const color = CONSTELLATION_PALETTE[i % CONSTELLATION_PALETTE.length];
                    const share = Math.max(0.04, a.play_count / topCount);
                    return (
                      <div key={a.artist_name} data-testid="sillon-track" style={{ marginBottom: 8 }}>
                        <ListenButton variant="row" artist={a.artist_name}>
                          <span style={{ fontFamily: MONO, fontSize: 11, color: '#555580', width: 18, flexShrink: 0 }}>{trackNumber(i)}</span>
                          <span style={{ width: '32%', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>{a.artist_name}</span>
                          <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <span style={{ display: 'block', height: '100%', width: `${Math.round(share * 100)}%`, borderRadius: 2, background: color, boxShadow: `0 0 6px ${color}` }} />
                          </span>
                          <span style={{ fontFamily: MONO, fontSize: 12, color: '#8888BB', minWidth: 28, textAlign: 'right', flexShrink: 0 }}>{a.play_count}</span>
                        </ListenButton>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── Bio ───────────────────────────────────────────────────────── */}
          {card.bioText && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 14, paddingTop: 12, borderTop: '1px dashed rgba(123,47,255,0.3)' }}>
              <span style={LABEL}>BIO</span>
              <span style={{ fontSize: 13, lineHeight: '18px', opacity: 0.9 }}>{card.bioText}</span>
            </div>
          )}

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: '#8888BB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>zik4u.com/@{card.username}</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#00FFB2', flexShrink: 0 }}>For real.</span>
          </div>
        </section>

        {/* ── CTA — unchanged ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 28 }}>
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
