'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Connect your streaming services',
    body: 'Spotify, Apple Music, YouTube Music — automatic capture. No manual logging.',
  },
  {
    number: '02',
    title: 'Your fans subscribe to your Zik4U',
    body: 'They see what you actually listen to. In real time. Not your curated feed — your real taste.',
  },
  {
    number: '03',
    title: 'You earn. Every month.',
    body: 'Direct to your account. The more subscribers, the more you earn. Simple.',
  },
];

const STORY_TEXT = `I just joined Zik4U — you can now see what I'm actually listening to, in real time.
Link in bio 👇
#Zik4U #Music`;

export default function CreatorsPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(STORY_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1A',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#fff',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            border: 'none',
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.2em',
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          ZIK4U
        </button>
        <button
          onClick={() => router.push('/fans')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          Find a Creator →
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 120px' }}>

        {/* BLOC 1 — Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#FF3CAC',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            For Creators
          </p>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 32,
          }}>
            Your fans are already asking.
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #FF3CAC, #7B2FFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Now you get paid for the answer.
            </span>
          </h1>
          <p style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            maxWidth: 560,
          }}>
            Every time someone asks &ldquo;what are you listening to?&rdquo; in your comments,
            your DMs, your stories — that&apos;s money left on the table.
            Zik4U closes that gap.
          </p>
        </motion.div>

        {/* BLOC 2 — 80/20 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            marginBottom: 100,
            padding: '64px 48px',
            background: '#0D0D20',
            borderRadius: 32,
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: 'clamp(100px, 18vw, 180px)',
            fontWeight: 900,
            lineHeight: 0.9,
            background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 24,
          }}>
            80%
          </div>
          <p style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: '#fff',
            marginBottom: 12,
          }}>
            You keep eighty percent.
          </p>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
          }}>
            We take twenty. That&apos;s the deal.
            <br />
            No hidden fees. No complicated splits. No surprises.
          </p>
        </motion.div>

        {/* BLOC 3 — 3 étapes */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 900,
            marginBottom: 56,
            letterSpacing: '-0.02em',
          }}>
            How it works.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}
              >
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FF3CAC',
                  letterSpacing: '0.1em',
                  minWidth: 28,
                  paddingTop: 4,
                }}>
                  {step.number}
                </span>
                <div>
                  <p style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 8,
                  }}>
                    {step.title}
                  </p>
                  <p style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.6,
                  }}>
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BLOC 4 — Lien spécial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 900,
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            Your Zik4U profile
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #00D4FF, #00FFB2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              is your new link in bio.
            </span>
          </h2>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            maxWidth: 520,
            marginBottom: 40,
          }}>
            One link. Your real music taste. Your exclusive drops.
            Your subscriber community. Everything your fans want —
            in one place.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 24px',
            background: '#12122A',
            borderRadius: 12,
            border: '1px solid rgba(0,212,255,0.15)',
          }}>
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>
              zik4u.com/creator/
            </span>
            <span style={{
              fontSize: 15,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #00D4FF, #00FFB2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              yourname
            </span>
          </div>
        </motion.div>

        {/* BLOC 5 — Story CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            marginBottom: 100,
            padding: '48px',
            background: '#0D0D20',
            borderRadius: 32,
          }}
        >
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#00FFB2',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Tell your community
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 38px)',
            fontWeight: 900,
            marginBottom: 16,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            Your fans don&apos;t know you&apos;re here yet.
            <br />
            One story changes that.
          </h2>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 32,
            lineHeight: 1.6,
          }}>
            Post this on Instagram or TikTok. Your community will follow.
          </p>
          <div style={{
            background: '#0A0A1A',
            borderRadius: 16,
            padding: '24px',
            marginBottom: 20,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
              margin: 0,
            }}>
              {STORY_TEXT}
            </p>
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: '14px 28px',
              background: copied
                ? 'linear-gradient(135deg, #00FFB2, #00D4FF)'
                : '#1A1A35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 700,
              color: copied ? '#0A0A1A' : '#fff',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy this text'}
          </button>
        </motion.div>

        {/* BLOC 6 — CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            Ready to monetize
            <br />
            your real taste?
          </h2>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 40,
          }}>
            Set up your profile in minutes. Your first subscriber could be today.
          </p>
          <button
            onClick={() => router.push('/become-creator')}
            style={{
              padding: '18px 48px',
              background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              fontSize: 17,
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            Become a Creator →
          </button>
        </motion.div>

      </div>
    </main>
  );
}
