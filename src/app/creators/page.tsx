'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PLATFORM_OPTIONS = [
  { value: 'spotify',       label: 'Spotify' },
  { value: 'apple_music',   label: 'Apple Music' },
  { value: 'deezer',        label: 'Deezer' },
  { value: 'soundcloud',    label: 'SoundCloud' },
  { value: 'tidal',         label: 'Tidal' },
  { value: 'youtube_music', label: 'YouTube Music' },
  { value: 'other',         label: 'Other' },
] as const;

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const C = {
  bg: '#0A0A1A', card: '#12122A', border: 'rgba(255,255,255,0.08)',
  cyan: '#00D4FF', mint: '#00FFB2', pink: '#FF3CAC',
  purple: '#7B2FFF', gold: '#FFB800',
  text: '#fff', muted: 'rgba(255,255,255,0.5)',
};

const STORY_TEXT = `I just joined Zik4U. You can now see what I'm actually listening to, in real time.\nLink in bio 👇\n#Zik4U #Music`;

const FEATURES_MONETIZE = [
  {
    emoji: '💰',
    title: 'Monthly subscriptions',
    body: 'You keep 80% of every subscription. Zik4U takes 20%. Direct monthly payment via Trolley. Web subscriptions are fairly priced — stores add 15% on their end.',
    color: C.mint,
  },
  {
    emoji: '🎵',
    title: 'Exclusive Drops',
    body: '5 moods: Discovery, Obsession, Nostalgia, Comfort, Moving. Share a track with its emotional context — for subscribers only.',
    color: C.pink,
  },
  {
    emoji: '📊',
    title: 'Creator Analytics',
    body: 'Full dashboard: revenue, new subscribers, music compatibility with your community, your top-performing tracks.',
    color: C.cyan,
  },
  {
    emoji: '💳',
    title: 'Direct payments',
    body: 'Via Trolley — automatic bank transfer every month. Minimum threshold $25. You keep 70% of subscription revenue.',
    color: C.gold,
  },
];

const FEATURES_VISIBILITY = [
  {
    emoji: '🎁',
    title: 'WrappedCreator',
    body: '6 shareable cards generated automatically: your top track, your archetype, your first listens. Zik4U\'s viral lever. Your fans reshare them.',
    color: C.pink,
  },
  {
    emoji: '👂',
    title: 'First Ear',
    body: 'Badge visible on your profile: you discovered this artist before everyone. Your subscribers see your influence. It validates your curation.',
    color: C.mint,
  },
  {
    emoji: '🎯',
    title: 'Compatibility Score',
    body: 'Every fan sees their music compatibility score with you. It creates a strong bond — it\'s not just a subscription, it\'s an affinity.',
    color: C.cyan,
  },
  {
    emoji: '🔔',
    title: 'Push notifications',
    body: 'When you post a Drop, your subscribers get an instant push notification. No algorithm between you and your community.',
    color: C.purple,
  },
];

const FEATURES_PRESENCE = [
  {
    emoji: '📡',
    title: 'Live listening feed',
    body: 'Your fans see what you\'re listening to in real time. Not what you want to show — what you actually listen to. That\'s authenticity.',
    color: C.cyan,
  },
  {
    emoji: '🎧',
    title: 'Pulse — Live Rooms',
    body: 'Launch a live listening session with your community. Same track, same moment, real-time reactions. A collective experience around your music.',
    color: C.purple,
  },
  {
    emoji: '🃏',
    title: 'Public profile zik4u.com',
    body: 'Every creator has their public page zik4u.com/creator/[username]. Your fans can subscribe directly from the web.',
    color: C.pink,
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Connect your streaming services',
    body: 'Spotify, Apple Music, YouTube Music. Zik4U automatically captures your real listening. No manual input.',
    color: C.cyan,
  },
  {
    number: '02',
    title: 'Activate the Creator Studio',
    body: 'Create your subscription tiers, publish your first exclusive Drops, set up your public profile. 10 minutes.',
    color: C.mint,
  },
  {
    number: '03',
    title: 'Share your WrappedCreator',
    body: 'Your 6 shareable cards are generated automatically. Post them on your channels. Your fans follow the link.',
    color: C.pink,
  },
  {
    number: '04',
    title: 'Receive your revenue every month',
    body: 'Automatic transfer. You keep 70%. The rest funds the platform and operational costs.',
    color: C.gold,
  },
];

function FeatureCard({ emoji, title, body, color }: {
  emoji: string; title: string; body: string; color: string;
}) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 24,
      borderTop: `2px solid ${color}`,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 21, color: C.muted, lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

function SectionTitle({ children, color }: { children: string; color: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.18em', color, textTransform: 'uppercase', marginBottom: 8 }}>
        {children}
      </p>
      <div style={{ width: 32, height: 2, background: color, borderRadius: 1 }} />
    </div>
  );
}

export default function CreatorsPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Creator waitlist form state
  const [wlEmail, setWlEmail] = useState('');
  const [wlArtistName, setWlArtistName] = useState('');
  const [wlPlatform, setWlPlatform] = useState('');
  const [wlLoading, setWlLoading] = useState(false);
  const [wlSubmitted, setWlSubmitted] = useState(false);
  const [wlError, setWlError] = useState('');

  const handleWaitlistSubmit = async () => {
    if (!wlEmail || !wlArtistName || !wlPlatform) { return; }
    setWlLoading(true);
    setWlError('');
    try {
      const res = await fetch('/api/creator-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: wlEmail, artist_name: wlArtistName, main_platform: wlPlatform }),
      });
      const data = await res.json();
      if (!res.ok) { setWlError(data.error ?? 'Something went wrong'); return; }
      setWlSubmitted(true);
    } catch {
      setWlError('Network error — please try again.');
    } finally {
      setWlLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(STORY_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: 'Inter, system-ui, sans-serif', color: C.text }}>

      <nav style={{ display:'flex', alignItems:'center',
        justifyContent:'space-between', padding:'16px 20px',
        maxWidth:900, margin:'0 auto' }}>
        <button onClick={() => router.push('/')}
          style={{ background:`linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            border:'none', fontSize:20, fontWeight:900,
            letterSpacing:'0.2em', cursor:'pointer',
            fontFamily:'Inter, system-ui, sans-serif', padding:0 }}>
          ZIK4U
        </button>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => router.push('/listeners')}
            style={{ background:'rgba(255,255,255,0.07)',
              border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:20, padding:'7px 14px',
              fontSize:19, fontWeight:700, color:'#fff',
              cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif' }}>
            Listeners
          </button>
          <button onClick={() => router.push('/fans')}
            style={{ background:'rgba(255,255,255,0.07)',
              border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:20, padding:'7px 14px',
              fontSize:19, fontWeight:700, color:'#fff',
              cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif' }}>
            Fans
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ marginBottom: 80 }}>
          <p style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.15em', color: C.pink, textTransform: 'uppercase', marginBottom: 24 }}>
            For Creators
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 76px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Your real music.{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your real community.
            </span>
          </h1>
          <p style={{ fontSize:'clamp(15px, 2vw, 18px)',
            color:'rgba(255,255,255,0.55)', lineHeight:1.7,
            maxWidth:520, marginBottom:32 }}>
            No algorithm between you and your fans.
            Your subscribers follow what you actually listen to.<br />
            <strong style={{ color:'#FF3CAC', fontWeight:700 }}>
              70% of revenue. For real.
            </strong>
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Become a creator — iOS →
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '14px 28px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Become a creator — Android →
            </a>
          </div>
        </motion.div>

        {/* 4 steps */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.pink}>How it works</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STEPS.map((step) => (
              <div key={step.number} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: step.color, fontFamily: 'monospace', flexShrink: 0, lineHeight: 1 }}>{step.number}</span>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: C.text }}>{step.title}</h3>
                  <p style={{ fontSize: 21, color: C.muted, margin: 0, lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Monetization */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.gold}>Monetization</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_MONETIZE.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Visibility */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.mint}>Visibility &amp; virality</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_VISIBILITY.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Live presence */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.purple}>Live presence</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_PRESENCE.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Social proof — copy the post */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ background: `linear-gradient(135deg, rgba(255,60,172,0.06), rgba(123,47,255,0.04))`, borderRadius: 20, padding: 32, border: `1px solid rgba(255,60,172,0.15)`, marginBottom: 48 }}>
          <p style={{ fontSize: 19, fontWeight: 700, letterSpacing: '0.15em', color: C.pink, textTransform: 'uppercase', marginBottom: 16 }}>
            Announce to your community
          </p>
          <pre style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', marginBottom: 16 }}>
            {STORY_TEXT}
          </pre>
          <button onClick={handleCopy} style={{ background: copied ? 'rgba(0,255,178,0.1)' : C.card, border: `1px solid ${copied ? C.mint : C.border}`, borderRadius: 8, padding: '10px 20px', color: copied ? C.mint : C.muted, fontSize: 17, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {copied ? '✓ Copied!' : 'Copy the post →'}
          </button>
        </motion.div>

        {/* Creator Waitlist */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px', background: `linear-gradient(135deg, rgba(255,60,172,0.06), rgba(123,47,255,0.04))`, borderRadius: 24, border: `1px solid rgba(255,60,172,0.15)`, marginBottom: 24 }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>
            Be among the first creators.
          </h2>
          <p style={{ color: C.muted, fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
            We'll reach out personally before public launch.
          </p>

          {wlSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: 32 }}>✅</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: C.mint, marginBottom: 8 }}>You're on the list.</p>
              <p style={{ color: C.muted, fontSize: 18 }}>
                We'll reach out personally before public launch. For real.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={wlEmail}
                onChange={(e) => setWlEmail(e.target.value)}
                style={{ padding: '14px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 17, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none' }}
              />
              <input
                type="text"
                placeholder="Your artist name"
                value={wlArtistName}
                onChange={(e) => setWlArtistName(e.target.value)}
                maxLength={100}
                style={{ padding: '14px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 17, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none' }}
              />
              <select
                value={wlPlatform}
                onChange={(e) => setWlPlatform(e.target.value)}
                style={{ padding: '14px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: wlPlatform ? C.text : C.muted, fontSize: 17, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', cursor: 'pointer' }}
              >
                <option value="" disabled>Your main platform</option>
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ color: C.text, background: C.bg }}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {wlError && (
                <p style={{ color: '#FF3C3C', fontSize: 15, margin: 0 }}>{wlError}</p>
              )}
              <button
                onClick={handleWaitlistSubmit}
                disabled={wlLoading || !wlEmail || !wlArtistName || !wlPlatform}
                style={{
                  padding: '15px 28px',
                  background: (wlLoading || !wlEmail || !wlArtistName || !wlPlatform)
                    ? 'rgba(255,60,172,0.3)'
                    : `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                  borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19,
                  border: 'none', cursor: (wlLoading || !wlEmail || !wlArtistName || !wlPlatform) ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'opacity 0.2s',
                }}
              >
                {wlLoading ? 'Sending...' : 'Join the waitlist →'}
              </button>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '36px 0 28px' }} />

          {/* Download buttons as fallback */}
          <p style={{ textAlign: 'center', color: C.muted, fontSize: 16, marginBottom: 16 }}>
            Or download the app directly:
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '12px 24px', background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 17, textDecoration: 'none' }}>
              Download — iOS
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '12px 24px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 17, textDecoration: 'none' }}>
              Download — Android
            </a>
          </div>
        </motion.div>

      </div>

        <motion.div initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ textAlign:'center', padding:'48px 0 80px',
            borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:40 }}>
          <div style={{ fontSize:'clamp(28px, 4vw, 32px)', fontWeight:900,
            marginBottom:8, lineHeight:1.2 }}>
            Get started.{' '}
            <span style={{ background:`linear-gradient(90deg, #FF3CAC, #7B2FFF)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:19,
            marginBottom:28 }}>
            Your Creator Studio is waiting. Free to start.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center',
            flexWrap:'wrap' }}>
            <a href={APP_STORE_URL}
              style={{ padding:'15px 28px',
                background:`linear-gradient(135deg, #FF3CAC, #7B2FFF)`,
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:19, textDecoration:'none' }}>
              App Store →
            </a>
            <a href={PLAY_STORE_URL}
              style={{ padding:'15px 28px', background:'#12122A',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:19, textDecoration:'none' }}>
              Google Play →
            </a>
          </div>
        </motion.div>
    </main>
  );
}
