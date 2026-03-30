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

const WHAT_YOU_GET = [
  {
    emoji: '📡',
    title: 'Feed d\'écoute réel',
    body: 'Vois ce que ton créateur écoute en temps réel. Pas sa playlist curatée. Ce qu\'il met le matin, ce qu\'il écoute la nuit. La vérité.',
    color: C.cyan,
  },
  {
    emoji: '🎵',
    title: 'Drops exclusifs',
    body: '5 moods : Découverte, Obsession, Nostalgie, Réconfort, Bouleversant. Partage un titre avec son ressenti — réservé à toi.',
    color: C.pink,
  },
  {
    emoji: '🎯',
    title: 'Score de compatibilité',
    body: 'Ton score de compatibilité musicale avec le créateur. Calculé sur vos vraies écoutes communes. Tu ne lis plus juste son feed — tu mesures votre affinité.',
    color: C.mint,
  },
  {
    emoji: '🃏',
    title: 'Fan Card',
    body: 'Une carte personnalisée : ton score, tes artistes en commun, ton rang parmi ses fans. Partageable. Preuve vivante de ton appartenance.',
    color: C.purple,
  },
  {
    emoji: '🎧',
    title: 'Pulse — Écouter ensemble',
    body: 'Rejoins une room d\'écoute live lancée par le créateur. Même titre, même moment, réactions en temps réel. Une expérience collective.',
    color: C.purple,
  },
  {
    emoji: '🔔',
    title: 'Notifications push',
    body: 'Quand ton créateur publie un Drop ou lance une session Pulse, tu reçois une notification immédiate. Aucun algorithme ne filtre.',
    color: C.gold,
  },
];

function SectionTitle({ children, color }: { children: string; color: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color, textTransform: 'uppercase', marginBottom: 8 }}>
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
              fontSize:15, fontWeight:700, color:'#fff',
              cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif' }}>
            Listeners
          </button>
          <button onClick={() => router.push('/creators')}
            style={{ background:`linear-gradient(135deg, #FF3CAC, #7B2FFF)`,
              border:'none', borderRadius:20, padding:'7px 14px',
              fontSize:15, fontWeight:700, color:'#fff',
              cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif' }}>
            Créateurs
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: C.mint, textTransform: 'uppercase', marginBottom: 24 }}>
            Pour les Fans
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 76px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Suis ce qu&apos;ils écoutent.{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.mint}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Pour de vrai.
            </span>
          </h1>
          <p style={{ fontSize:'clamp(15px, 2vw, 18px)',
            color:'rgba(255,255,255,0.55)', lineHeight:1.7,
            maxWidth:520, marginBottom:32 }}>
            Pas la playlist qu&apos;ils veulent te montrer.
            Ce qu&apos;ils mettent le matin, la nuit, quand personne ne regarde.<br />
            <strong style={{ color:'#00FFB2', fontWeight:700 }}>
              La vérité musicale. For real.
            </strong>
          </p>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap',
            marginTop:8 }}>
            <a href="https://apps.apple.com/app/zik4u/id6748722257"
              style={{ padding:'14px 24px',
                background:`linear-gradient(135deg, #00FFB2, #00D4FF)`,
                borderRadius:12, color:'#0A0A1A', fontWeight:800,
                fontSize:18, textDecoration:'none' }}>
              Télécharger — iOS →
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.zik4u.app"
              style={{ padding:'14px 24px', background:'#12122A',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:18, textDecoration:'none' }}>
              Télécharger — Android →
            </a>
          </div>
        </motion.div>

        {/* Ce que tu obtiens */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.mint}>Ce que tu obtiens</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {WHAT_YOU_GET.map(item => (
              <div key={item.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, borderTop: `2px solid ${item.color}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>{item.title}</h3>
                <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recherche créateurs */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.cyan}>Trouve ton créateur</SectionTitle>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un créateur..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 15, outline: 'none', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}
          />

          {loading || searching ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>Chargement...</div>
          ) : creators.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
              {query ? 'Aucun créateur trouvé.' : 'Aucun créateur pour le moment.'}
            </div>
          ) : (
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
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>
                    {creator.displayName ?? creator.username}
                  </div>
                  <div style={{ fontSize: 15, color: C.muted }}>@{creator.username}</div>
                  {creator.subscriberCount !== undefined && (
                    <div style={{ fontSize: 11, color: C.mint, marginTop: 8 }}>
                      {creator.subscriberCount} abonné{creator.subscriberCount > 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.section>

        {/* CTA download */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', padding: '64px 32px', background: `linear-gradient(135deg, rgba(0,255,178,0.06), rgba(0,212,255,0.04))`, borderRadius: 24, border: `1px solid rgba(0,255,178,0.15)` }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 16 }}>
            Rejoins-les{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.mint}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              sur Zik4U.
            </span>
          </h2>
          <p style={{ color: C.muted, fontSize: 16, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
            Télécharge l&apos;app pour t&apos;abonner et accéder aux Drops exclusifs.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${C.mint}, ${C.cyan})`, borderRadius: 12, color: '#0A0A1A', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Télécharger — iOS
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '14px 32px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Télécharger — Android
            </a>
          </div>
        </motion.div>

      </div>

        <motion.div initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ textAlign:'center', padding:'48px 0 80px',
            borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:40 }}>
          <div style={{ fontSize:'clamp(22px, 4vw, 32px)', fontWeight:900,
            marginBottom:8, lineHeight:1.2 }}>
            Découvre leur vraie musique.{' '}
            <span style={{ background:`linear-gradient(90deg, #00FFB2, #00D4FF)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15,
            marginBottom:28 }}>
            Télécharge Zik4U. Trouve ton créateur.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center',
            flexWrap:'wrap' }}>
            <a href="https://apps.apple.com/app/zik4u/id6748722257"
              style={{ padding:'15px 28px',
                background:`linear-gradient(135deg, #00FFB2, #00D4FF)`,
                borderRadius:12, color:'#0A0A1A', fontWeight:800,
                fontSize:15, textDecoration:'none' }}>
              App Store →
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.zik4u.app"
              style={{ padding:'15px 28px', background:'#12122A',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:15, textDecoration:'none' }}>
              Google Play →
            </a>
          </div>
        </motion.div>
    </main>
  );
}
