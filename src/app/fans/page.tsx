'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { searchCreators, getFeaturedCreators } from '@/lib/creators';
import type { SearchResult } from '@/types';

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const C = {
  bg: '#0A0A1A', card: '#12122A', border: 'rgba(255,255,255,0.08)',
  cyan: '#00D4FF', mint: '#00FFB2', pink: '#FF3CAC',
  purple: '#7B2FFF', gold: '#FFB800',
  text: '#fff', muted: 'rgba(255,255,255,0.5)',
};

const PLACEHOLDER_CREATORS = [
  { handle: 'harmony', initials: 'H', archetype: '🌙 Night Explorer', quote: 'Music is my 3am language', compat: '87%', grad: 'linear-gradient(135deg, #7B2FFF, #FF3CAC)' },
  { handle: 'marco', initials: 'M', archetype: '💜 Deep Feeler', quote: 'Every track leaves a mark', compat: '82%', grad: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' },
  { handle: 'luna', initials: 'L', archetype: '🌍 Cultural Nomad', quote: 'No borders, only beats', compat: '91%', grad: 'linear-gradient(135deg, #00D4FF, #00FFB2)' },
  { handle: 'tyler', initials: 'T', archetype: '⚡ Obsessive Fan', quote: 'One artist. Infinite replays.', compat: '79%', grad: 'linear-gradient(135deg, #FFB800, #FF3CAC)' },
];

const WHAT_YOU_GET = [
  {
    emoji: '📡',
    title: 'Real listening feed',
    body: 'See what your creator actually listens to in real time. Not their curated playlist. What they play in the morning, at night, when no one is watching. The truth.',
    color: C.cyan,
  },
  {
    emoji: '🎵',
    title: 'Exclusive Drops',
    body: '5 moods: Discovery, Obsession, Nostalgia, Comfort, Moving. A track shared with its emotional context — for subscribers only.',
    color: C.pink,
  },
  {
    emoji: '🎯',
    title: 'Compatibility Score',
    body: 'Your music compatibility score with the creator. Based on your real shared listens. Not just reading their feed — measuring your affinity.',
    color: C.mint,
  },
  {
    emoji: '🃏',
    title: 'Fan Card',
    body: 'A personalized card: your score, your shared artists, your rank among their fans. Shareable. Living proof of your belonging.',
    color: C.purple,
  },
  {
    emoji: '🎧',
    title: 'Pulse — Listen Together',
    body: 'Join a live listening room started by the creator. Same track, same moment, real-time reactions. A collective experience.',
    color: C.purple,
  },
  {
    emoji: '🔔',
    title: 'Push notifications',
    body: 'When your creator posts a Drop or launches a Pulse session, you get an instant notification. No algorithm filters it.',
    color: C.gold,
  },
];

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

export default function FansPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [creators, setCreators] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [fanEmail, setFanEmail] = useState('');
  const [fanSubmitted, setFanSubmitted] = useState(false);
  const [fanLoading, setFanLoading] = useState(false);

  useEffect(() => {
    getFeaturedCreators()
      .then(setCreators)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      getFeaturedCreators().then(setCreators);
      return;
    }
    const t = setTimeout(() => {
      setSearching(true);
      searchCreators(query)
        .then(setCreators)
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleFanWaitlist = async () => {
    if (!fanEmail.trim() || fanLoading) return;
    setFanLoading(true);
    try {
      const res = await fetch('/api/pulse-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fanEmail }),
      });
      if (res.ok) setFanSubmitted(true);
    } catch { /* silent */ }
    finally { setFanLoading(false); }
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
          <button onClick={() => router.push('/creators')}
            style={{ background:`linear-gradient(135deg, #FF3CAC, #7B2FFF)`,
              border:'none', borderRadius:20, padding:'7px 14px',
              fontSize:19, fontWeight:700, color:'#fff',
              cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif' }}>
            Creators
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.15em', color: C.mint, textTransform: 'uppercase', marginBottom: 24 }}>
            For Fans
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 76px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Follow what they listen to.{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.mint}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              For real.
            </span>
          </h1>
          <p style={{ fontSize:'clamp(15px, 2vw, 18px)',
            color:'rgba(255,255,255,0.55)', lineHeight:1.7,
            maxWidth:520, marginBottom:32 }}>
            Not the playlist they want to show you.
            What they play in the morning, at night, when no one is watching.<br />
            <strong style={{ color:'#00FFB2', fontWeight:700 }}>
              The musical truth. For real.
            </strong>
          </p>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap',
            marginTop:8 }}>
            <a href={APP_STORE_URL}
              style={{ padding:'14px 24px',
                background:`linear-gradient(135deg, #00FFB2, #00D4FF)`,
                borderRadius:12, color:'#0A0A1A', fontWeight:800,
                fontSize:18, textDecoration:'none' }}>
              Download — iOS →
            </a>
            <a href={PLAY_STORE_URL}
              style={{ padding:'14px 24px', background:'#12122A',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:18, textDecoration:'none' }}>
              Download — Android →
            </a>
          </div>
          <p style={{ fontSize:13, color:C.muted, marginTop:12, textAlign:'center' }}>
            Free. No card required.
          </p>
        </motion.div>

        {/* What you get */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.mint}>What you get</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {WHAT_YOU_GET.map(item => (
              <div key={item.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, borderTop: `2px solid ${item.color}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>{item.title}</h3>
                <p style={{ fontSize: 21, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Creator search */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.cyan}>Find your creator</SectionTitle>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for a creator..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 19, outline: 'none', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}
          />

          {loading || searching ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>Loading...</div>
          ) : creators.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {creators.map(creator => (
                <button
                  key={creator.id}
                  onClick={() => router.push(`/creator/${creator.username}`)}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, system-ui, sans-serif', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.mint)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  {creator.avatarUrl && (
                    <img src={creator.avatarUrl} alt={creator.username} style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 12, objectFit: 'cover' }} />
                  )}
                  <div style={{ fontWeight: 700, fontSize: 19, color: C.text, marginBottom: 4 }}>
                    {creator.displayName ?? creator.username}
                  </div>
                  <div style={{ fontSize: 19, color: C.muted }}>@{creator.username}</div>
                  {creator.subscriberCount !== undefined && (
                    <div style={{ fontSize: 15, color: C.mint, marginTop: 8 }}>
                      {creator.subscriberCount} subscriber{creator.subscriberCount > 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>No creator found.</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {PLACEHOLDER_CREATORS.map(creator => (
                  <div key={creator.handle} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: creator.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff' }}>
                      {creator.initials}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>@{creator.handle}</div>
                    <div style={{ fontSize: 13, color: C.mint, fontWeight: 600 }}>{creator.archetype}</div>
                    <div style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', lineHeight: 1.4 }}>"{creator.quote}"</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 13, color: C.muted, opacity: 0.5 }}>🔒 {creator.compat} match</span>
                    </div>
                    <a href={APP_STORE_URL} style={{ display: 'block', textAlign: 'center', padding: '8px 14px', background: `linear-gradient(135deg, ${C.mint}, ${C.cyan})`, borderRadius: 8, color: '#0A0A1A', fontWeight: 700, fontSize: 15, textDecoration: 'none', marginTop: 4 }}>
                      Subscribe →
                    </a>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, textAlign: 'center' }}>
                <p style={{ color: C.muted, fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>
                  First real creators arriving soon.<br />
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>Be notified →</span>
                </p>
                {fanSubmitted ? (
                  <p style={{ color: C.mint, fontSize: 15, fontWeight: 700 }}>✓ You're on the list!</p>
                ) : (
                  <div style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={fanEmail}
                      onChange={e => setFanEmail(e.target.value)}
                      style={{ flex: 1, minWidth: 200, padding: '10px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 15, fontFamily: 'Inter, system-ui, sans-serif', outline: 'none' }}
                    />
                    <button
                      onClick={handleFanWaitlist}
                      disabled={fanLoading || !fanEmail.trim()}
                      style={{ padding: '10px 18px', background: `linear-gradient(135deg, ${C.mint}, ${C.cyan})`, borderRadius: 10, color: '#0A0A1A', fontWeight: 700, fontSize: 15, border: 'none', cursor: fanLoading || !fanEmail.trim() ? 'not-allowed' : 'pointer', opacity: fanLoading || !fanEmail.trim() ? 0.5 : 1, fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {fanLoading ? '...' : 'Subscribe'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.section>

        {/* CTA download */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', padding: '64px 32px', background: `linear-gradient(135deg, rgba(0,255,178,0.06), rgba(0,212,255,0.04))`, borderRadius: 24, border: `1px solid rgba(0,255,178,0.15)` }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 16 }}>
            Join them{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.mint}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              on Zik4U.
            </span>
          </h2>
          <p style={{ color: C.muted, fontSize: 20, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
            Download the app to subscribe and access exclusive Drops.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${C.mint}, ${C.cyan})`, borderRadius: 12, color: '#0A0A1A', fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
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
            Discover their real music.{' '}
            <span style={{ background:`linear-gradient(90deg, #00FFB2, #00D4FF)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:19,
            marginBottom:28 }}>
            Download Zik4U. Find your creator.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center',
            flexWrap:'wrap' }}>
            <a href={APP_STORE_URL}
              style={{ padding:'15px 28px',
                background:`linear-gradient(135deg, #00FFB2, #00D4FF)`,
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
