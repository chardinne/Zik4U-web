'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       '#07070F',
  surface:  '#0E0E1C',
  card:     '#13132A',
  border:   'rgba(255,255,255,0.07)',
  borderHi: 'rgba(255,255,255,0.14)',
  cyan:     '#00D4FF',
  mint:     '#00FFB2',
  pink:     '#FF3CAC',
  purple:   '#7B2FFF',
  gold:     '#FFB800',
  text:     '#FFFFFF',
  muted:    'rgba(255,255,255,0.38)',
  dim:      'rgba(255,255,255,0.18)',
};

const MOOD_EMOJI: Record<string, string> = {
  nocturne: '🌙', explorateur: '🌍', high_energy: '🔥',
  feel_good: '☀️', melancolique: '💜', deep_focus: '🌊', obsession: '⚡',
};

const STORAGE_KEY    = 'zik4u_partner_api_key';
const WATCHLIST_KEY  = 'zik4u_watchlist';
const AI_HISTORY_KEY = 'zik4u_ai_history';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PartnerInfo {
  company_name: string;
  contact_name: string;
  plan: string;
  subscription_status: string;
  current_period_end: string | null;
  billing_period: string | null;
  approved_at: string | null;
  payment_activated: boolean;
}

interface ViralityArtist {
  artist_name: string;
  virality_score: number;
  unique_listeners: number;
  dominant_mood: string | null;
  growth_pct: number | null;
  is_pre_viral: boolean;
}

interface ArtistIntelligence {
  artist_name: string;
  days: number;
  total_scrobbles: number;
  unique_listeners: number;
  dominant_mood: string | null;
  peak_hour: number | null;
  avg_repeat_rate: number | null;
  is_pre_viral?: boolean;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIQuota {
  used: number;
  limit: number;
  unlimited: boolean;
  remaining: number | null;
}

type Section = 'overview' | 'virality' | 'artists' | 'ai' | 'account';
type Screen  = 'auth' | 'loading' | 'dashboard' | 'error';

// ── Helpers ───────────────────────────────────────────────────────────────────
function planColor(plan?: string) {
  if (plan === 'intelligence') return C.purple;
  if (plan === 'enterprise')   return C.pink;
  if (plan === 'insight')      return C.mint;
  return C.cyan;
}

function planLabel(plan?: string) {
  const m: Record<string, string> = {
    discover: 'Discover', insight: 'Insight',
    intelligence: 'Intelligence', enterprise: 'Enterprise',
  };
  return m[plan ?? ''] ?? (plan ?? '—');
}

function formatHour(h: number | null) {
  if (h === null) return '—';
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:00 ${suffix}`;
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
function AuthScreen({
  onAuth, error, loading,
}: {
  onAuth: (key: string) => void;
  error: string;
  loading: boolean;
}) {
  const [input, setInput] = useState('');
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{
          fontSize: 22, fontWeight: 900, letterSpacing: '0.2em',
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 40,
        }}>ZIK4U</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, color: C.text }}>
          Intelligence Dashboard
        </h1>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Enter your API key to access real-time music intelligence data.
        </p>
        {error && (
          <div style={{
            background: 'rgba(255,60,172,0.08)', border: '1px solid rgba(255,60,172,0.25)',
            borderRadius: 10, padding: '11px 16px', marginBottom: 16,
            fontSize: 13, color: C.pink,
          }}>{error}</div>
        )}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAuth(input)}
          placeholder="zik4u_live_..."
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '13px 16px', color: C.text,
            fontSize: 14, outline: 'none', marginBottom: 10,
            fontFamily: 'monospace', letterSpacing: '0.05em',
          }}
        />
        <button
          onClick={() => onAuth(input)}
          disabled={loading || !input.trim()}
          style={{
            width: '100%', padding: 14, borderRadius: 10, border: 'none',
            background: loading ? C.surface : `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            color: loading ? C.muted : '#07070F', fontWeight: 700, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif', transition: 'all 0.2s',
          }}
        >
          {loading ? 'Connecting...' : 'Access dashboard →'}
        </button>
        <p style={{ color: C.dim, fontSize: 12, marginTop: 16, textAlign: 'center' }}>
          Don't have a key?{' '}
          <a href="/partner" style={{ color: C.cyan, textDecoration: 'none' }}>
            Get partner access →
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  section, onNav, partner, onSignOut,
}: {
  section: Section;
  onNav: (s: Section) => void;
  partner: PartnerInfo | null;
  onSignOut: () => void;
}) {
  const nav = [
    { id: 'overview' as Section, icon: '◈', label: 'Overview'    },
    { id: 'virality' as Section, icon: '🔥', label: 'Virality'   },
    { id: 'artists'  as Section, icon: '🎵', label: 'Artists'    },
    { id: 'ai'       as Section, icon: '🧠', label: 'AI Analyst' },
    { id: 'account'  as Section, icon: '⚙', label: 'Account'    },
  ];
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: C.surface, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px' }}>
        <a href="/" style={{
          fontSize: 17, fontWeight: 900, letterSpacing: '0.2em',
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textDecoration: 'none', display: 'block',
        }}>ZIK4U</a>
        <div style={{
          fontSize: 9, letterSpacing: '0.15em', color: C.muted,
          textTransform: 'uppercase', marginTop: 4,
        }}>Intelligence</div>
      </div>

      {/* Company */}
      {partner && (
        <div style={{
          margin: '0 12px 16px', padding: '10px 12px',
          background: C.card, borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>
            {partner.company_name}
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: planColor(partner.plan),
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {planLabel(partner.plan)}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 8px' }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, border: 'none',
            background: section === item.id ? `${planColor(partner?.plan)}12` : 'transparent',
            color: section === item.id ? planColor(partner?.plan) : C.muted,
            fontSize: 13, fontWeight: section === item.id ? 700 : 400,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderLeft: section === item.id
              ? `2px solid ${planColor(partner?.plan)}`
              : '2px solid transparent',
            transition: 'all 0.15s',
            marginBottom: 2,
          }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px 8px 20px' }}>
        <button onClick={onSignOut} style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: `1px solid ${C.border}`, background: 'transparent',
          color: C.dim, fontSize: 12, cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'left',
        }}>
          ← Sign out
        </button>
      </div>
    </aside>
  );
}

// ── Section : Overview ────────────────────────────────────────────────────────
function OverviewSection({
  partner, leaderboard, watchlist, onNav, onArtistSelect,
}: {
  partner: PartnerInfo | null;
  leaderboard: ViralityArtist[];
  watchlist: string[];
  onNav: (s: Section) => void;
  onArtistSelect: (name: string) => void;
}) {
  const preViral    = leaderboard.filter(a => a.is_pre_viral);
  const topMover    = leaderboard.reduce<ViralityArtist | null>((best, a) =>
    !best || (a.growth_pct ?? 0) > (best.growth_pct ?? 0) ? a : best, null);
  const watchedArtists = leaderboard.filter(a => watchlist.includes(a.artist_name));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: C.text }}>
        Good morning, {partner?.contact_name?.split(' ')[0] ?? 'Partner'}.
      </h1>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>
        Here's what's happening in your music landscape today.
      </p>

      {/* Signal cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14, marginBottom: 32,
      }}>
        {[
          {
            label: 'Pre-viral signals',
            value: preViral.length.toString(),
            sub: preViral.length > 0 ? preViral[0].artist_name : 'None detected',
            color: C.mint,
            icon: '⚡',
            action: () => onNav('virality'),
          },
          {
            label: 'Top mover this week',
            value: topMover ? `+${Math.round(topMover.growth_pct ?? 0)}%` : '—',
            sub: topMover?.artist_name ?? 'No data',
            color: C.cyan,
            icon: '🚀',
            action: () => topMover && onArtistSelect(topMover.artist_name),
          },
          {
            label: 'Artists tracked',
            value: leaderboard.length.toString(),
            sub: 'On the leaderboard',
            color: C.purple,
            icon: '📊',
            action: () => onNav('virality'),
          },
          {
            label: 'Watchlist',
            value: watchlist.length.toString(),
            sub: watchlist.length > 0 ? `${watchlist[0]} + ${watchlist.length - 1} more` : 'No artists watched',
            color: C.gold,
            icon: '⭐',
            action: () => onNav('artists'),
          },
        ].map(card => (
          <div
            key={card.label}
            onClick={card.action}
            style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderTop: `2px solid ${card.color}`,
              borderRadius: 12, padding: '20px',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = card.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ fontSize: 20, marginBottom: 10 }}>{card.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: card.color, marginBottom: 4 }}>
              {card.value}
            </div>
            <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 12, color: C.dim }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Watchlist spotlight */}
      {watchedArtists.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            color: C.gold, textTransform: 'uppercase', marginBottom: 14,
          }}>
            ⭐ Your Watchlist
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {watchedArtists.map(a => (
              <div key={a.artist_name}
                onClick={() => onArtistSelect(a.artist_name)}
                style={{
                  background: `${C.gold}06`, border: `1px solid ${C.gold}20`,
                  borderRadius: 10, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  cursor: 'pointer',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>
                    {a.is_pre_viral && <span style={{ color: C.mint, marginRight: 6 }}>⚡</span>}
                    {a.artist_name}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {MOOD_EMOJI[a.dominant_mood ?? ''] ?? '🎵'} {a.dominant_mood ?? '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.mint }}>
                    {Math.round(a.virality_score * 100)}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>virality</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
      }}>
        {[
          { label: '🔥 View full leaderboard', section: 'virality' as Section },
          { label: '🎵 Analyze an artist', section: 'artists' as Section },
          { label: '🧠 Ask AI Analyst', section: 'ai' as Section },
        ].map(a => (
          <button key={a.label} onClick={() => onNav(a.section)} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '9px 16px',
            color: C.text, fontSize: 13, cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHi)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section : Virality ────────────────────────────────────────────────────────
function VitalitySection({
  leaderboard, watchlist, onToggleWatch, onArtistSelect, period, onPeriodChange, loading,
}: {
  leaderboard: ViralityArtist[];
  watchlist: string[];
  onToggleWatch: (name: string) => void;
  onArtistSelect: (name: string) => void;
  period: 7 | 30 | 90;
  onPeriodChange: (p: 7 | 30 | 90) => void;
  loading: boolean;
}) {
  const [filter, setFilter] = useState<'all' | 'pre_viral'>('all');
  const [sortBy, setSortBy] = useState<'virality' | 'growth' | 'listeners'>('virality');

  const filtered = leaderboard
    .filter(a => filter === 'all' || a.is_pre_viral)
    .sort((a, b) => {
      if (sortBy === 'growth')    return (b.growth_pct ?? 0) - (a.growth_pct ?? 0);
      if (sortBy === 'listeners') return b.unique_listeners - a.unique_listeners;
      return b.virality_score - a.virality_score;
    });

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>🔥 Virality Leaderboard</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Period */}
          {([7, 30, 90] as const).map(p => (
            <button key={p} onClick={() => onPeriodChange(p)} style={{
              background: period === p ? C.cyan : C.card,
              color: period === p ? '#07070F' : C.text,
              border: `1px solid ${period === p ? C.cyan : C.border}`,
              borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
            }}>{p}d</button>
          ))}
          <div style={{ width: 1, background: C.border }} />
          {/* Filter */}
          <button onClick={() => setFilter(f => f === 'all' ? 'pre_viral' : 'all')} style={{
            background: filter === 'pre_viral' ? `${C.mint}18` : C.card,
            color: filter === 'pre_viral' ? C.mint : C.muted,
            border: `1px solid ${filter === 'pre_viral' ? C.mint : C.border}`,
            borderRadius: 7, padding: '6px 12px', fontSize: 12,
            cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
          }}>⚡ Pre-viral only</button>
          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 7, padding: '6px 12px', color: C.text,
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
            outline: 'none',
          }}>
            <option value="virality">Sort: Virality</option>
            <option value="growth">Sort: Growth</option>
            <option value="listeners">Sort: Listeners</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: C.muted }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 32, textAlign: 'center', color: C.muted,
        }}>No artists found for this filter.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((artist, i) => (
            <div key={artist.artist_name} style={{
              background: artist.is_pre_viral ? `${C.mint}06` : C.card,
              border: `1px solid ${artist.is_pre_viral ? `${C.mint}30` : C.border}`,
              borderRadius: 10, padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: '24px 1fr 70px 100px 90px 80px 36px',
              alignItems: 'center', gap: 14,
              transition: 'border-color 0.15s',
              cursor: 'pointer',
            }}
              onClick={() => onArtistSelect(artist.artist_name)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHi)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = artist.is_pre_viral ? `${C.mint}30` : C.border)}
            >
              <span style={{ color: C.dim, fontSize: 12, fontWeight: 700 }}>#{i + 1}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {artist.is_pre_viral && <span style={{ color: C.mint, marginRight: 5 }}>⚡</span>}
                  {artist.artist_name}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                  {MOOD_EMOJI[artist.dominant_mood ?? ''] ?? '🎵'} {artist.dominant_mood ?? '—'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: artist.virality_score >= 0.7 ? C.mint : C.cyan }}>
                  {Math.round(artist.virality_score * 100)}
                </div>
                <div style={{ fontSize: 9, color: C.muted }}>VIRALITY</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{artist.unique_listeners.toLocaleString()}</div>
                <div style={{ fontSize: 9, color: C.muted }}>LISTENERS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                {artist.growth_pct !== null ? (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 13, color: artist.growth_pct > 0 ? C.mint : artist.growth_pct < 0 ? C.pink : C.muted }}>
                      {artist.growth_pct > 0 ? '+' : ''}{Math.round(artist.growth_pct)}%
                    </div>
                    <div style={{ fontSize: 9, color: C.muted }}>GROWTH</div>
                  </>
                ) : <span style={{ color: C.dim }}>—</span>}
              </div>
              <button
                onClick={e => { e.stopPropagation(); onArtistSelect(artist.artist_name); }}
                style={{
                  background: 'none', border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: '5px 10px',
                  color: C.cyan, fontSize: 11, cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  whiteSpace: 'nowrap',
                }}>
                Profile
              </button>
              <button
                onClick={e => { e.stopPropagation(); onToggleWatch(artist.artist_name); }}
                title={watchlist.includes(artist.artist_name) ? 'Remove from watchlist' : 'Add to watchlist'}
                style={{
                  background: watchlist.includes(artist.artist_name) ? `${C.gold}15` : 'transparent',
                  border: `1px solid ${watchlist.includes(artist.artist_name) ? C.gold : C.border}`,
                  borderRadius: 6, padding: '5px 8px',
                  color: watchlist.includes(artist.artist_name) ? C.gold : C.dim,
                  fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                ⭐
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section : Artists ─────────────────────────────────────────────────────────
function ArtistsSection({
  apiKey, period, watchlist, onToggleWatch,
}: {
  apiKey: string;
  period: 7 | 30 | 90;
  watchlist: string[];
  onToggleWatch: (name: string) => void;
}) {
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState<ArtistIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      setQuery(name);
      void search(name);
    };
    window.addEventListener('zik4u:artist-select', handler);
    return () => window.removeEventListener('zik4u:artist-select', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async (q?: string) => {
    const name = (q ?? query).trim();
    if (!name) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await fetch(
        `/api/partner/intelligence/artist?artist=${encodeURIComponent(name)}&days=${period}`,
        { headers: { 'x-zik4u-key': apiKey } },
      );
      const body = await res.json() as ArtistIntelligence & { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Error');
      setResult(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  // Listen for artist-select events from other sections
  useEffect(() => {
    const handler = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (name) { setQuery(name); void search(name); }
    };
    window.addEventListener('zik4u:artist-select', handler);
    return () => window.removeEventListener('zik4u:artist-select', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, color: C.text }}>
        🎵 Artist Intelligence
      </h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && void search()}
          placeholder="Artist name..."
          autoFocus
          style={{
            flex: 1, background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '12px 16px', color: C.text,
            fontSize: 14, outline: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />
        <button
          onClick={() => void search()}
          disabled={loading || !query.trim()}
          style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            border: 'none', borderRadius: 10, padding: '12px 24px',
            color: '#07070F', fontWeight: 700, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze →'}
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255,60,172,0.08)', border: '1px solid rgba(255,60,172,0.2)',
          borderRadius: 8, padding: '11px 16px', marginBottom: 16, fontSize: 13, color: C.pink,
        }}>{error}</div>
      )}

      {result && (
        <div>
          {/* Artist header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 24, flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>
                {MOOD_EMOJI[result.dominant_mood ?? ''] ?? '🎵'} {result.artist_name}
                {result.is_pre_viral && (
                  <span style={{ fontSize: 14, color: C.mint, marginLeft: 10, fontWeight: 700 }}>
                    ⚡ Pre-viral
                  </span>
                )}
              </h3>
              <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>
                Last {result.days} days
                {result.dominant_mood ? ` · ${result.dominant_mood}` : ''}
              </p>
            </div>
            <button
              onClick={() => onToggleWatch(result.artist_name)}
              style={{
                background: watchlist.includes(result.artist_name) ? `${C.gold}15` : C.card,
                border: `1px solid ${watchlist.includes(result.artist_name) ? C.gold : C.border}`,
                borderRadius: 8, padding: '8px 16px',
                color: watchlist.includes(result.artist_name) ? C.gold : C.muted,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {watchlist.includes(result.artist_name) ? '⭐ Watching' : '☆ Watch artist'}
            </button>
          </div>

          {/* KPIs */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: 'Total Scrobbles',  value: result.total_scrobbles.toLocaleString(), color: C.cyan  },
              { label: 'Unique Listeners', value: result.unique_listeners.toLocaleString(), color: C.mint  },
              { label: 'Peak Hour',        value: formatHour(result.peak_hour),             color: C.purple },
              { label: 'Repeat Rate',      value: result.avg_repeat_rate !== null ? `${(result.avg_repeat_rate * 100).toFixed(0)}%` : '—', color: C.pink },
            ].map(kpi => (
              <div key={kpi.label} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '18px 20px',
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: kpi.color, marginBottom: 6 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          {/* Interpretation */}
          <div style={{
            background: `${C.purple}08`, border: `1px solid ${C.purple}20`,
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🧠 Quick read
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>
              {result.total_scrobbles === 0
                ? `${result.artist_name} has no data for this period. They may be too new or not yet discovered on Zik4U.`
                : `${result.artist_name} has ${result.unique_listeners.toLocaleString()} unique listeners over the last ${result.days} days. ${
                    result.is_pre_viral ? 'A pre-viral signal has been detected — accelerating discovery.' : ''
                  } Peak listening at ${formatHour(result.peak_hour)}${
                    result.peak_hour !== null && (result.peak_hour >= 22 || result.peak_hour < 4)
                      ? ' — a nocturnal audience, ideal for late-night content and dark-ambient positioning.'
                      : '.'
                  } ${
                    result.avg_repeat_rate !== null && result.avg_repeat_rate > 0.4
                      ? `${(result.avg_repeat_rate * 100).toFixed(0)}% repeat rate signals strong compulsive listening — high fan loyalty potential.`
                      : ''
                  }`
              }
            </p>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎵</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Search any artist</div>
          <div style={{ fontSize: 13 }}>Get emotional profile, virality score, listener data and more.</div>
        </div>
      )}
    </div>
  );
}

// ── Section : AI Analyst ──────────────────────────────────────────────────────
function AISection({
  apiKey, partner,
}: {
  apiKey: string;
  partner: PartnerInfo | null;
}) {
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    try {
      const saved = localStorage.getItem(AI_HISTORY_KEY);
      return saved ? JSON.parse(saved) as AIMessage[] : [];
    } catch { return []; }
  });
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [quota, setQuota]     = useState<AIQuota | null>(null);
  const scrollRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(messages.slice(-50)));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const SUGGESTIONS = [
    // Questions universelles (Discover)
    'Which artist on the leaderboard has the highest pre-viral potential right now?',
    'What does a Deep Feeler audience mean for live event and sync licensing strategy?',
    // Questions émotionnelles (Insight+)
    'What is the platform mood right now and what does it mean for release timing?',
    'Which artists have the strongest emotional resonance based on repeat rate and session depth?',
    'Compare the behavioral archetypes of the top 3 artists — which audience is most monetizable?',
    // Questions synchronicité (Intelligence+)
    'Which rare synchronicities detected in the last 6 hours represent the strongest signing signals?',
    'What artists are other labels currently researching that we should be watching too?',
    'Which artists are generating live listening sessions — what does that say about their community strength?',
    // Questions stratégiques
    'Based on First Heard data, which artist has the fastest discovery chain on the platform?',
    'Which artists generate the most Echo responses — who triggers musical conversations?',
  ];

  const send = async (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || loading) return;

    const userMsg: AIMessage = { role: 'user', content: question, timestamp: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/partner/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-zik4u-key': apiKey },
        body: JSON.stringify({
          question,
          history: history.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json() as { answer?: string; error?: string; quota?: AIQuota };
      if (!res.ok) {
        setError(data.error ?? 'Error');
      } else {
        setMessages(h => [...h, { role: 'assistant', content: data.answer ?? '', timestamp: Date.now() }]);
        if (data.quota) setQuota(data.quota);
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(AI_HISTORY_KEY);
  };

  const hasAI = partner?.plan !== 'discover';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>🧠 AI Analyst</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>
            Powered by Claude · Trained on Zik4U data
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {quota && (
            <span style={{
              fontSize: 11, fontWeight: 600, borderRadius: 20,
              padding: '4px 12px', border: `1px solid rgba(255,255,255,0.1)`,
              color: quota.unlimited ? C.mint : (quota.remaining ?? 0) <= 10 ? C.pink : C.muted,
              background: 'rgba(255,255,255,0.04)',
            }}>
              {quota.unlimited ? '∞ unlimited' : `${quota.remaining}/${quota.limit} left this month`}
            </span>
          )}
          {messages.length > 0 && (
            <button onClick={clearHistory} style={{
              background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 7, padding: '5px 12px',
              color: C.dim, fontSize: 12, cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>Clear history</button>
          )}
        </div>
      </div>

      {!hasAI ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16, textAlign: 'center',
          background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 40 }}>🔒</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>AI Analyst requires Insight or above</div>
          <div style={{ color: C.muted, fontSize: 13, maxWidth: 360 }}>
            Ask unlimited questions about your artists, audiences and trends. Powered by Claude.
          </div>
          <a href="/partner" style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
            borderRadius: 10, padding: '10px 24px', color: '#fff',
            fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}>Upgrade to unlock →</a>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: C.card, borderRadius: 16,
          border: `1px solid rgba(123,47,255,0.2)`, overflow: 'hidden',
        }}>
          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {messages.length === 0 ? (
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  color: C.muted, textTransform: 'uppercase', marginBottom: 14,
                }}>
                  Suggested questions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => void send(s)} style={{
                      background: 'rgba(123,47,255,0.06)',
                      border: '1px solid rgba(123,47,255,0.14)',
                      borderRadius: 9, padding: '11px 16px',
                      color: 'rgba(255,255,255,0.65)', fontSize: 13,
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      lineHeight: 1.5, transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(123,47,255,0.4)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(123,47,255,0.14)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                      }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: 10, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'user'
                      ? `linear-gradient(135deg, ${C.cyan}, ${C.mint})`
                      : `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div style={{
                    maxWidth: '78%',
                    background: msg.role === 'user'
                      ? 'rgba(0,212,255,0.07)' : 'rgba(123,47,255,0.07)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.12)' : 'rgba(123,47,255,0.12)'}`,
                    borderRadius: 12, padding: '11px 15px',
                    fontSize: 13, lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.82)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                }}>AI</div>
                <div style={{
                  background: 'rgba(123,47,255,0.07)',
                  border: '1px solid rgba(123,47,255,0.12)',
                  borderRadius: 12, padding: '14px 18px',
                }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[0, 1, 2].map(d => (
                      <div key={d} style={{
                        width: 7, height: 7, borderRadius: '50%', background: C.purple,
                        animation: `aiPulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              margin: '0 16px 10px', padding: '10px 14px',
              background: 'rgba(255,60,172,0.07)',
              border: '1px solid rgba(255,60,172,0.2)',
              borderRadius: 8, fontSize: 13, color: C.pink,
            }}>{error}</div>
          )}

          {/* Input */}
          <div style={{
            display: 'flex', gap: 8, padding: '12px 16px',
            borderTop: `1px solid rgba(255,255,255,0.05)`,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && void send()}
              placeholder="Ask about an artist, audience, trend or strategy..."
              disabled={loading}
              style={{
                flex: 1, background: '#07070F',
                border: `1px solid rgba(123,47,255,0.18)`,
                borderRadius: 9, padding: '10px 14px',
                color: C.text, fontSize: 13, outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                opacity: loading ? 0.6 : 1,
              }}
            />
            <button
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? 'rgba(123,47,255,0.15)'
                  : `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
                border: 'none', borderRadius: 9, padding: '10px 18px',
                color: '#fff', fontWeight: 700, fontSize: 13,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {loading ? '...' : '→'}
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes aiPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Section : Account ─────────────────────────────────────────────────────────
function AccountSection({
  partner, onSignOut,
}: {
  partner: PartnerInfo | null;
  onSignOut: () => void;
}) {
  if (!partner) return null;
  const periodEnd = partner.current_period_end
    ? new Date(partner.current_period_end).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div style={{ maxWidth: 540 }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: C.text }}>⚙ Account</h2>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 28, marginBottom: 16,
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Company</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{partner.company_name}</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Contact</div>
          <div style={{ fontWeight: 600 }}>{partner.contact_name}</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Plan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontWeight: 700, fontSize: 15, color: planColor(partner.plan),
            }}>{planLabel(partner.plan)}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              color: partner.subscription_status === 'active' ? C.mint : C.pink,
              background: partner.subscription_status === 'active' ? `${C.mint}10` : `${C.pink}10`,
              borderRadius: 20, padding: '2px 10px',
              border: `1px solid ${partner.subscription_status === 'active' ? `${C.mint}30` : `${C.pink}30`}`,
              textTransform: 'uppercase',
            }}>
              {partner.subscription_status}
            </span>
          </div>
        </div>
        {periodEnd && (
          <div>
            <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Next renewal</div>
            <div style={{ fontWeight: 600 }}>{periodEnd}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <a href="/partner" style={{
          background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
          borderRadius: 8, padding: '10px 20px',
          color: '#07070F', fontWeight: 700, fontSize: 13,
          textDecoration: 'none',
        }}>Upgrade plan →</a>
        <button onClick={onSignOut} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '10px 20px',
          color: C.muted, fontSize: 13, cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>Sign out</button>
      </div>
      <p style={{ color: C.dim, fontSize: 12, marginTop: 20 }}>
        Questions? Contact us at{' '}
        <a href="mailto:partner@zik4u.com" style={{ color: C.cyan, textDecoration: 'none' }}>
          partner@zik4u.com
        </a>
      </p>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function PartnerDashboardPage() {
  const router  = useRouter();
  const [screen, setScreen]       = useState<Screen>('auth');
  const [apiKey, setApiKey]       = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [partner, setPartner]     = useState<PartnerInfo | null>(null);
  const [leaderboard, setLeaderboard] = useState<ViralityArtist[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [period, setPeriod]       = useState<7 | 30 | 90>(30);
  const [section, setSection]     = useState<Section>('overview');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? '[]') as string[]; }
    catch { return []; }
  });

  const saveWatchlist = (list: string[]) => {
    setWatchlist(list);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  };

  const toggleWatch = (name: string) => {
    saveWatchlist(
      watchlist.includes(name) ? watchlist.filter(n => n !== name) : [...watchlist, name]
    );
  };

  const loadData = useCallback(async (key: string, days: number) => {
    setDataLoading(true);
    try {
      const headers = { 'x-zik4u-key': key };
      const [meRes, virRes] = await Promise.all([
        fetch('/api/partner/me', { headers }),
        fetch(`/api/partner/intelligence/virality?limit=20`, { headers }),
      ]);
      if (!meRes.ok) {
        const b = await meRes.json().catch(() => ({})) as { error?: string };
        throw new Error(b.error ?? 'Invalid API key');
      }
      const me  = await meRes.json() as PartnerInfo;
      const vir = virRes.ok ? (await virRes.json() as { leaderboard: ViralityArtist[] }) : { leaderboard: [] };
      setPartner(me);
      setLeaderboard(vir.leaderboard ?? []);
      setScreen('dashboard');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Error');
      setScreen('error');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) { setApiKey(saved); void loadData(saved, period); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuth = async (key: string) => {
    const trimmed = key.trim();
    if (!trimmed.startsWith('zik4u_live_')) {
      setAuthError('Invalid format — key must start with zik4u_live_');
      return;
    }
    setAuthError('');
    setAuthLoading(true);
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    await loadData(trimmed, period);
    setAuthLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(''); setPartner(null); setLeaderboard([]);
    setSection('overview'); setScreen('auth');
  };

  const handleArtistSelect = (name: string) => {
    setSection('artists');
    setTimeout(() => {
      const event = new CustomEvent('zik4u:artist-select', { detail: name });
      window.dispatchEvent(event);
    }, 50);
  };

  // Suppress unused import warning
  void router;

  // Screens
  if (screen === 'auth' || screen === 'error') {
    return (
      <AuthScreen
        onAuth={handleAuth}
        error={authError}
        loading={authLoading}
      />
    );
  }

  if (screen === 'loading' || (dataLoading && !partner)) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: C.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `2px solid ${C.cyan}`, borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <div style={{ color: C.muted, fontSize: 14 }}>Loading intelligence data...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      backgroundColor: C.bg, color: C.text,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <Sidebar
        section={section}
        onNav={setSection}
        partner={partner}
        onSignOut={handleSignOut}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
        {section === 'overview' && (
          <OverviewSection
            partner={partner}
            leaderboard={leaderboard}
            watchlist={watchlist}
            onNav={setSection}
            onArtistSelect={handleArtistSelect}
          />
        )}
        {section === 'virality' && (
          <VitalitySection
            leaderboard={leaderboard}
            watchlist={watchlist}
            onToggleWatch={toggleWatch}
            onArtistSelect={handleArtistSelect}
            period={period}
            onPeriodChange={p => { setPeriod(p); void loadData(apiKey, p); }}
            loading={dataLoading}
          />
        )}
        {section === 'artists' && (
          <ArtistsSection
            apiKey={apiKey}
            period={period}
            watchlist={watchlist}
            onToggleWatch={toggleWatch}
          />
        )}
        {section === 'ai' && (
          <AISection apiKey={apiKey} partner={partner} />
        )}
        {section === 'account' && (
          <AccountSection partner={partner} onSignOut={handleSignOut} />
        )}
      </main>
    </div>
  );
}
