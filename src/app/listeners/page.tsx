'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const C = {
  bg: '#0A0A1A', card: '#12122A', border: 'rgba(255,255,255,0.08)',
  cyan: '#00D4FF', mint: '#00FFB2', pink: '#FF3CAC',
  purple: '#7B2FFF', gold: '#FFB800',
  text: '#fff', muted: 'rgba(255,255,255,0.5)',
};

const FEATURES_IDENTITY = [
  {
    emoji: '🎵',
    title: 'Your real music identity',
    body: 'Connect Spotify, Apple Music, YouTube Music. Every listen builds your profile automatically. No curation. No performance. The truth.',
    color: C.cyan,
  },
  {
    emoji: '🃏',
    title: 'Now Card',
    body: 'A live snapshot of your music identity today. Share it on Instagram, TikTok. People ask "what app is this?".',
    color: C.mint,
  },
  {
    emoji: '🌙',
    title: 'Your music archetype',
    body: '7 profiles — Night Explorer, Deep Feeler, Cultural Nomad, Obsessive Fan... Calculated from your real listens. Displayed on your profile.',
    color: C.purple,
  },
  {
    emoji: '📅',
    title: 'Weekly Insights',
    body: 'Every week: your track of the week, your discoveries, your emotional score. The summary of what your music says about you.',
    color: C.cyan,
  },
];

const FEATURES_CONNECTIONS = [
  {
    emoji: '🎯',
    title: 'Music Compatibility Score',
    body: 'A score from 0 to 100% between you and anyone. Based on your real shared listens from the last 30 days. Not an algorithmic approximation.',
    color: C.mint,
  },
  {
    emoji: '🎵',
    title: 'Music Match',
    body: 'Meet people who listen like you. For real. Not based on your photo. Based on what you listen to at 3am. Opt-in, 17+.',
    color: C.pink,
  },
  {
    emoji: '🎧',
    title: 'Pulse — Listen Together',
    body: 'Create a live listening room with your friends. Same track, same moment, real-time reactions. Or invite one person for a private moment together.',
    color: C.purple,
  },
  {
    emoji: '✨',
    title: 'Rare synchronicity',
    body: 'When you and someone else listen to the same obscure track on the same day — Zik4U tells you. You are 12 on the platform to have heard it.',
    color: C.purple,
  },
];

const FEATURES_MEMORY = [
  {
    emoji: '🌱',
    title: 'First Ear',
    body: 'Discovered an artist before everyone else? Zik4U badges you. You can see how many people you\'ve influenced since.',
    color: C.mint,
  },
  {
    emoji: '🎁',
    title: 'Zik4U Wrapped',
    body: '6 shareable cards that sum up your musical year. Your top artist, your dominant mood, your first listens. More honest than Spotify.',
    color: C.pink,
  },
  {
    emoji: '📈',
    title: 'Evolving Portrait',
    body: '12 months of music archetypes on a timeline. See how your music has evolved — and what it reveals about you.',
    color: C.cyan,
  },
  {
    emoji: '💌',
    title: 'Your Music Letter',
    body: 'Once a year, on the date of your sign-up, Zik4U generates a letter written from your data. Not stats — what your music wanted to tell you.',
    color: C.pink,
  },
];

function FeatureCard({ emoji, title, body, color }: {
  emoji: string; title: string; body: string; color: string;
}) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '24px',
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
      <p style={{
        fontSize: 15, fontWeight: 700, letterSpacing: '0.18em',
        color, textTransform: 'uppercase', marginBottom: 8,
      }}>{children}</p>
      <div style={{ width: 32, height: 2, background: color, borderRadius: 1 }} />
    </div>
  );
}

export default function ListenersPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async () => {
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pulse-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubmitted(true);
    } catch { /* silent */ }
    finally { setLoading(false); }
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
          <button onClick={() => router.push('/creators')}
            style={{ background:`linear-gradient(135deg, #FF3CAC, #7B2FFF)`,
              border:'none', borderRadius:20, padding:'7px 14px',
              fontSize:19, fontWeight:700, color:'#fff',
              cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif' }}>
            Creators
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
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }} style={{ marginBottom:56 }}>
          <p style={{ fontSize:19, fontWeight:700, letterSpacing:'0.18em',
            color:'#00D4FF', textTransform:'uppercase', marginBottom:16 }}>
            For Listeners
          </p>
          <h1 style={{ fontSize:'clamp(34px, 6vw, 68px)', fontWeight:900,
            lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:12 }}>
            You are what you listen to.{' '}
            <span style={{ background:`linear-gradient(90deg, #00D4FF, #00FFB2)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </h1>
          <p style={{ fontSize:'clamp(15px, 2vw, 18px)',
            color:'rgba(255,255,255,0.55)', lineHeight:1.7,
            maxWidth:520, marginBottom:32 }}>
            Not your curated playlist. Not your public profile.<br />
            Your real music identity — lived, shared, measured.{' '}
            <strong style={{ color:'#00FFB2', fontWeight:700 }}>For real.</strong>
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <a href={APP_STORE_URL}
              style={{ padding:'14px 24px',
                background:`linear-gradient(135deg, #00D4FF, #00FFB2)`,
                borderRadius:12, color:'#0A0A1A', fontWeight:800,
                fontSize:18, textDecoration:'none', flexShrink:0 }}>
              Download — iOS →
            </a>
            <a href={PLAY_STORE_URL}
              style={{ padding:'14px 24px',
                background:'#12122A',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:18, textDecoration:'none', flexShrink:0 }}>
              Download — Android →
            </a>
          </div>
          <p style={{ fontSize:13, color:C.muted, marginTop:12, textAlign:'center' }}>
            Free. No card required.
          </p>
        </motion.div>

        {/* Section 1 — Identity */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.cyan}>Your music identity</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_IDENTITY.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Section 2 — Connections */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.mint}>Real connections</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_CONNECTIONS.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Section 3 — Memory */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.pink}>Your music memory</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_MEMORY.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', padding: '64px 32px', background: `linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,255,178,0.04))`, borderRadius: 24, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>
            Ready to discover{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              who you really are?
            </span>
          </h2>
          <p style={{ color: C.muted, fontSize: 20, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
            Free. No card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`, borderRadius: 12, color: '#0A0A1A', fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Download — iOS
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '14px 32px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
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
            Ready to listen{' '}
            <span style={{ background:`linear-gradient(90deg, #00D4FF, #00FFB2)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              for real?
            </span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:19,
            marginBottom:28, lineHeight:1.6 }}>
            Join Zik4U. Your music identity is waiting.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center',
            flexWrap:'wrap' }}>
            <a href={APP_STORE_URL}
              style={{ padding:'15px 28px',
                background:`linear-gradient(135deg, #00D4FF, #00FFB2)`,
                borderRadius:12, color:'#0A0A1A', fontWeight:800,
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
