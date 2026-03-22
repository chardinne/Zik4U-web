'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Demo insight cards ────────────────────────────────────────────────────────

const DEMO_INSIGHTS = [
  {
    artist:    'Arctic Monkeys',
    score:     87,
    archetype: '⚡ Obsessive Fan',
    listeners: 2340,
    peakHour:  '11 PM',
    trend:     '+34% this week',
    color:     '#00D4FF',
  },
  {
    artist:    'Rosalía',
    score:     74,
    archetype: '🌍 Cultural Nomad',
    listeners: 1820,
    peakHour:  '9 PM',
    trend:     '+18% this week',
    color:     '#FF3CAC',
  },
  {
    artist:    'Floating Points',
    score:     61,
    archetype: '🌊 Zen Drifter',
    listeners: 890,
    peakHour:  '2 AM',
    trend:     '+8% this week',
    color:     '#00FFB2',
  },
];

const PRICING = [
  {
    name:     'Insight',
    price:    '$299',
    period:   '/month',
    desc:     'For independent labels and A&R teams.',
    features: [
      'Top 100 viral artists weekly',
      'Listener archetype distribution',
      'Artist deep profiles (30 days)',
      'CSV export',
    ],
    color:  '#00D4FF',
    cta:    'Get Insight',
  },
  {
    name:     'Intelligence',
    price:    '$799',
    period:   '/month',
    desc:     'For major labels and streaming platforms.',
    features: [
      'Everything in Insight',
      'Full virality leaderboard (unlimited)',
      'Compare artists side-by-side',
      'Weekly automated HTML report',
      'Artist first-heard data',
      'Priority API access',
    ],
    color:    '#7B2FFF',
    highlight: true,
    cta:      'Get Intelligence',
  },
  {
    name:     'Enterprise',
    price:    'Custom',
    period:   '',
    desc:     'White-label data feed for DSPs and brands.',
    features: [
      'Everything in Intelligence',
      'Raw data API (JSON/CSV stream)',
      'Custom archetype models',
      'Dedicated integration support',
      'SLA + NDA',
    ],
    color:  '#FF3CAC',
    cta:    'Contact Us',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PartnerPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({
    company: '',
    name:    '',
    email:   '',
    tier:    'Insight',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    try {
      const res = await fetch('https://formspree.io/f/zik4u-partner', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      setFormState(res.ok ? 'sent' : 'error');
    } catch {
      setFormState('error');
    }
  };

  return (
    <main style={{
      minHeight:       '100vh',
      backgroundColor: '#0A0A1A',
      color:           '#fff',
      fontFamily:      'Inter, system-ui, sans-serif',
      overflowX:       'hidden',
    }}>
      {/* Nav */}
      <nav style={{
        position:     'sticky',
        top:          0,
        zIndex:       100,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        padding:      '16px 40px',
        background:   'rgba(10,10,26,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{
            fontSize:   20,
            fontWeight: 900,
            letterSpacing: '0.2em',
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
          }}>
            ZIK4U
          </span>
        </button>
        <span style={{
          fontSize:   11,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color:      '#7B2FFF',
          textTransform: 'uppercase',
          background: 'rgba(123,47,255,0.1)',
          padding:    '4px 12px',
          borderRadius: 999,
          border:     '1px solid rgba(123,47,255,0.3)',
        }}>
          Partner Program
        </span>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', textAlign: 'center', maxWidth: 780, margin: '0 auto' }}>
        <div style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           8,
          background:    'rgba(123,47,255,0.1)',
          border:        '1px solid rgba(123,47,255,0.3)',
          borderRadius:  999,
          padding:       '6px 16px',
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         '#7B2FFF',
          marginBottom:  32,
        }}>
          ✦ Zik4U Intelligence API
        </div>
        <h1 style={{
          fontSize:      'clamp(36px, 6vw, 64px)',
          fontWeight:    900,
          lineHeight:    1.05,
          letterSpacing: '-0.02em',
          marginBottom:  24,
        }}>
          Understand music<br />
          <span style={{
            background:           'linear-gradient(90deg, #7B2FFF, #FF3CAC, #00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
          }}>
            emotionally. For real.
          </span>
        </h1>
        <p style={{
          fontSize:   'clamp(16px, 2vw, 20px)',
          color:      'rgba(255,255,255,0.45)',
          lineHeight: 1.7,
          marginBottom: 0,
        }}>
          Real listening data from real users — not streams, not playlist adds.
          Virality scores, listener archetypes, and emotional profiles
          built from actual scrobbles.
        </p>
      </section>

      {/* Demo insight cards */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{
          textAlign:     'center',
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.25)',
          marginBottom:  32,
        }}>
          Sample intelligence outputs
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {DEMO_INSIGHTS.map(d => (
            <div key={d.artist} style={{
              background:   '#12122A',
              border:       `1px solid ${d.color}22`,
              borderRadius: 20,
              padding:      '28px 28px 24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{d.artist}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{d.archetype}</div>
                </div>
                <div style={{
                  fontSize:   28,
                  fontWeight: 900,
                  color:      d.color,
                  lineHeight: 1,
                }}>
                  {d.score}
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>/100</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Unique listeners', value: d.listeners.toLocaleString() },
                  { label: 'Peak hour',         value: d.peakHour },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop:  16,
                fontSize:   12,
                fontWeight: 600,
                color:      d.color,
                background: `${d.color}11`,
                borderRadius: 8,
                padding:    '6px 12px',
                display:    'inline-block',
              }}>
                {d.trend}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{
          textAlign:     'center',
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.25)',
          marginBottom:  12,
        }}>
          Pricing
        </p>
        <h2 style={{
          textAlign:  'center',
          fontSize:   'clamp(24px, 4vw, 40px)',
          fontWeight: 900,
          marginBottom: 48,
          letterSpacing: '-0.01em',
        }}>
          Simple, usage-based plans
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PRICING.map(plan => (
            <div key={plan.name} style={{
              background:   plan.highlight ? `linear-gradient(135deg, ${plan.color}18, ${plan.color}08)` : '#12122A',
              border:       `1px solid ${plan.highlight ? plan.color + '44' : plan.color + '22'}`,
              borderRadius: 20,
              padding:      '32px 28px',
              position:     'relative',
            }}>
              {plan.highlight && (
                <div style={{
                  position:   'absolute',
                  top:        -12,
                  left:       '50%',
                  transform:  'translateX(-50%)',
                  background: plan.color,
                  color:      '#fff',
                  fontSize:   11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding:    '4px 14px',
                  borderRadius: 999,
                }}>
                  Most popular
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: plan.color, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 900 }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, lineHeight: 1.5 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" style={{
                display:       'block',
                textAlign:     'center',
                padding:       '12px',
                borderRadius:  10,
                fontSize:      14,
                fontWeight:    700,
                textDecoration: 'none',
                background:    plan.highlight ? plan.color : 'transparent',
                border:        `1px solid ${plan.color}`,
                color:         plan.highlight ? '#fff' : plan.color,
                transition:    'opacity 0.15s',
              }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" style={{
        padding:     '80px 40px 120px',
        maxWidth:    600,
        margin:      '0 auto',
      }}>
        <h2 style={{
          textAlign:     'center',
          fontSize:      'clamp(24px, 4vw, 36px)',
          fontWeight:    900,
          marginBottom:  12,
          letterSpacing: '-0.01em',
        }}>
          Get in touch
        </h2>
        <p style={{
          textAlign:  'center',
          fontSize:   15,
          color:      'rgba(255,255,255,0.4)',
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          Tell us about your use case and we&apos;ll get back to you within 24h.
        </p>

        {formState === 'sent' ? (
          <div style={{
            background:   'rgba(0,255,178,0.08)',
            border:       '1px solid rgba(0,255,178,0.3)',
            borderRadius: 16,
            padding:      '32px',
            textAlign:    'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#00FFB2' }}>Message sent!</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
              We&apos;ll get back to you within 24 hours.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'company', label: 'Company / Label',       placeholder: 'Universal Music Group…' },
              { key: 'name',    label: 'Your Name',             placeholder: 'Jane Smith' },
              { key: 'email',   label: 'Work Email',            placeholder: 'jane@company.com', type: 'email' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  required
                  type={field.type ?? 'text'}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width:        '100%',
                    background:   '#12122A',
                    border:       '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    padding:      '12px 16px',
                    fontSize:     14,
                    color:        '#fff',
                    outline:      'none',
                    boxSizing:    'border-box',
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                Plan of interest
              </label>
              <select
                value={formData.tier}
                onChange={e => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                style={{
                  width:        '100%',
                  background:   '#12122A',
                  border:       '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding:      '12px 16px',
                  fontSize:     14,
                  color:        '#fff',
                  cursor:       'pointer',
                }}
              >
                <option>Insight</option>
                <option>Intelligence</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                What are you trying to understand?
              </label>
              <textarea
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Describe your use case…"
                rows={4}
                style={{
                  width:        '100%',
                  background:   '#12122A',
                  border:       '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding:      '12px 16px',
                  fontSize:     14,
                  color:        '#fff',
                  outline:      'none',
                  resize:       'vertical',
                  boxSizing:    'border-box',
                }}
              />
            </div>
            {formState === 'error' && (
              <div style={{ color: '#FF3CAC', fontSize: 13 }}>
                Something went wrong. Email us at partner@zik4u.com
              </div>
            )}
            <button
              type="submit"
              disabled={formState === 'sending'}
              style={{
                background:   'linear-gradient(135deg, #7B2FFF, #FF3CAC)',
                border:       'none',
                borderRadius: 12,
                padding:      '16px',
                fontSize:     15,
                fontWeight:   700,
                color:        '#fff',
                cursor:       formState === 'sending' ? 'not-allowed' : 'pointer',
                opacity:      formState === 'sending' ? 0.6 : 1,
                transition:   'opacity 0.15s',
              }}
            >
              {formState === 'sending' ? 'Sending…' : 'Send message →'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding:   '24px 40px',
        display:   'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize:  12,
        color:     'rgba(255,255,255,0.2)',
      }}>
        <span>Zik4U LLC · partner@zik4u.com</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/legal/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="/legal/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
        </div>
      </footer>
    </main>
  );
}
