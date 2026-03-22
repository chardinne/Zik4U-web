'use client';

import { useState } from 'react';
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

const DEMO_ARTISTS = [
  { name: 'Artist X', score: 87, mood: 'nocturne',     listeners: 2847, growth: 34,  pre_viral: true  },
  { name: 'Artist Y', score: 74, mood: 'explorateur',  listeners: 1820, growth: 18,  pre_viral: false },
  { name: 'Artist Z', score: 61, mood: 'feel_good',    listeners: 890,  growth: 8,   pre_viral: false },
  { name: 'Artist W', score: 55, mood: 'melancolique', listeners: 650,  growth: -3,  pre_viral: false },
  { name: 'Artist V', score: 71, mood: 'obsession',    listeners: 1200, growth: 22,  pre_viral: false },
];

const MOOD_EMOJI: Record<string, string> = {
  nocturne: '🌙', explorateur: '🌍', high_energy: '🔥',
  feel_good: '☀️', melancolique: '💜', deep_focus: '🌊',
  obsession: '⚡',
};

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [query,  setQuery]  = useState('');
  const [period, setPeriod] = useState<7 | 30 | 90>(30);

  const filtered = DEMO_ARTISTS.filter(a =>
    !query || a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg,
      color: C.text, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: `1px solid ${C.border}`,
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
            Partner Dashboard — Demo
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 11, background: `${C.cyan}15`,
            border: `1px solid ${C.cyan}30`,
            borderRadius: 20, padding: '3px 12px', color: C.cyan,
          }}>
            Discover Plan
          </span>
          <button onClick={() => router.push('/partner')} style={{
            background: 'none', border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '6px 14px', color: C.muted,
            fontSize: 12, cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Upgrade
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px' }}>

        {/* Demo banner */}
        <div style={{
          background: `${C.purple}10`, border: `1px solid ${C.purple}30`,
          borderRadius: 12, padding: '14px 20px', marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 13,
        }}>
          <span style={{ color: C.muted }}>
            📊 This is a{' '}
            <strong style={{ color: C.text }}>demo dashboard</strong>{' '}
            with sample data. Real data will be available when your access is activated.
          </span>
          <button onClick={() => router.push('/partner')} style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            border: 'none', borderRadius: 8, padding: '6px 16px',
            color: '#0A0A1A', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
            whiteSpace: 'nowrap' as const,
          }}>
            Activate access →
          </button>
        </div>

        {/* Header + controls */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24,
          flexWrap: 'wrap' as const, gap: 12,
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 900 }}>🔥 Virality Intelligence</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {([7, 30, 90] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                background: period === p ? C.cyan : C.card,
                color:      period === p ? '#0A0A1A' : C.text,
                border:     `1px solid ${period === p ? C.cyan : C.border}`,
                borderRadius: 8, padding: '6px 14px',
                fontSize: 13, fontWeight: period === p ? 700 : 400,
                cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                {p}d
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search an artist..."
          style={{
            width: '100%', boxSizing: 'border-box' as const,
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '12px 16px', color: C.text,
            fontSize: 15, outline: 'none', marginBottom: 16,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />

        {/* Artists table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((artist, i) => (
            <div key={artist.name} style={{
              background:   artist.pre_viral ? `${C.mint}08` : C.card,
              border:       `1px solid ${artist.pre_viral ? C.mint : C.border}`,
              borderRadius: 12, padding: '16px 20px',
              display:      'grid',
              gridTemplateColumns: '28px 1fr 80px 110px 100px 120px',
              alignItems:   'center', gap: 16,
            }}>
              <span style={{ color: C.muted, fontWeight: 700, fontSize: 13 }}>
                #{i + 1}
              </span>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {artist.pre_viral && <span style={{ color: C.mint, marginRight: 6 }}>⚡</span>}
                  {artist.name}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                  {MOOD_EMOJI[artist.mood] ?? '🎵'} {artist.mood}
                </div>
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 20, fontWeight: 900,
                  color: artist.score >= 70 ? C.mint : C.cyan }}>
                  {artist.score}
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>virality</div>
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontWeight: 700 }}>{artist.listeners.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: C.muted }}>listeners</div>
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontWeight: 700,
                  color: artist.growth > 0 ? C.mint : artist.growth < 0 ? C.pink : C.muted }}>
                  {artist.growth > 0 ? '+' : ''}{artist.growth}%
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>growth</div>
              </div>
              <button onClick={() => router.push('/partner')} style={{
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

        {/* Upgrade CTA */}
        <div style={{
          marginTop: 40, textAlign: 'center' as const,
          padding: '40px', background: C.card,
          border: `1px solid ${C.purple}30`, borderRadius: 20,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Ready for real data?
          </h3>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>
            Activate your access to see live virality scores,
            emotional profiles, crossover maps and first-heard data.
          </p>
          <button onClick={() => router.push('/partner')} style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            border: 'none', borderRadius: 12, padding: '14px 32px',
            color: '#0A0A1A', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Activate partner access →
          </button>
        </div>
      </div>
    </div>
  );
}
