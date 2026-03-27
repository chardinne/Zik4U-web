'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg:     '#0A0A1A',
  card:   '#12122A',
  border: 'rgba(255,255,255,0.08)',
  cyan:   '#00D4FF',
  mint:   '#00FFB2',
  pink:   '#FF3CAC',
  purple: '#7B2FFF',
  text:   '#fff',
  muted:  'rgba(255,255,255,0.4)',
};

const MOOD_EMOJI: Record<string, string> = {
  nocturne:    '🌙',
  explorateur: '🌍',
  high_energy: '🔥',
  feel_good:   '☀️',
  melancolique:'💜',
  deep_focus:  '🌊',
  obsession:   '⚡',
};

const STORAGE_KEY = 'zik4u_partner_api_key';

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

type Screen = 'auth' | 'loading' | 'dashboard' | 'error';

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [screen, setScreen]       = useState<Screen>('auth');
  const [apiKey, setApiKey]       = useState('');
  const [keyInput, setKeyInput]   = useState('');
  const [keyError, setKeyError]   = useState('');
  const [partner, setPartner]     = useState<PartnerInfo | null>(null);
  const [leaderboard, setLeaderboard] = useState<ViralityArtist[]>([]);
  const [fetchError, setFetchError]   = useState('');
  const [period, setPeriod]       = useState<7 | 30 | 90>(30);
  const [artistQuery, setArtistQuery] = useState('');
  const [artistResult, setArtistResult] = useState<ArtistIntelligence | null>(null);
  const [artistLoading, setArtistLoading] = useState(false);
  const [artistError, setArtistError]     = useState('');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiQuota, setAiQuota] = useState<AIQuota | null>(null);

  const loadData = useCallback(async (key: string, days: number) => {
    setScreen('loading');
    setFetchError('');
    try {
      const headers = { 'x-zik4u-key': key };
      const [meRes, viralRes] = await Promise.all([
        fetch('/api/partner/me', { headers }),
        fetch(`/api/partner/intelligence/virality?limit=20`, { headers }),
      ]);
      if (!meRes.ok) {
        const body = await meRes.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Invalid API key');
      }
      const meData   = (await meRes.json()) as PartnerInfo;
      const virData  = viralRes.ok ? (await viralRes.json()) as { leaderboard: ViralityArtist[] } : { leaderboard: [] };
      setPartner(meData);
      setLeaderboard(virData.leaderboard ?? []);
      setScreen('dashboard');
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Unknown error');
      setScreen('error');
    }
  }, []);

  // Auto-load from localStorage on mount
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setApiKey(saved);
      void loadData(saved, period);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuth = () => {
    const trimmed = keyInput.trim();
    if (!trimmed.startsWith('zik4u_live_')) {
      setKeyError('Invalid format — key must start with zik4u_live_');
      return;
    }
    setKeyError('');
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    void loadData(trimmed, period);
  };

  const handlePeriodChange = (p: 7 | 30 | 90) => {
    setPeriod(p);
    void loadData(apiKey, p);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setPartner(null);
    setLeaderboard([]);
    setArtistResult(null);
    setScreen('auth');
  };

  const handleArtistSearch = async () => {
    const q = artistQuery.trim();
    if (!q) return;
    setArtistLoading(true);
    setArtistError('');
    setArtistResult(null);
    try {
      const res = await fetch(
        `/api/partner/intelligence/artist?artist=${encodeURIComponent(q)}&days=${period}`,
        { headers: { 'x-zik4u-key': apiKey } },
      );
      const body = await res.json() as ArtistIntelligence & { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Error');
      setArtistResult(body);
    } catch (err) {
      setArtistError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setArtistLoading(false);
    }
  };

  const AI_SUGGESTIONS = [
    'Which artist on the leaderboard has the highest pre-viral potential right now?',
    'What does a Deep Feeler audience mean for live event strategy?',
    'Which artists should we be watching based on discovery velocity?',
    "How does nocturnal listening pattern affect an artist's fanbase loyalty?",
    'What crossover opportunities exist in the current leaderboard?',
  ];

  const sendAIQuestion = async (question?: string) => {
    const q = (question ?? aiInput).trim();
    if (!q || aiLoading) return;

    const userMsg: AIMessage = { role: 'user', content: q, timestamp: Date.now() };
    const newHistory = [...aiMessages, userMsg];
    setAiMessages(newHistory);
    setAiInput('');
    setAiLoading(true);
    setAiError('');

    try {
      const res = await fetch('/api/partner/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zik4u-key': apiKey,
        },
        body: JSON.stringify({
          question: q,
          history: newHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json() as { answer?: string; error?: string; quota?: AIQuota; upgrade_url?: string };

      if (!res.ok) {
        setAiError((data.error ?? 'Error') + (data.upgrade_url ? ' → zik4u.com/partner' : ''));
      } else {
        const assistantMsg: AIMessage = {
          role: 'assistant',
          content: data.answer ?? '',
          timestamp: Date.now(),
        };
        setAiMessages([...newHistory, assistantMsg]);
        if (data.quota) setAiQuota(data.quota);
      }
    } catch {
      setAiError('Connection error. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const planLabel = (plan: string | undefined) => {
    const map: Record<string, string> = {
      discover:     'Discover',
      insight:      'Insight',
      intelligence: 'Intelligence',
      enterprise:   'Enterprise',
    };
    return map[plan ?? ''] ?? (plan ?? '—');
  };

  const planColor = (plan: string | undefined) => {
    if (plan === 'intelligence' || plan === 'enterprise') return C.mint;
    if (plan === 'insight') return C.cyan;
    return C.purple;
  };

  /* ─── Auth screen ─── */
  if (screen === 'auth') return (
    <div style={{
      minHeight: '100vh', backgroundColor: C.bg, color: C.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, padding: 32,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20,
      }}>
        <button onClick={() => router.push('/')} style={{
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', border: 'none', fontSize: 20,
          fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif', padding: 0,
          marginBottom: 24, display: 'block',
        }}>
          ZIK4U
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Partner Dashboard
        </h1>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>
          Enter your API key to access live intelligence data.
        </p>
        <input
          value={keyInput}
          onChange={e => { setKeyInput(e.target.value); setKeyError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          placeholder="zik4u_live_..."
          style={{
            width: '100%', boxSizing: 'border-box' as const,
            background: '#0A0A1A', border: `1px solid ${keyError ? C.pink : C.border}`,
            borderRadius: 10, padding: '12px 14px', color: C.text,
            fontSize: 14, outline: 'none', marginBottom: keyError ? 6 : 16,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />
        {keyError && (
          <p style={{ color: C.pink, fontSize: 12, marginBottom: 16 }}>{keyError}</p>
        )}
        <button onClick={handleAuth} style={{
          width: '100%',
          background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
          border: 'none', borderRadius: 10, padding: '13px',
          color: '#0A0A1A', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Access dashboard →
        </button>
        <p style={{ textAlign: 'center' as const, marginTop: 16, fontSize: 12, color: C.muted }}>
          No API key?{' '}
          <button onClick={() => router.push('/partner')} style={{
            background: 'none', border: 'none', color: C.cyan,
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Request partner access →
          </button>
        </p>
      </div>
    </div>
  );

  /* ─── Loading screen ─── */
  if (screen === 'loading') return (
    <div style={{
      minHeight: '100vh', backgroundColor: C.bg, color: C.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column' as const, gap: 16,
    }}>
      <div style={{ fontSize: 32 }}>📡</div>
      <p style={{ color: C.muted, fontSize: 14 }}>Loading intelligence data…</p>
    </div>
  );

  /* ─── Error screen ─── */
  if (screen === 'error') return (
    <div style={{
      minHeight: '100vh', backgroundColor: C.bg, color: C.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column' as const, gap: 16,
    }}>
      <div style={{ fontSize: 32 }}>⚠️</div>
      <p style={{ color: C.pink, fontSize: 14 }}>{fetchError}</p>
      <button onClick={handleSignOut} style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: '8px 20px', color: C.text,
        fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        Try a different key
      </button>
    </div>
  );

  /* ─── Dashboard ─── */
  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sticky nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px', borderBottom: `1px solid ${C.border}`,
        position: 'sticky' as const, top: 0, background: C.bg, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')} style={{
            background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', border: 'none', fontSize: 18,
            fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif', padding: 0,
          }}>
            ZIK4U
          </button>
          <span style={{
            fontSize: 11, color: C.muted, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            borderLeft: `1px solid ${C.border}`, paddingLeft: 16,
          }}>
            {partner?.company_name ?? 'Partner Dashboard'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 11,
            background: `${planColor(partner?.plan)}15`,
            border: `1px solid ${planColor(partner?.plan)}40`,
            borderRadius: 20, padding: '3px 12px',
            color: planColor(partner?.plan),
          }}>
            {planLabel(partner?.plan)}
          </span>
          <button onClick={handleSignOut} style={{
            background: 'none', border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '6px 14px', color: C.muted,
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px' }}>

        {/* Header + period filter */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24,
          flexWrap: 'wrap' as const, gap: 12,
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>🔥 Virality Intelligence</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {([7, 30, 90] as const).map(p => (
              <button key={p} onClick={() => handlePeriodChange(p)} style={{
                background: period === p ? C.cyan : C.card,
                color:      period === p ? '#0A0A1A' : C.text,
                border:     `1px solid ${period === p ? C.cyan : C.border}`,
                borderRadius: 8, padding: '6px 14px',
                fontSize: 13, fontWeight: period === p ? 700 : 400,
                cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                transition: 'all 0.15s',
              }}>
                {p}d
              </button>
            ))}
          </div>
        </div>

        {/* Virality leaderboard */}
        {leaderboard.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
            {leaderboard.map((artist, i) => (
              <div key={artist.artist_name} style={{
                background:   artist.is_pre_viral ? `${C.mint}08` : C.card,
                border:       `1px solid ${artist.is_pre_viral ? C.mint : C.border}`,
                borderRadius: 12, padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '28px 1fr 80px 120px 100px 130px',
                alignItems: 'center', gap: 16,
              }}>
                <span style={{ color: C.muted, fontWeight: 700, fontSize: 13 }}>
                  #{i + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {artist.is_pre_viral && <span style={{ color: C.mint, marginRight: 6 }}>⚡</span>}
                    {artist.artist_name}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {artist.dominant_mood ? `${MOOD_EMOJI[artist.dominant_mood] ?? '🎵'} ${artist.dominant_mood}` : '🎵 —'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{
                    fontSize: 20, fontWeight: 900,
                    color: artist.virality_score >= 0.7 ? C.mint : C.cyan,
                  }}>
                    {Math.round(artist.virality_score * 100)}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>virality</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontWeight: 700 }}>{artist.unique_listeners.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>listeners</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  {artist.growth_pct !== null ? (
                    <>
                      <div style={{
                        fontWeight: 700,
                        color: artist.growth_pct > 0 ? C.mint : artist.growth_pct < 0 ? C.pink : C.muted,
                      }}>
                        {artist.growth_pct > 0 ? '+' : ''}{Math.round(artist.growth_pct)}%
                      </div>
                      <div style={{ fontSize: 10, color: C.muted }}>growth</div>
                    </>
                  ) : (
                    <span style={{ color: C.muted, fontSize: 12 }}>—</span>
                  )}
                </div>
                <button
                  onClick={() => { setArtistQuery(artist.artist_name); void (async () => {
                    setArtistLoading(true);
                    setArtistError('');
                    setArtistResult(null);
                    try {
                      const res = await fetch(
                        `/api/partner/intelligence/artist?artist=${encodeURIComponent(artist.artist_name)}&days=${period}`,
                        { headers: { 'x-zik4u-key': apiKey } },
                      );
                      const body = await res.json() as ArtistIntelligence & { error?: string };
                      if (!res.ok) throw new Error(body.error ?? 'Error');
                      setArtistResult(body);
                    } catch (err) {
                      setArtistError(err instanceof Error ? err.message : 'Unknown error');
                    } finally {
                      setArtistLoading(false);
                    }
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  })(); }}
                  style={{
                    background: 'none', border: `1px solid ${C.border}`,
                    borderRadius: 8, padding: '6px 12px',
                    color: C.cyan, fontSize: 12, cursor: 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                  Full profile →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: 32, textAlign: 'center' as const,
            color: C.muted, fontSize: 14, marginBottom: 40,
          }}>
            No virality data yet for this period.
          </div>
        )}

        {/* Artist deep-dive search */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 24, marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
            🔍 Artist Deep Dive
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={artistQuery}
              onChange={e => setArtistQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && void handleArtistSearch()}
              placeholder="Search an artist name…"
              style={{
                flex: 1, background: '#0A0A1A',
                border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '11px 14px', color: C.text,
                fontSize: 14, outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
            <button
              onClick={() => void handleArtistSearch()}
              disabled={artistLoading || !artistQuery.trim()}
              style={{
                background: artistLoading ? C.card : `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
                border: 'none', borderRadius: 10, padding: '11px 20px',
                color: artistLoading ? C.muted : '#0A0A1A',
                fontSize: 14, fontWeight: 700, cursor: artistLoading ? 'default' : 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'nowrap' as const,
              }}>
              {artistLoading ? 'Loading…' : 'Analyze →'}
            </button>
          </div>

          {artistError && (
            <p style={{ color: C.pink, fontSize: 13, marginTop: 12 }}>{artistError}</p>
          )}

          {artistResult && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                    {artistResult.dominant_mood
                      ? `${MOOD_EMOJI[artistResult.dominant_mood] ?? '🎵'} `
                      : '🎵 '}
                    {artistResult.artist_name}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>
                    Last {artistResult.days} days
                    {artistResult.dominant_mood ? ` · ${artistResult.dominant_mood}` : ''}
                    {artistResult.is_pre_viral ? ' · ⚡ Pre-viral signal' : ''}
                  </p>
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
              }}>
                {[
                  { label: 'Total Scrobbles', value: artistResult.total_scrobbles.toLocaleString(), color: C.cyan },
                  { label: 'Unique Listeners', value: artistResult.unique_listeners.toLocaleString(), color: C.mint },
                  {
                    label: 'Peak Hour',
                    value: artistResult.peak_hour !== null
                      ? `${artistResult.peak_hour}:00`
                      : '—',
                    color: C.text,
                  },
                  {
                    label: 'Repeat Rate',
                    value: artistResult.avg_repeat_rate !== null
                      ? `${(artistResult.avg_repeat_rate * 100).toFixed(0)}%`
                      : '—',
                    color: C.pink,
                  },
                ].map(kpi => (
                  <div key={kpi.label} style={{
                    background: '#0A0A1A', border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: '14px 16px',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color }}>
                      {kpi.value}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── AI Analyst ─────────────────────────────────────────── */}
        <div style={{
          background: C.card,
          border: `1px solid rgba(123,47,255,0.25)`,
          borderRadius: 20,
          overflow: 'hidden',
          marginTop: 24,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: `1px solid rgba(123,47,255,0.15)`,
            background: 'rgba(123,47,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🧠</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>AI Analyst</div>
                <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em' }}>
                  Ask anything about the data — powered by Claude
                </div>
              </div>
            </div>
            {aiQuota && (
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: aiQuota.unlimited ? C.mint :
                  (aiQuota.remaining ?? 0) <= 5 ? C.pink : C.muted,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 20, padding: '4px 12px',
                border: `1px solid rgba(255,255,255,0.08)`,
              }}>
                {aiQuota.unlimited ? '∞ unlimited' :
                  `${aiQuota.remaining} / ${aiQuota.limit} questions left`}
              </div>
            )}
          </div>

          {/* Plan sans accès IA */}
          {partner?.plan === 'discover' ? (
            <div style={{ padding: 32, textAlign: 'center' as const }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>AI Analyst requires Insight or Intelligence</div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
                Ask unlimited questions to an AI trained on Zik4U data. Get actionable insights in seconds.
              </div>
              <button
                onClick={() => router.push('/partner')}
                style={{
                  background: `linear-gradient(135deg, #7B2FFF, #FF3CAC)`,
                  border: 'none', borderRadius: 10, padding: '10px 24px',
                  color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Upgrade to unlock →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' as const }}>

              {/* Messages */}
              {aiMessages.length === 0 ? (
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                    Suggested questions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                    {AI_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => void sendAIQuestion(s)}
                        style={{
                          background: 'rgba(123,47,255,0.06)',
                          border: '1px solid rgba(123,47,255,0.15)',
                          borderRadius: 8, padding: '10px 14px',
                          color: 'rgba(255,255,255,0.7)', fontSize: 13,
                          cursor: 'pointer', textAlign: 'left' as const,
                          fontFamily: 'Inter, system-ui, sans-serif',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(123,47,255,0.4)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(123,47,255,0.15)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ maxHeight: 420, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                  {aiMessages.map((msg, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      gap: 10, alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #00D4FF, #00FFB2)'
                          : 'linear-gradient(135deg, #7B2FFF, #FF3CAC)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                      }}>
                        {msg.role === 'user' ? 'You' : 'AI'}
                      </div>
                      <div style={{
                        maxWidth: '80%',
                        background: msg.role === 'user'
                          ? 'rgba(0,212,255,0.08)'
                          : 'rgba(123,47,255,0.08)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.15)' : 'rgba(123,47,255,0.15)'}`,
                        borderRadius: 12, padding: '10px 14px',
                        fontSize: 13, lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.85)',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7B2FFF, #FF3CAC)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                      }}>AI</div>
                      <div style={{
                        background: 'rgba(123,47,255,0.08)',
                        border: '1px solid rgba(123,47,255,0.15)',
                        borderRadius: 12, padding: '12px 16px',
                      }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[0, 1, 2].map(dot => (
                            <div key={dot} style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: '#7B2FFF',
                              animation: `aiPulse 1.2s ease-in-out ${dot * 0.2}s infinite`,
                            }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {aiError && (
                <div style={{
                  margin: '0 24px 12px',
                  padding: '10px 14px',
                  background: 'rgba(255,60,172,0.08)',
                  border: '1px solid rgba(255,60,172,0.2)',
                  borderRadius: 8, fontSize: 13, color: C.pink,
                }}>
                  {aiError}
                </div>
              )}

              {/* Input */}
              <div style={{
                display: 'flex', gap: 8, padding: '12px 16px',
                borderTop: `1px solid rgba(255,255,255,0.05)`,
              }}>
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && void sendAIQuestion()}
                  placeholder="Ask about an artist, an audience, a trend..."
                  disabled={aiLoading}
                  style={{
                    flex: 1, background: '#0A0A1A',
                    border: '1px solid rgba(123,47,255,0.2)',
                    borderRadius: 10, padding: '10px 14px',
                    color: '#fff', fontSize: 13, outline: 'none',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    opacity: aiLoading ? 0.6 : 1,
                  }}
                />
                <button
                  onClick={() => void sendAIQuestion()}
                  disabled={aiLoading || !aiInput.trim()}
                  style={{
                    background: aiLoading || !aiInput.trim()
                      ? 'rgba(123,47,255,0.2)'
                      : 'linear-gradient(135deg, #7B2FFF, #FF3CAC)',
                    border: 'none', borderRadius: 10, padding: '10px 16px',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    cursor: aiLoading || !aiInput.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'all 0.2s',
                  }}
                >
                  {aiLoading ? '...' : '→'}
                </button>
              </div>

              <style>{`
                @keyframes aiPulse {
                  0%, 100% { opacity: 0.3; transform: scale(0.8); }
                  50% { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
