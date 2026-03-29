'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  cyan:   '#00D4FF',
  mint:   '#00FFB2',
  pink:   '#FF3CAC',
  violet: '#7B2FFF',
  bg:     '#0A0A1A',
  card:   '#12122A',
  border: 'rgba(255,255,255,0.08)',
} as const;

// ── Data ──────────────────────────────────────────────────────────────────────
const NOW_CARDS = [
  {
    id: 0, username: '@alex_m', mood: 'High Energy', moodEmoji: '⚡',
    gradient: ['#FF3CAC', '#7B2FFF'] as [string, string],
    track: 'Blinding Lights', artist: 'The Weeknd', streak: 32,
  },
  {
    id: 1, username: '@sofia_r', mood: 'Deep Focus', moodEmoji: '🎯',
    gradient: ['#7B2FFF', '#00D4FF'] as [string, string],
    track: 'Weightless', artist: 'Marconi Union', streak: 14,
  },
  {
    id: 2, username: '@kai_dev', mood: 'Feel Good', moodEmoji: '✨',
    gradient: ['#00D4FF', '#00FFB2'] as [string, string],
    track: 'Good 4 U', artist: 'Olivia Rodrigo', streak: 7,
  },
  {
    id: 3, username: '@luna_b', mood: 'Nocturne', moodEmoji: '🌙',
    gradient: ['#1A1A35', '#7B2FFF'] as [string, string],
    track: 'Midnight Rain', artist: 'Taylor Swift', streak: 21,
  },
  {
    id: 4, username: '@marc_d', mood: 'Explorer', moodEmoji: '🔭',
    gradient: ['#FF3CAC', '#00D4FF'] as [string, string],
    track: 'Bleed It Out', artist: 'Linkin Park', streak: 45,
  },
];

const PROOFS = [
  { icon: '🎵', stat: '2.4M+', label: 'tracks scrobbled',  sub: 'Auto-detected. No manual input.'          },
  { icon: '🤝', stat: '89%',   label: 'match accuracy',     sub: 'Jaccard similarity on real taste.'        },
  { icon: '💸', stat: '$48K',  label: 'paid to creators',   sub: 'Direct from fans who actually listen.'    },
];

const STATS = [
  { value: '128K', label: 'listeners'   },
  { value: '4.1K', label: 'creators'    },
  { value: '7',    label: 'platforms'   },
  { value: '∞',    label: 'discoveries' },
];

const PLATFORMS = [
  { name: 'Spotify',       color: '#1DB954', slug: 'spotify'       },
  { name: 'Apple Music',   color: '#FC3C44', slug: 'apple-music'   },
  { name: 'YouTube Music', color: '#FF0000', slug: 'youtube-music' },
  { name: 'SoundCloud',    color: '#FF5500', slug: 'soundcloud'    },
  { name: 'Deezer',        color: '#00C7F2', slug: 'deezer'        },
];

// ── NowCardLive ───────────────────────────────────────────────────────────────
function NowCardLive() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % NOW_CARDS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const card = NOW_CARDS[index];

  return (
    <div style={{ position: 'relative', width: 220, height: 330, flexShrink: 0 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{   opacity: 0, scale: 0.94, y: -12 }}
          transition={{ duration: 0.38 }}
          style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            background: `linear-gradient(140deg, ${card.gradient[0]}, ${card.gradient[1]})`,
            padding: 20, display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: `0 24px 64px ${card.gradient[0]}50`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
                Now
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                {card.username}
              </div>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
              background: 'rgba(0,0,0,0.25)', borderRadius: 999, padding: '4px 10px',
            }}>
              {card.moodEmoji} {card.mood}
            </div>
          </div>

          <div style={{
            width: '100%', height: 100, borderRadius: 12,
            background: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
          }}>
            🎵
          </div>

          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
              {card.track}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {card.artist}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              🔥 {card.streak}d streak
            </span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)' }}>
              ZIK4U
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: -22, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 6,
      }}>
        {NOW_CARDS.map((_, i) => (
          <div key={i} style={{
            width: i === index ? 18 : 6, height: 4, borderRadius: 2,
            background: i === index ? C.cyan : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── CompatBar ─────────────────────────────────────────────────────────────────
function CompatBar({ pct, color }: { pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setW(pct); },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div ref={ref} style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 3, background: color,
        width: `${w}%`, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}

// ── ProofCard ─────────────────────────────────────────────────────────────────
function ProofCard({ icon, stat, label, sub, delay }: {
  icon: string; stat: string; label: string; sub: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      style={{
        flex: 1, minWidth: 180,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{
        fontSize: 38, fontWeight: 900, lineHeight: 1,
        background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {stat}
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{sub}</span>
    </motion.div>
  );
}

// ── StatPill ──────────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '16px 24px',
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 16,
    }}>
      <span style={{
        fontSize: 28, fontWeight: 900,
        background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {value}
      </span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

// ── CTACard ───────────────────────────────────────────────────────────────────
function CTACard({ title, sub, gradient, textColor, href }: {
  title: string; sub: string; gradient: string; textColor: string; href: string;
}) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      style={{
        flex: 1, minWidth: 160, padding: '28px 24px',
        background: gradient, border: `1px solid ${C.border}`,
        borderRadius: 20, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 900, color: textColor }}>{title}</span>
      <span style={{
        fontSize: 13, fontWeight: 500, lineHeight: 1.4,
        color: textColor === '#fff' ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,26,0.55)',
      }}>
        {sub}
      </span>
    </motion.button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.25]);

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 64,
          background: 'rgba(10,10,26,0.88)', backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Logo — plain span (not motion.span) */}
        <span style={{
          fontSize: 20, fontWeight: 900, letterSpacing: '0.2em',
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          ZIK4U
        </span>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a
            href="/partner"
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
          >
            For Labels
          </a>
          <Link
            href="/listeners"
            style={{
              fontSize: 13, fontWeight: 700, color: C.bg,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`,
              padding: '8px 20px', borderRadius: 999, textDecoration: 'none',
            }}
          >
            Get the app
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section style={{ opacity: heroOpacity }}>
        <div style={{
          padding: '120px 24px 100px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          {/* Early access badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              color: C.cyan, background: 'rgba(0,212,255,0.08)',
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid rgba(0,212,255,0.2)',
              marginBottom: 32,
              textTransform: 'uppercase',
            }}
          >
            Early Access · Join Now
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontSize: 'clamp(40px, 7vw, 84px)',
              fontWeight: 900, color: '#fff',
              lineHeight: 1.05, letterSpacing: '-0.02em',
              maxWidth: 780, margin: '0 0 24px',
            }}
          >
            The social network built on
            <br />
            <span style={{
              background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              what you actually listen to.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.42)', lineHeight: 1.65,
              maxWidth: 520, margin: '0 0 64px',
            }}
          >
            Not your curated playlist. Not your public profile.
            <br />
            Your real listening identity. Live, shared, monetized.
          </motion.p>

          {/* Now Card carousel + compat widget */}
          <div style={{
            display: 'flex', gap: 48, alignItems: 'center',
            flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80,
          }}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <NowCardLive />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 20, padding: '24px', width: 240,
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.3)', marginBottom: 16, textTransform: 'uppercase',
              }}>
                Music Compatibility
              </div>
              {[
                { name: 'Alex',  pct: 94, color: C.pink   },
                { name: 'Sofia', pct: 87, color: C.violet  },
                { name: 'Kai',   pct: 72, color: C.cyan    },
                { name: 'Luna',  pct: 61, color: C.mint    },
              ].map(({ name, pct, color }) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
                  </div>
                  <CompatBar pct={pct} color={color} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Store buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <a
              href="/listeners"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#fff', color: '#0A0A1A',
                padding: '12px 24px', borderRadius: 14,
                textDecoration: 'none', fontWeight: 700, fontSize: 14,
              }}
            >
              <span style={{ fontSize: 20 }}>🍎</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 10, opacity: 0.5, fontWeight: 500 }}>Download on the</span>
                <span>App Store</span>
              </div>
            </a>
            <a
              href="/listeners"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#fff', color: '#0A0A1A',
                padding: '12px 24px', borderRadius: 14,
                textDecoration: 'none', fontWeight: 700, fontSize: 14,
              }}
            >
              <span style={{ fontSize: 20 }}>▶</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 10, opacity: 0.5, fontWeight: 500 }}>Get it on</span>
                <span>Google Play</span>
              </div>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ── PROOF ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900,
              textAlign: 'center', marginBottom: 48, color: '#fff',
            }}
          >
            Real users. Real data.{' '}
            <span style={{
              background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Real results.
            </span>
          </motion.h2>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {PROOFS.map((p, i) => (
              <ProofCard key={p.label} {...p} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '60px 24px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {STATS.map(s => <StatPill key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── 3-DOOR CTA ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900,
              textAlign: 'center', marginBottom: 12, color: '#fff',
            }}
          >
            Who are you?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginBottom: 40, fontSize: 16 }}
          >
            Three doors. One truth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <CTACard
              title="Listener"
              sub="Find people who actually hear what you hear. No algorithms. No fake taste."
              gradient={`linear-gradient(135deg, ${C.cyan}, ${C.mint})`}
              textColor="#0A0A1A"
              href="/listeners"
            />
            <CTACard
              title="Creator"
              sub="Your listeners pay for access. Drops, sessions, tips. Your music. Your revenue."
              gradient={`linear-gradient(135deg, ${C.pink}, ${C.violet})`}
              textColor="#fff"
              href="/creators"
            />
            <CTACard
              title="Fan"
              sub="Get inside your favorite artist's listening world. Not their PR. Their truth."
              gradient={C.card}
              textColor="#fff"
              href="/fans"
            />
          </motion.div>
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section style={{ padding: '48px 24px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            Works with
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {PLATFORMS.map(p => (
              <Link
                key={p.slug}
                href={`/works-with/${p.slug}`}
                style={{
                  fontSize: 14, fontWeight: 700, color: p.color, opacity: 0.55,
                  textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '32px 24px', borderTop: `1px solid ${C.border}`,
        display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {[
          { label: 'Privacy', href: '/legal/privacy' },
          { label: 'Terms',   href: '/legal/terms'   },
        ].map(l => (
          <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>
            {l.label}
          </a>
        ))}
        <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 12 }}>·</span>
        <a
          href="/partner"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
          onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = C.cyan; }}
          onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)'; }}
        >
          For labels &amp; researchers →
        </a>
      </footer>

    </div>
  );
}
