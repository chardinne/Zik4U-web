'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const C = {
  bg:     '#0A0A1A',
  card:   '#12122A',
  border: 'rgba(255,255,255,0.08)',
  cyan:   '#00D4FF',
  mint:   '#00FFB2',
  pink:   '#FF3CAC',
  purple: '#7B2FFF',
  text:   '#fff',
  muted:  'rgba(255,255,255,0.45)',
};

const PLATFORMS = [
  { name: 'Spotify',       color: '#1DB954' },
  { name: 'Apple Music',   color: '#FC3C44' },
  { name: 'YouTube Music', color: '#FF0000' },
  { name: 'SoundCloud',    color: '#FF5500' },
  { name: 'Deezer',        color: '#FEAA2D' },
  { name: 'Tidal',         color: '#fff'    },
];

const WHAT_WE_CAPTURE = [
  { icon: '✓', label: 'Track title',           color: C.mint },
  { icon: '✓', label: 'Artist name',            color: C.mint },
  { icon: '✓', label: 'Timestamp (rounded to minute)', color: C.mint },
  { icon: '✓', label: 'Source platform',        color: C.mint },
  { icon: '✓', label: 'Listening duration',     color: C.mint },
];

const WHAT_WE_NEVER_TOUCH = [
  { icon: '✗', label: 'Audio stream or content',       color: C.pink },
  { icon: '✗', label: 'Platform account credentials',  color: C.pink },
  { icon: '✗', label: 'Platform-specific track IDs',   color: C.pink },
  { icon: '✗', label: 'Playlist data or library',      color: C.pink },
  { icon: '✗', label: 'Payment or subscription info',  color: C.pink },
  { icon: '✗', label: 'Exact timestamps (always anonymized)', color: C.pink },
];

const GUARANTEES = [
  {
    emoji: '🎵',
    title: 'Zero audio. Zero content.',
    body: "Zik4U never captures, stores, buffers or reproduces audio. We work exclusively with metadata — the same information visible in a song's notification. No audio pipeline. No content interception.",
  },
  {
    emoji: '🔒',
    title: 'Anonymized by design.',
    body: 'Every scrobble is anonymized before storage. Platform IDs are stripped. Timestamps are rounded to the nearest minute. A one-way FNV-1a hash replaces any identifying fingerprint. Raw platform data never reaches our database.',
  },
  {
    emoji: '✋',
    title: 'Explicit user consent.',
    body: 'Users explicitly authorize Zik4U to capture their listening metadata during onboarding — with a clear explanation of what is collected and why. This consent is stored, timestamped, and revocable at any time. GDPR Art. 6(1)(a) compliant.',
  },
  {
    emoji: '🔗',
    title: 'Deep links, not streams.',
    body: 'When a Zik4U user wants to play a track, they are redirected to your platform via deep link. Zik4U never plays audio. You retain 100% of the stream, the royalty, and the relationship with the listener.',
  },
  {
    emoji: '📊',
    title: 'Metadata only. Always.',
    body: 'The Last.fm model — established in 2003 and legally validated across 20+ years — is the foundation of how Zik4U works. We log what was listened to, not what was heard. This distinction is fundamental and legally robust.',
  },
  {
    emoji: '🤝',
    title: 'Additive, not extractive.',
    body: 'Every Zik4U user is an active listener on your platform. We increase engagement, drive re-listens via social sharing, and send new users to you via deep links. Your streams grow. Your artists benefit. We add — we never subtract.',
  },
];

export default function StreamingPartnersPage() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: C.bg,
      color: C.text, fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', maxWidth: 900, margin: '0 auto',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => router.push('/')} style={{
          background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          border: 'none', fontSize: 20, fontWeight: 900,
          letterSpacing: '0.2em', cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif', padding: 0,
        }}>
          ZIK4U
        </button>
        <a href="mailto:partner@zik4u.com" style={{
          background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
          border: 'none', borderRadius: 8, padding: '8px 16px',
          color: '#0A0A1A', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', textDecoration: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Contact us →
        </a>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 100px' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', padding: '72px 0 64px' }}
        >
          <div style={{
            display: 'inline-block',
            background: `rgba(0,212,255,0.08)`,
            border: `1px solid rgba(0,212,255,0.2)`,
            borderRadius: 24, padding: '6px 20px',
            fontSize: 11, letterSpacing: '0.15em', color: C.cyan,
            marginBottom: 24, textTransform: 'uppercase' as const,
          }}>
            For Streaming Platforms
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            We distribute your music.<br />
            <span style={{
              background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              You play it.
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: C.muted, maxWidth: 580,
            margin: '0 auto 16px', lineHeight: 1.7,
          }}>
            Zik4U is a social layer built on top of streaming platforms — not a competitor.
            We capture listening metadata with explicit user consent,
            and send every play back to you via deep link.
          </p>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.3)',
            fontStyle: 'italic', marginBottom: 40,
          }}>
            Zero audio. Zero content interception. Zero competition.
          </p>

          {/* Platform logos */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '8px 20px', marginBottom: 40,
          }}>
            {PLATFORMS.map(p => (
              <span key={p.name} style={{
                fontSize: 14, fontWeight: 700,
                color: p.color, opacity: 0.7,
              }}>
                {p.name}
              </span>
            ))}
          </div>

          <a href="mailto:partner@zik4u.com" style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            border: 'none', borderRadius: 12, padding: '14px 32px',
            color: '#0A0A1A', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', textDecoration: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Talk to us — partner@zik4u.com
          </a>
        </motion.div>

        {/* What we capture / never touch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 80 }}
        >
          <h2 style={{
            fontSize: 24, fontWeight: 900,
            textAlign: 'center', marginBottom: 8,
          }}>
            Exactly what we capture. Exactly what we don&apos;t.
          </h2>
          <p style={{
            color: C.muted, fontSize: 14, textAlign: 'center', marginBottom: 40,
          }}>
            No ambiguity. No fine print.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* We capture */}
            <div style={{
              background: `rgba(0,255,178,0.04)`,
              border: `1px solid rgba(0,255,178,0.2)`,
              borderRadius: 16, padding: '24px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                color: C.mint, textTransform: 'uppercase' as const, marginBottom: 16,
              }}>
                What we capture
              </div>
              {WHAT_WE_CAPTURE.map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(0,255,178,0.08)',
                  fontSize: 14,
                }}>
                  <span style={{ color: item.color, fontWeight: 700, fontSize: 16 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* We never touch */}
            <div style={{
              background: `rgba(255,60,172,0.04)`,
              border: `1px solid rgba(255,60,172,0.2)`,
              borderRadius: 16, padding: '24px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                color: C.pink, textTransform: 'uppercase' as const, marginBottom: 16,
              }}>
                What we never touch
              </div>
              {WHAT_WE_NEVER_TOUCH.map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,60,172,0.08)',
                  fontSize: 14,
                }}>
                  <span style={{ color: item.color, fontWeight: 700, fontSize: 16 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 6 guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 80 }}
        >
          <h2 style={{
            fontSize: 24, fontWeight: 900,
            textAlign: 'center', marginBottom: 8,
          }}>
            Six guarantees we stand behind.
          </h2>
          <p style={{ color: C.muted, fontSize: 14, textAlign: 'center', marginBottom: 40 }}>
            Technically verifiable. Legally documented. Open for audit.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {GUARANTEES.map(g => (
              <div key={g.title} style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '24px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{g.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{g.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{g.body}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The Last.fm precedent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 80 }}
        >
          <div style={{
            background: C.card,
            border: `1px solid rgba(0,212,255,0.15)`,
            borderRadius: 20, padding: '40px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              color: C.cyan, textTransform: 'uppercase' as const, marginBottom: 16,
            }}>
              20 years of legal precedent
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>
              The scrobbling model is established law.
            </h3>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 580, margin: '0 auto' }}>
              Last.fm has operated the metadata scrobbling model since 2003 — acquired by CBS,
              then by Songkick, operating continuously without legal challenge from any streaming platform.
              Zik4U follows the same model with stronger privacy guarantees:
              explicit GDPR consent, anonymization by default, and no platform credential access.
              We are not a new category. We are a better implementation of a proven one.
            </p>
          </div>
        </motion.div>

        {/* How it benefits you */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 80 }}
        >
          <h2 style={{
            fontSize: 24, fontWeight: 900,
            textAlign: 'center', marginBottom: 8,
          }}>
            What Zik4U does for your platform.
          </h2>
          <p style={{ color: C.muted, fontSize: 14, textAlign: 'center', marginBottom: 40 }}>
            Every Zik4U user is an active listener on your platform. We make them more engaged.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              {
                metric: '+34%',
                label: 'Average re-listen rate',
                body: 'Users who share a track on Zik4U return to listen again at a significantly higher rate.',
                color: C.mint,
              },
              {
                metric: '100%',
                label: 'Streams stay on your platform',
                body: 'Every play triggered from Zik4U goes through your deep link. You keep the stream. You keep the royalty.',
                color: C.cyan,
              },
              {
                metric: '×3',
                label: 'Social sharing multiplier',
                body: 'Tracks shared via Zik4U Now Cards and listening rooms generate 3× more platform visits than standard shares.',
                color: C.purple,
              },
            ].map(stat => (
              <div key={stat.label} style={{
                background: `${stat.color}08`,
                border: `1px solid ${stat.color}22`,
                borderRadius: 14, padding: '24px',
                textAlign: 'center' as const,
              }}>
                <div style={{
                  fontSize: 40, fontWeight: 900, color: stat.color, marginBottom: 8,
                }}>
                  {stat.metric}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                  {stat.body}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            background: C.card,
            border: `1px solid rgba(0,212,255,0.15)`,
            borderRadius: 20, padding: '56px 40px',
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
            Let&apos;s build this together.
          </h2>
          <p style={{
            color: C.muted, fontSize: 15, lineHeight: 1.7,
            maxWidth: 480, margin: '0 auto 32px',
          }}>
            We believe streaming platforms and social music networks are natural allies.
            You bring the catalog. We bring the community.
            Let&apos;s talk about what a formal partnership looks like.
          </p>
          <a href="mailto:partner@zik4u.com" style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`,
            borderRadius: 14, padding: '16px 40px',
            color: '#0A0A1A', fontSize: 16, fontWeight: 900,
            textDecoration: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            partner@zik4u.com
          </a>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 16 }}>
            We respond within 48 hours. No sales pitch — a real conversation.
          </p>
        </motion.div>

      </div>
    </main>
  );
}
