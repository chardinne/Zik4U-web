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
  ],
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
    price:    '$499',
    period:   '/month · $4,499/year',
    desc:     'For independent labels and A&R teams.',
    color:    C.mint,
    features: [
      'Unlimited artist profiles',
      'Virality leaderboard (top 100)',
      'Emotional intensity score',
      'Listener loyalty (30/60/90d)',
      'Audience segmentation',
      'Crossover artists map',
      'CSV + JSON export',
      '90-day historical window',
    ],
    cta:       'Get Insight',
    highlight: false,
  },
  {
    id:       'intelligence',
    name:     'Intelligence',
    price:    '$1,299',
    period:   '/month · $11,999/year',
    desc:     'For major labels and streaming platforms.',
    color:    C.purple,
    features: [
      'Everything in Insight',
      'First Heard data',
      'Weekly automated report',
      'Artist comparison tool',
      'Priority API access',
      'Dedicated onboarding',
      'Custom date ranges',
      'Real-time virality alerts',
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
      'Custom archetype models',
      'Wellbeing & research data',
      'White-label reports',
      'SLA + NDA',
      'Dedicated analyst',
    ],
    cta:       'Contact us',
    highlight: false,
  },
];

// ── ROI Calculator ────────────────────────────────────────────────────────────

function ROICalculator() {
  const [dealSize, setDealSize]       = useState(100000);
  const [dealsPerYear, setDealsPerYear] = useState(3);

  const annualCostInsight       = 4499;
  const annualCostIntelligence  = 11999;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'insights'>('overview');
  const d = DEMO_REPORT;

  const tabs = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'audience',  label: 'Audience'  },
    { id: 'insights',  label: 'Key Insights' },
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
      </div>
    </div>
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm({ defaultTier }: { defaultTier?: string }) {
  const [formData, setFormData] = useState({
    company: '', name: '', email: '',
    tier: defaultTier ?? 'insight', message: '',
  });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.company) return;
    setState('sending');
    try {
      await fetch('https://formspree.io/f/zik4u-partner', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...formData,
          subject:  `[Zik4U Partner] ${formData.company} — ${formData.tier}`,
          _replyto: formData.email,
        }),
      });
      setState('sent');
    } catch {
      setState('error');
    }
  };

  const update = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '12px 16px', color: C.text,
    fontSize: 15, outline: 'none', fontFamily: 'Inter, system-ui, sans-serif',
  };
  const labelStyle = {
    fontSize: 11, color: C.muted, letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, display: 'block', marginBottom: 6,
  };

  if (state === 'sent') {
    return (
      <div style={{ textAlign: 'center' as const, padding: '32px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Request received.</h3>
        <p style={{ color: C.muted, fontSize: 15 }}>
          We&apos;ll respond within 48 hours at {formData.email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={labelStyle}>Your name</label>
          <input value={formData.name} onChange={update('name')}
            placeholder="John Smith" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Company / Label / University</label>
          <input value={formData.company} onChange={update('company')} required
            placeholder="Warner Music..." style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Email address</label>
        <input type="email" value={formData.email} onChange={update('email')} required
          placeholder="you@company.com" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Plan of interest</label>
        <select value={formData.tier} onChange={update('tier')} style={inputStyle}>
          <option value="discover">Discover — Free (3 months)</option>
          <option value="insight">Insight — $499/month</option>
          <option value="intelligence">Intelligence — $1,299/month</option>
          <option value="enterprise">Enterprise — Custom pricing</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>You are</label>
        <select value={formData.message} onChange={update('message')} style={inputStyle}>
          <option value="" disabled>Select your profile</option>
          <option value="label">Music label / Publisher</option>
          <option value="manager">Artist manager / Agent</option>
          <option value="researcher">Academic researcher</option>
          <option value="brand">Brand / Agency</option>
          <option value="media">Music media / Press</option>
          <option value="dsp">Streaming platform (DSP)</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button type="submit" disabled={state === 'sending'} style={{
        width: '100%', padding: '16px',
        background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
        border: 'none', borderRadius: 12, color: '#0A0A1A',
        fontSize: 16, fontWeight: 700,
        cursor: state === 'sending' ? 'not-allowed' : 'pointer',
        opacity: state === 'sending' ? 0.7 : 1,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {state === 'sending' ? 'Sending...' : 'Request access →'}
      </button>
      {state === 'error' && (
        <p style={{ color: C.pink, textAlign: 'center' as const, fontSize: 13 }}>
          Something went wrong — email us directly at support@zik4u.com
        </p>
      )}
      <p style={{ textAlign: 'center' as const, fontSize: 12, color: C.muted }}>
        We respond within 48 hours · No sales pressure
      </p>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PartnerPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
            We capture what people <em>actually</em> listen to —
            not what they curate. Virality signals, emotional intensity,
            listener archetypes, first-heard data.
          </p>
          <p style={{ fontSize: 14, color: C.dim, fontStyle: 'italic' }}>
            100% authentic listening data. No playlist bias. No streaming algorithm.
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
          <p style={{ color: C.muted, fontSize: 15, textAlign: 'center', marginBottom: 40 }}>
            Start free. Upgrade when you&apos;re ready. Annual plans save up to 23%.
          </p>
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
                <button onClick={() => scrollToForm(plan.id)} style={{
                  width: '100%', padding: '13px',
                  background: plan.highlight
                    ? `linear-gradient(135deg, ${plan.color}, ${C.cyan})`
                    : 'transparent',
                  border: `1px solid ${plan.color}`, borderRadius: 10,
                  color: plan.highlight ? '#0A0A1A' : C.text,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}>
                  {plan.cta}
                </button>
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
          <ContactForm defaultTier={selectedPlan ?? undefined} />
        </div>
      </div>
    </main>
  );
}
