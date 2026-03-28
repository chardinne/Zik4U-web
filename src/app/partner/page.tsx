'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// ── Constants ─────────────────────────────────────────────────────────────────

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
  dim:    'rgba(255,255,255,0.15)',
};

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_REPORT = {
  artist:              'Artist X',
  period_days:         30,
  total_listeners:     2847,
  listener_growth_pct: 34,
  new_listeners_7d:    412,
  momentum: { score_7d: 34, label: 'ACCELERATING' },
  peak_listening_hour_label: '11 PM',
  peak_day:            'Sunday',
  dominant_mood:       'nocturne',
  emotional_intensity: { score: 81, label: 'VERY HIGH — deeply emotional audience' },
  repeat_rate_pct:     45,
  loyalty: { score: 67, label: 'HIGH — solid retention', retained_30_60d: 71, retained_60_90d: 63 },
  virality: { score: 87, is_pre_viral: true, growth_velocity: 34 },
  first_heard: { date: '2026-01-12T14:23:00Z', track: 'Midnight Bloom', source: 'spotify' },
  audience_segmentation: [
    { archetype_id: 'night_explorer', archetype_label: 'Night Explorer', archetype_emoji: '🌙', count: 1138, pct: 40 },
    { archetype_id: 'deep_feeler',    archetype_label: 'Deep Feeler',    archetype_emoji: '💜', count: 797,  pct: 28 },
    { archetype_id: 'obsessive_fan',  archetype_label: 'Obsessive Fan',  archetype_emoji: '🔥', count: 512,  pct: 18 },
    { archetype_id: 'cultural_nomad', archetype_label: 'Cultural Nomad', archetype_emoji: '🌍', count: 400,  pct: 14 },
  ],
  crossover_artists: [
    { artist: 'Artist Y', crossover_pct: 73 },
    { artist: 'Artist Z', crossover_pct: 61 },
    { artist: 'Artist W', crossover_pct: 48 },
  ],
  key_insights: [
    '🔥 Pre-viral signal detected — virality score 87/100',
    '💜 Deeply emotional audience — high engagement for live events',
    '🔄 45% of listeners play compulsively — strong addiction signal',
    '🌙 Peak listening at 23:00 — ideal for late-night playlist placement',
    '🔗 73% of listeners also listen to Artist Y — crossover potential',
    '⚡ 412 new discoverers in the last 7 days (68% of all-time) — viral acceleration',
    '🔥 42% of fans have reached a streak milestone — exceptional dedication',
  ],
  discovery_velocity: {
    total_new_discoverers:       847,
    new_discoverers_7d:          412,
    discovery_acceleration_pct:  68,
    dominant_source:             'spotify',
    sources_breakdown: {
      spotify: 510, apple_music: 240, deezer: 97,
    },
    velocity_label: 'ACCELERATING — majority of discoveries in last 7 days',
  },
  fan_engagement_depth: {
    streak_engagement_pct:    42,
    fans_with_streak_milestone: 1196,
    streak_milestones_breakdown: { '7': 680, '30': 420, '100': 87, '365': 9 },
    avg_achievements_per_fan:  2.3,
    total_achievements_unlocked: 6551,
    achievements_by_rarity: { common: 4200, rare: 1800, epic: 450, legendary: 101 },
    engagement_depth_label: 'DEEP — highly dedicated fanbase, above-average platform engagement',
  },
  mood_journey: {
    top_transitions: [
      { transition: 'nocturne → high_energy', count: 312, pct: 38 },
      { transition: 'deep_focus → feel_good', count: 198, pct: 24 },
      { transition: 'melancolique → nocturne', count: 156, pct: 19 },
    ],
    peak_transition_day:   'Friday',
    total_mood_changes:    820,
    avg_emotional_score:   74,
    avg_exploration_index: 62,
    exploration_label: 'BALANCED — mix of new and familiar music',
  },
  audience_demographics: {
    opt_in_count:  891,
    opt_in_pct:    31,
    status_breakdown:     { single: 534, open: 178, taken: 179 },
    status_breakdown_pct: { single: 60, open: 20, taken: 20 },
    note: 'Based on users who explicitly opted in.',
  },
};

// ── Pricing ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id:       'discover',
    name:     'Discover',
    price:    'Free',
    period:   '3 months',
    desc:     'Prove the value before you commit.',
    color:    C.cyan,
    features: [
      '1 artist profile per week',
      'Virality score + momentum',
      'Basic mood distribution',
      'Peak listening hour + day',
      '30-day window',
    ],
    cta:       'Start free',
    highlight: false,
  },
  {
    id:       'insight',
    name:     'Insight',
    price:    '$699',
    period:   '/month · $6,990/year',
    desc:     'For independent labels and A&R teams.',
    color:    C.mint,
    features: [
      'Unlimited artist profiles',
      'Virality leaderboard (top 100)',
      'Emotional intensity score',
      'Listener archetypes (7 profiles)',
      'Loyalty retention (30/60/90d)',
      'Discovery velocity',
      'Fan engagement depth',
      'Crossover artists map',
      'CSV + JSON export',
      '90-day historical window',
      '🧠 AI Analyst — 100 questions/month',
    ],
    cta:       'Get Insight',
    highlight: false,
  },
  {
    id:       'intelligence',
    name:     'Intelligence',
    price:    '$1,999',
    period:   '/month · $19,990/year',
    desc:     'For major labels and streaming platforms.',
    color:    C.purple,
    features: [
      'Everything in Insight',
      'First Heard data (discovery priority)',
      'Mood journey & emotional transitions',
      'Audience demographics (opt-in)',
      'Weekly automated report',
      'Real-time virality alerts',
      'Artist comparison tool',
      'Priority API access',
      'Custom date ranges (365d)',
      'Dedicated onboarding',
      'SLA + NDA',
      '🧠 AI Analyst — 300 questions/month',
    ],
    cta:       'Get Intelligence',
    highlight: true,
  },
  {
    id:       'enterprise',
    name:     'Enterprise',
    price:    'Custom',
    period:   '',
    desc:     'For DSPs, brands and research institutions.',
    color:    C.pink,
    features: [
      'Everything in Intelligence',
      'Raw data API (streaming)',
      'Emotional dataset export (research)',
      'Custom archetype models',
      'White-label reports',
      'Wellbeing & research data',
      'SLA + NDA',
      'Dedicated analyst',
      '🧠 AI Analyst — unlimited',
    ],
    cta:       'Contact us',
    highlight: false,
  },
];

// ── ROI Calculator ────────────────────────────────────────────────────────────

function ROICalculator() {
  const [dealSize, setDealSize]       = useState(100000);
  const [dealsPerYear, setDealsPerYear] = useState(3);

  const annualCostInsight       = 6990;
  const annualCostIntelligence  = 19990;
  const annualRevenue           = dealSize * dealsPerYear;
  const roiInsight       = Math.round(((annualRevenue * 0.15 - annualCostInsight)      / annualCostInsight)      * 100);
  const roiIntelligence  = Math.round(((annualRevenue * 0.25 - annualCostIntelligence) / annualCostIntelligence) * 100);

  return (
    <div style={{
      background: C.card,
      border:     `1px solid ${C.purple}33`,
      borderRadius: 20,
      padding:    40,
      maxWidth:   640,
      margin:     '0 auto',
    }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>ROI Calculator</h3>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
        Estimate your return based on signing deals with artists discovered via Zik4U Intelligence.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase' as const,
            letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
            Average deal value (USD)
          </label>
          <input type="range" min={10000} max={1000000} step={10000}
            value={dealSize} onChange={e => setDealSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.purple }} />
          <div style={{ textAlign: 'center' as const, fontSize: 24, fontWeight: 900, color: C.purple, marginTop: 4 }}>
            ${dealSize.toLocaleString()}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase' as const,
            letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
            Deals signed per year using Zik4U data
          </label>
          <input type="range" min={1} max={20} step={1}
            value={dealsPerYear} onChange={e => setDealsPerYear(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.cyan }} />
          <div style={{ textAlign: 'center' as const, fontSize: 24, fontWeight: 900, color: C.cyan, marginTop: 4 }}>
            {dealsPerYear} deal{dealsPerYear > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { plan: 'Insight',       cost: annualCostInsight,      roi: roiInsight,      color: C.mint   },
          { plan: 'Intelligence',  cost: annualCostIntelligence, roi: roiIntelligence, color: C.purple },
        ].map(item => (
          <div key={item.plan} style={{
            background:   `${item.color}10`,
            border:       `1px solid ${item.color}33`,
            borderRadius: 12, padding: 20,
            textAlign:    'center' as const,
          }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{item.plan}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Annual cost: ${item.cost.toLocaleString()}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: item.color, margin: '8px 0' }}>
              {item.roi > 0 ? '+' : ''}{item.roi}%
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>estimated ROI</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: C.muted, marginTop: 12,
        textAlign: 'center' as const, fontStyle: 'italic' }}>
        Based on finding 15–25% more deals via early signal detection. Results vary.
      </p>
    </div>
  );
}

// ── Demo Report Card ──────────────────────────────────────────────────────────

function DemoReportCard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'insights' | 'engagement'>('overview');
  const d = DEMO_REPORT;

  const tabs = [
    { id: 'overview',   label: 'Overview'     },
    { id: 'audience',   label: 'Audience'     },
    { id: 'insights',   label: 'Key Insights' },
    { id: 'engagement', label: 'Engagement'   },
  ] as const;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.mint}33`,
      borderRadius: 20, overflow: 'hidden', maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.purple}33, ${C.cyan}11)`,
        padding: '24px 28px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.1em',
              textTransform: 'uppercase' as const }}>
              Sample Intelligence Report · Demo Data
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{d.artist}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Last {d.period_days} days · Generated by Zik4U Intelligence
            </div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ background: `linear-gradient(135deg, ${C.mint}, ${C.cyan})`,
              color: '#0A0A1A', borderRadius: 8, padding: '6px 14px',
              fontSize: 13, fontWeight: 700 }}>
              ⚡ {d.virality?.score}/100 Virality
            </div>
            <div style={{ fontSize: 11, color: C.mint, marginTop: 4 }}>PRE-VIRAL SIGNAL</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '14px', background: 'none', border: 'none',
            borderBottom: activeTab === t.id ? `2px solid ${C.cyan}` : '2px solid transparent',
            color: activeTab === t.id ? C.cyan : C.muted,
            fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400,
            cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Listeners',        value: d.total_listeners.toLocaleString(), sub: `+${d.listener_growth_pct}% vs prev period`, color: C.cyan },
              { label: 'New this week',    value: d.new_listeners_7d.toString(),      sub: `Momentum: ${d.momentum.label}`,            color: C.mint },
              { label: 'Peak time',        value: d.peak_listening_hour_label,        sub: d.peak_day,                                  color: C.purple },
              { label: 'Repeat rate',      value: `${d.repeat_rate_pct}%`,            sub: 'Compulsive listeners (3+ plays)',           color: C.pink },
              { label: 'Emotional score',  value: `${d.emotional_intensity.score}/100`, sub: 'Very high intensity',                    color: '#FFB800' },
              { label: 'Loyalty (90d)',    value: `${d.loyalty.score}%`,              sub: 'Listener retention',                        color: C.mint },
            ].map(kpi => (
              <div key={kpi.label} style={{
                background: `${kpi.color}08`, border: `1px solid ${kpi.color}22`,
                borderRadius: 10, padding: '14px', textAlign: 'center' as const,
              }}>
                <div style={{ fontSize: 10, color: C.muted,
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color, margin: '6px 0' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>{kpi.sub}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
                Listener Archetypes
              </div>
              {d.audience_segmentation.map(seg => (
                <div key={seg.archetype_id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{seg.archetype_emoji} {seg.archetype_label}</span>
                    <span style={{ fontSize: 12, color: C.cyan, fontWeight: 700 }}>{seg.pct}%</span>
                  </div>
                  <div style={{ background: '#1A1A35', borderRadius: 4, height: 6 }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${seg.pct}%`,
                      background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})` }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
                Crossover Artists
              </div>
              {d.crossover_artists.map(co => (
                <div key={co.artist} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13,
                }}>
                  <span>{co.artist}</span>
                  <span style={{ color: C.mint, fontWeight: 700 }}>
                    {co.crossover_pct}% of listeners
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.key_insights.map((insight, i) => (
              <div key={i} style={{
                background: `${C.purple}08`, border: `1px solid ${C.purple}22`,
                borderRadius: 10, padding: '14px 16px', fontSize: 13,
                lineHeight: 1.5, color: 'rgba(255,255,255,0.8)',
              }}>
                {insight}
              </div>
            ))}
            <div style={{
              marginTop: 8, padding: '14px 16px',
              background: `${C.mint}08`, border: `1px solid ${C.mint}22`,
              borderRadius: 10, fontSize: 12, color: C.muted, fontStyle: 'italic',
            }}>
              🏆 First heard on Zik4U:{' '}
              <strong style={{ color: C.mint }}>
                {new Date(d.first_heard.date).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </strong>
              {' '}— 6 weeks before chart entry.
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Section 1 — Discovery Velocity */}
            <div>
              <div style={{ fontSize: 12, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
                Discovery Velocity
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: `${C.cyan}08`, border: `1px solid ${C.cyan}22`,
                  borderRadius: 10, padding: '14px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                    Total Discoverers
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan, margin: '6px 0' }}>
                    {d.discovery_velocity.total_new_discoverers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>
                    {d.discovery_velocity.velocity_label.split(' — ')[0]}
                  </div>
                </div>
                <div style={{ background: `${C.mint}08`, border: `1px solid ${C.mint}22`,
                  borderRadius: 10, padding: '14px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                    Last 7 Days
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.mint, margin: '6px 0' }}>
                    {d.discovery_velocity.new_discoverers_7d}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>
                    {d.discovery_velocity.discovery_acceleration_pct}% of all-time
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
                Discovery Sources
              </div>
              {Object.entries(d.discovery_velocity.sources_breakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => {
                  const total = d.discovery_velocity.total_new_discoverers;
                  const pct   = Math.round((count / total) * 100);
                  return (
                    <div key={source} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, textTransform: 'capitalize' as const }}>
                          {source.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 12, color: C.cyan, fontWeight: 700 }}>
                          {count.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div style={{ background: '#1A1A35', borderRadius: 4, height: 6 }}>
                        <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`,
                          background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})` }} />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Section 2 — Fan Engagement */}
            <div>
              <div style={{ fontSize: 12, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
                Fan Engagement Depth
              </div>
              <div style={{ background: `${C.pink}08`, border: `1px solid ${C.pink}22`,
                borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Engagement depth</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.pink }}>
                  {d.fan_engagement_depth.engagement_depth_label}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}22`,
                  borderRadius: 10, padding: '14px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                    Streak Engagement
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.purple, margin: '6px 0' }}>
                    {d.fan_engagement_depth.streak_engagement_pct}%
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>fans hit a streak milestone</div>
                </div>
                <div style={{ background: `${C.mint}08`, border: `1px solid ${C.mint}22`,
                  borderRadius: 10, padding: '14px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                    Avg Achievements
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.mint, margin: '6px 0' }}>
                    {d.fan_engagement_depth.avg_achievements_per_fan}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>per fan</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
                Streak Milestones Reached
              </div>
              {Object.entries(d.fan_engagement_depth.streak_milestones_breakdown)
                .map(([days_label, count]) => {
                  const max = Math.max(...Object.values(d.fan_engagement_depth.streak_milestones_breakdown));
                  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
                  return (
                    <div key={days_label} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12 }}>🔥 {days_label}-day streak</span>
                        <span style={{ fontSize: 12, color: C.purple, fontWeight: 700 }}>
                          {count.toLocaleString()} fans
                        </span>
                      </div>
                      <div style={{ background: '#1A1A35', borderRadius: 4, height: 6 }}>
                        <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`,
                          background: `linear-gradient(90deg, ${C.purple}, ${C.pink})` }} />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Section 3 — Mood Journey */}
            <div>
              <div style={{ fontSize: 12, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
                Mood Journey
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: `${C.cyan}08`, border: `1px solid ${C.cyan}22`,
                  borderRadius: 10, padding: '14px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                    Exploration Index
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan, margin: '6px 0' }}>
                    {d.mood_journey.avg_exploration_index}/100
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>
                    {d.mood_journey.exploration_label.split(' — ')[0]}
                  </div>
                </div>
                <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}22`,
                  borderRadius: 10, padding: '14px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                    Peak Transition Day
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.purple, margin: '6px 0' }}>
                    {d.mood_journey.peak_transition_day}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>
                    {d.mood_journey.total_mood_changes} total transitions
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
                Top Mood Transitions
              </div>
              {d.mood_journey.top_transitions.map((t, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{t.transition}</span>
                    <span style={{ fontSize: 12, color: C.mint, fontWeight: 700 }}>{t.pct}%</span>
                  </div>
                  <div style={{ background: '#1A1A35', borderRadius: 4, height: 6 }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${t.pct}%`,
                      background: `linear-gradient(90deg, ${C.mint}, ${C.cyan})` }} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://admin.zik4u.com';

type FormFields = {
  company_name: string;
  website: string;
  company_number: string;
  phone: string;
  contact_name: string;
  contact_email: string;
  profile_type: string;
  plan_requested: string;
  message: string;
};

function ContactForm({ defaultTier, billingPeriod = 'monthly', checkoutLoading = false, onCheckout }: {
  defaultTier?: string;
  billingPeriod?: 'monthly' | 'annual';
  checkoutLoading?: boolean;
  onCheckout?: (planId: string, data: FormFields) => Promise<void>;
}) {
  const [fields, setFields] = useState<FormFields>({
    company_name:   '',
    website:        '',
    company_number: '',
    phone:          '',
    contact_name:   '',
    contact_email:  '',
    profile_type:   '',
    plan_requested: defaultTier ?? 'insight',
    message:        '',
  });
  const [errors, setErrors]   = useState<Partial<FormFields>>({});
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const set = (key: keyof FormFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields(prev => ({ ...prev, [key]: e.target.value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<FormFields> = {};
    if (!fields.company_name.trim())       e.company_name   = 'Required.';
    if (!fields.website.trim())            e.website        = 'Required.';
    else if (!fields.website.startsWith('https://')) e.website = 'Must start with https://';
    if (!fields.contact_name.trim())       e.contact_name   = 'Required.';
    if (!fields.contact_email.trim())      e.contact_email  = 'Required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.contact_email))
                                           e.contact_email  = 'Invalid email.';
    if (!fields.profile_type)             e.profile_type   = 'Required.';
    if (!fields.plan_requested)           e.plan_requested = 'Required.';
    if (!fields.message.trim())           e.message        = 'Required.';
    else if (fields.message.trim().length < 50)
                                           e.message        = 'At least 50 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isPaidPlan = ['insight', 'intelligence', 'enterprise'].includes(fields.plan_requested);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      if (isPaidPlan && onCheckout) {
        await onCheckout(fields.plan_requested, fields);
        // If onCheckout doesn't redirect, show error
        setServerMsg('Checkout failed. Please try again or email partner@zik4u.com');
        setStatus('error');
        return;
      }
      const res = await fetch(`${ADMIN_URL}/api/partner/request`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      });
      const data = await res.json() as { error?: string; errors?: Partial<FormFields>; message?: string };
      if (!res.ok) {
        if (data.errors) { setErrors(data.errors); setStatus('idle'); return; }
        setServerMsg(data.error ?? 'Something went wrong.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setServerMsg('Network error. Please try again or email partner@zik4u.com');
      setStatus('error');
    }
  };

  const inp = (hasError: boolean) => ({
    width: '100%', boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${hasError ? C.pink : C.border}`,
    borderRadius: 10, padding: '12px 16px', color: C.text,
    fontSize: 15, outline: 'none', fontFamily: 'Inter, system-ui, sans-serif',
  });
  const lbl = {
    fontSize: 11, color: C.muted, letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, display: 'block', marginBottom: 6,
  };
  const err = { fontSize: 12, color: C.pink, marginTop: 4 };

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center' as const, padding: '32px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Request received.</h3>
        <p style={{ color: C.muted, fontSize: 15 }}>
          We&apos;ll review your application and respond within 48 hours at{' '}
          <strong style={{ color: C.text }}>{fields.contact_email}</strong>.
        </p>
      </div>
    );
  }

  const msgLen = fields.message.trim().length;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

      {/* Row 1: company + website */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Company name *</label>
          <input value={fields.company_name} onChange={set('company_name')}
            placeholder="Warner Music Group" style={inp(!!errors.company_name)} />
          {errors.company_name && <p style={err}>{errors.company_name}</p>}
        </div>
        <div>
          <label style={lbl}>Website *</label>
          <input value={fields.website} onChange={set('website')}
            placeholder="https://warnermusic.com" style={inp(!!errors.website)} />
          {errors.website && <p style={err}>{errors.website}</p>}
        </div>
      </div>

      {/* Row 2: registration number + phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Registration number</label>
          <input value={fields.company_number} onChange={set('company_number')}
            placeholder="EIN / SIRET / Company No." style={inp(false)} />
        </div>
        <div>
          <label style={lbl}>Phone</label>
          <input value={fields.phone} onChange={set('phone')}
            placeholder="+1 555 000 0000" style={inp(false)} />
        </div>
      </div>

      {/* Row 3: contact name + email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Contact name *</label>
          <input value={fields.contact_name} onChange={set('contact_name')}
            placeholder="John Smith" style={inp(!!errors.contact_name)} />
          {errors.contact_name && <p style={err}>{errors.contact_name}</p>}
        </div>
        <div>
          <label style={lbl}>Work email *</label>
          <input type="email" value={fields.contact_email} onChange={set('contact_email')}
            placeholder="john@warnermusic.com" style={inp(!!errors.contact_email)} />
          {errors.contact_email && <p style={err}>{errors.contact_email}</p>}
        </div>
      </div>

      {/* Row 4: profile type + plan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Your profile *</label>
          <select value={fields.profile_type} onChange={set('profile_type')}
            style={inp(!!errors.profile_type)}>
            <option value="" disabled>Select profile type</option>
            <option value="label">Record Label / Publisher</option>
            <option value="distributor">Distributor</option>
            <option value="agency">Talent Agency</option>
            <option value="platform">Streaming Platform (DSP)</option>
            <option value="other">Other</option>
          </select>
          {errors.profile_type && <p style={err}>{errors.profile_type}</p>}
        </div>
        <div>
          <label style={lbl}>Plan of interest *</label>
          <select value={fields.plan_requested} onChange={set('plan_requested')}
            style={inp(!!errors.plan_requested)}>
            <option value="discover">Discover (Free)</option>
            <option value="insight">Insight ($699/month)</option>
            <option value="intelligence">Intelligence ($1,999/month)</option>
            <option value="enterprise">Enterprise (Custom)</option>
          </select>
          {errors.plan_requested && <p style={err}>{errors.plan_requested}</p>}
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={{ ...lbl, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>How would you use Zik4U Intelligence? *</span>
          <span style={{ color: msgLen >= 50 ? C.mint : C.pink, fontVariantNumeric: 'tabular-nums' }}>
            {msgLen}/50 min
          </span>
        </label>
        <textarea
          value={fields.message}
          onChange={set('message')}
          rows={4}
          placeholder="Describe your use case: which artists you track, what decisions this data would inform, the size of your roster or catalog..."
          style={{
            ...inp(!!errors.message),
            resize: 'vertical' as const,
            lineHeight: '1.6',
          }}
        />
        {errors.message && <p style={err}>{errors.message}</p>}
      </div>

      {/* Notice */}
      <div style={{
        background: `${C.purple}10`, border: `1px solid ${C.purple}25`,
        borderRadius: 10, padding: '12px 16px', fontSize: 12, color: C.muted,
      }}>
        By submitting this form you agree to Zik4U&apos;s{' '}
        <a href="/legal/terms" target="_blank"
          style={{ color: C.cyan, textDecoration: 'underline' }}>Terms of Service</a>{' '}
        and{' '}
        <a href="/legal/privacy" target="_blank"
          style={{ color: C.cyan, textDecoration: 'underline' }}>Privacy Policy</a>.
        Partner data access is governed by a separate Data Processing Agreement.
      </div>

      <button type="submit" disabled={status === 'sending' || checkoutLoading} style={{
        width: '100%', padding: '16px',
        background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
        border: 'none', borderRadius: 12, color: '#0A0A1A',
        fontSize: 16, fontWeight: 700,
        cursor: (status === 'sending' || checkoutLoading) ? 'not-allowed' : 'pointer',
        opacity: (status === 'sending' || checkoutLoading) ? 0.7 : 1,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {checkoutLoading
          ? 'Redirecting...'
          : status === 'sending'
          ? (isPaidPlan ? 'Processing...' : 'Sending...')
          : isPaidPlan
          ? `Proceed to checkout${billingPeriod === 'annual' ? ' (annual)' : ''} →`
          : 'Request partner access →'}
      </button>

      {status === 'error' && (
        <p style={{ color: C.pink, textAlign: 'center' as const, fontSize: 13 }}>
          {serverMsg}
        </p>
      )}
      <p style={{ textAlign: 'center' as const, fontSize: 12, color: C.muted }}>
        We respond within 48 hours. No sales pressure.
      </p>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PartnerPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan]     = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod]   = useState<'monthly' | 'annual'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handlePaidPlan = async (planId: string, data: FormFields) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/partner/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, plan: planId, billing_period: billingPeriod }),
      });
      const json = await res.json() as { url?: string; error?: string };
      if (json.url) router.push(json.url);
    } catch {
      // error shown in ContactForm
    } finally {
      setCheckoutLoading(false);
    }
  };

  const scrollToForm = (planId?: string) => {
    if (planId) setSelectedPlan(planId);
    setTimeout(() => {
      document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text,
      fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', maxWidth: 1100, margin: '0 auto',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => router.push('/')} style={{
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', border: 'none', fontSize: 20,
          fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif', padding: 0,
        }}>
          ZIK4U
        </button>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: C.muted }}>Partner Program</span>
          <button onClick={() => scrollToForm()} style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            border: 'none', borderRadius: 8, padding: '8px 16px',
            color: '#0A0A1A', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Request access
          </button>
          <a
            href="/streaming-partners"
            style={{
              fontSize: 12, color: C.muted,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = C.mint; }}
            onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = C.muted; }}
          >
            Streaming platforms →
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', padding: '72px 0 64px' }}
        >
          <div style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${C.purple}22, ${C.cyan}11)`,
            border: `1px solid ${C.cyan}30`, borderRadius: 24, padding: '6px 20px',
            fontSize: 11, letterSpacing: '0.15em', color: C.cyan, marginBottom: 24,
            textTransform: 'uppercase' as const,
          }}>
            Zik4U Intelligence — Partner Program
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20 }}>
            The emotional layer of music.
            <br />
            <span style={{
              background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              For real.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 580,
            margin: '0 auto 12px', lineHeight: 1.6 }}>
            We capture what people <em>actually</em> listen to — not what they
            curate, perform, or share. Every stream, every repeat, every 3AM listen.
            Turned into intelligence no streaming platform can give you.
          </p>
          <p style={{ fontSize: 14, color: C.dim, fontStyle: 'italic' }}>
            100% authentic behavioral data. No playlist bias. No algorithmic noise. No self-reporting.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <button onClick={() => scrollToForm('discover')} style={{
              background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
              border: 'none', borderRadius: 12, padding: '14px 28px',
              color: '#0A0A1A', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              Start free — 3 months
            </button>
            <button onClick={() => scrollToForm('intelligence')} style={{
              background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '14px 28px',
              color: C.text, fontSize: 15, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              See full plans
            </button>
          </div>
        </motion.div>

        {/* Demo report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: 80 }}
        >
          <p style={{ textAlign: 'center', fontSize: 12, color: C.muted,
            letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 20 }}>
            Sample intelligence report · Demo data
          </p>
          <DemoReportCard />
        </motion.div>

        {/* The data layer that didn't exist */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
              The data layer that didn&apos;t exist.
            </h2>
            <p style={{ color: C.muted, fontSize: 15, maxWidth: 580, margin: '0 auto' }}>
              Spotify sees streams. Apple Music sees plays. We see the human being behind them —
              their emotional state, their loyalty signal, their discovery moment.
              That&apos;s the gap Zik4U fills.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
            background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              {
                who: 'Streaming platforms',
                see: 'Stream count',
                miss: 'Emotional depth',
                color: C.muted,
                highlight: false,
              },
              {
                who: 'Social media',
                see: 'Engagement metrics',
                miss: 'Listening behavior',
                color: C.muted,
                highlight: false,
              },
              {
                who: 'Zik4U Intelligence',
                see: 'Both — and more',
                miss: null,
                color: C.mint,
                highlight: true,
              },
            ].map((row) => (
              <div key={row.who} style={{
                background: row.highlight ? `${C.mint}08` : C.card,
                padding: '28px 24px',
                borderRight: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                  color: row.color, marginBottom: 16, fontWeight: 700 }}>
                  {row.who}
                </div>
                {row.miss ? (
                  <>
                    <div style={{ fontSize: 14, marginBottom: 8 }}>
                      <span style={{ color: C.mint }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>{row.see}</span>
                    </div>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ color: C.pink }}>✗</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>{row.miss}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.mint }}>
                    {row.see}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What you can&apos;t get anywhere else */}
        <div style={{ marginBottom: 80, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Data no one else has.</h2>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 40 }}>
            Spotify, Apple Music and YouTube see streams. We see the emotion behind them.
          </p>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16, textAlign: 'left' }}>
            {[
              { emoji: '🔥', title: 'Pre-viral Signal', color: C.mint,
                body: 'Detect artists before they chart. Our virality score (0-100) is computed from authentic listening patterns — not social media noise.' },
              { emoji: '💜', title: 'Emotional Intensity', color: C.pink,
                body: 'Not just "what mood" — how deeply. Nocturnal + compulsive listening at 3AM = a different audience than casual daytime play.' },
              { emoji: '🎭', title: 'Listener Archetypes', color: C.purple,
                body: '7 behavioral profiles built from 30-day listening patterns. Know if your artist attracts Night Explorers, Deep Feelers or Obsessive Fans.' },
              { emoji: '🔗', title: 'Crossover Map', color: C.cyan,
                body: 'See which artists share listeners. Identify featuring opportunities, playlist targeting and A&R crossover potential.' },
              { emoji: '🏆', title: 'First Heard', color: '#FFB800',
                body: 'We log the exact moment each artist was first listened to on Zik4U. Historical proof of discovery — before anyone else knew.' },
              { emoji: '🎯', title: 'Loyalty Score', color: C.mint,
                body: '30/60/90-day listener retention. Know if an artist builds a sticky fanbase or rides a wave of one-time discovery.' },
              { emoji: '🧠', title: 'AI Analyst', color: C.purple,
                body: 'Ask anything about the data in plain language. Powered by Claude. Gets answers in seconds that would take an analyst hours. Available on Insight and Intelligence plans.' },
            ].map(feat => (
              <div key={feat.title} style={{
                background: C.card, border: `1px solid ${feat.color}22`,
                borderTop: `2px solid ${feat.color}`, borderRadius: 14, padding: '24px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{feat.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{feat.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{feat.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>
            What&apos;s your ROI?
          </h2>
          <p style={{ color: C.muted, fontSize: 15, textAlign: 'center', marginBottom: 32 }}>
            Labels using early discovery data close 15-25% more deals per year.
          </p>
          <ROICalculator />
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>
            Partner plans
          </h2>
          <p style={{ color: C.muted, fontSize: 15, textAlign: 'center', marginBottom: 32 }}>
            Start free. Upgrade when you&apos;re ready. Annual plans save up to 23%.
          </p>

          {/* Billing period toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 14, marginBottom: 40 }}>
            <span style={{ fontSize: 14, fontWeight: billingPeriod === 'monthly' ? 700 : 400,
              color: billingPeriod === 'monthly' ? C.text : C.muted }}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(p => p === 'monthly' ? 'annual' : 'monthly')}
              style={{
                position: 'relative' as const, width: 52, height: 28,
                borderRadius: 14, border: 'none', cursor: 'pointer',
                background: billingPeriod === 'annual'
                  ? `linear-gradient(135deg, ${C.cyan}, ${C.mint})`
                  : 'rgba(255,255,255,0.15)',
                transition: 'background 0.2s', flexShrink: 0,
              }}>
              <span style={{
                position: 'absolute' as const,
                top: 4, left: billingPeriod === 'annual' ? 26 : 4,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </button>
            <span style={{ fontSize: 14, fontWeight: billingPeriod === 'annual' ? 700 : 400,
              color: billingPeriod === 'annual' ? C.text : C.muted }}>
              Annual{' '}
              <span style={{ color: C.mint, fontSize: 12, fontWeight: 700 }}>−23%</span>
            </span>
          </div>

          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16, alignItems: 'start' }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background:   plan.highlight ? `${plan.color}10` : C.card,
                border:       `1px solid ${plan.color}${plan.highlight ? '60' : '30'}`,
                borderRadius: 16, padding: '28px 24px', position: 'relative' as const,
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute' as const, top: -12, left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.color, color: '#0A0A1A',
                    fontSize: 10, fontWeight: 700, padding: '4px 16px',
                    borderRadius: 20, letterSpacing: '0.1em',
                    whiteSpace: 'nowrap' as const,
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ color: plan.color, fontWeight: 700, fontSize: 12,
                  letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                  {plan.name}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900 }}>{plan.price}</span>
                  {plan.period && (
                    <span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>{plan.period}</span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.5 }}>
                  {plan.desc}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px',
                  display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                      <span style={{ color: plan.color, flexShrink: 0 }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToForm(plan.id)}
                  disabled={checkoutLoading && selectedPlan === plan.id}
                  style={{
                    width: '100%', padding: '13px',
                    background: plan.highlight
                      ? `linear-gradient(135deg, ${plan.color}, ${C.cyan})`
                      : 'transparent',
                    border: `1px solid ${plan.color}`, borderRadius: 10,
                    color: plan.highlight ? '#0A0A1A' : C.text,
                    fontSize: 14, fontWeight: 700,
                    cursor: (checkoutLoading && selectedPlan === plan.id) ? 'not-allowed' : 'pointer',
                    opacity: (checkoutLoading && selectedPlan === plan.id) ? 0.7 : 1,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                  {checkoutLoading && selectedPlan === plan.id ? 'Redirecting...' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Built for decisions, not dashboards */}
        <div style={{ marginBottom: 64, textAlign: 'center' as const }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
            Built for decisions, not dashboards.
          </h2>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Every data point in Zik4U Intelligence is derived from real, consented listening behavior.
            No panels. No surveys. No algorithmic inference.
            What you see is what people actually do — when no one is watching.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' as const }}>
            {[
              { value: '100%', label: 'Authentic listening data' },
              { value: 'GDPR', label: 'Art. 22 compliant profiling' },
              { value: '7', label: 'Emotional archetypes' },
              { value: '24h', label: 'Emotional snapshot frequency' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 28, fontWeight: 900,
                  background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div id="partner-form" style={{
          maxWidth: 640, margin: '0 auto',
          background: C.card, border: `1px solid ${C.cyan}22`,
          borderRadius: 20, padding: '40px',
        }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Request partner access
          </h3>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
            Tell us about you. We respond within 48 hours.
          </p>
          <ContactForm
            defaultTier={selectedPlan ?? undefined}
            billingPeriod={billingPeriod}
            checkoutLoading={checkoutLoading}
            onCheckout={handlePaidPlan}
          />
        </div>
      </div>
    </main>
  );
}
