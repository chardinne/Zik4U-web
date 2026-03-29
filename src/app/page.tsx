'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const APP_STORE_URL  = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const C = {
  bg: '#0A0A1A', card: '#12122A', surface: '#1A1A35',
  border: 'rgba(255,255,255,0.07)',
  cyan: '#00D4FF', mint: '#00FFB2', pink: '#FF3CAC',
  purple: '#7B2FFF', gold: '#FFB800',
  text: '#F0F0FF', muted: 'rgba(255,255,255,0.45)', dim: 'rgba(255,255,255,0.18)',
} as const;

// ── Now Card simulation ───────────────────────────────────────────────────────

const NOW_CARDS = [
  { time: '23h47', track: 'ocean eyes',    artist: 'Billie Eilish',  mood: 'Nocturne',   moodEmoji: '🌙', moodColor: C.purple,  gradient: ['#1a0533','#0A0A1A'] as [string,string] },
  { time: '08h12', track: 'HUMBLE.',       artist: 'Kendrick Lamar', mood: 'Énergie',    moodEmoji: '🔥', moodColor: C.pink,    gradient: ['#2d0a00','#0A0A1A'] as [string,string] },
  { time: '14h33', track: 'Ylang Ylang',   artist: 'FKJ',            mood: 'Deep Focus', moodEmoji: '🌊', moodColor: C.cyan,    gradient: ['#001a2d','#0A0A1A'] as [string,string] },
  { time: '02h18', track: 'Pink + White',  artist: 'Frank Ocean',    mood: 'Mélancolie', moodEmoji: '💜', moodColor: '#9B59B6', gradient: ['#0d001a','#0A0A1A'] as [string,string] },
  { time: '19h55', track: 'Lose Yourself', artist: 'Eminem',         mood: 'Obsession',  moodEmoji: '⚡', moodColor: C.gold,    gradient: ['#1a1000','#0A0A1A'] as [string,string] },
];

function NowCardLive() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % NOW_CARDS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const card = NOW_CARDS[index];
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:340, margin:'0 auto' }}>
      <div style={{ position:'absolute', inset:-20, background:`radial-gradient(ellipse at center, ${card.moodColor}20, transparent 70%)`, borderRadius:40, pointerEvents:'none', zIndex:0, transition:'background 0.8s' }} />
      <AnimatePresence mode="wait">
        <motion.div key={index}
          initial={{ opacity:0, y:12, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:-8, scale:0.98 }}
          transition={{ duration:0.35, ease:'easeOut' }}
          style={{ position:'relative', zIndex:1, background:`linear-gradient(160deg, ${card.gradient[0]}, ${C.card})`, borderRadius:24, border:`1px solid ${card.moodColor}30`, padding:'24px 24px 20px', boxShadow:`0 0 40px ${card.moodColor}15, 0 8px 32px rgba(0,0,0,0.4)` }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg, ${card.moodColor}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                {card.moodEmoji}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text }}>@user</div>
                <div style={{ fontSize:10, color:C.muted }}>Night Explorer</div>
              </div>
            </div>
            <div style={{ fontSize:10, color:card.moodColor, fontFamily:'monospace', background:`${card.moodColor}12`, padding:'3px 8px', borderRadius:6, border:`1px solid ${card.moodColor}25` }}>{card.time}</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:C.muted, textTransform:'uppercase', marginBottom:6 }}>▶ NOW PLAYING</div>
            <div style={{ fontSize:20, fontWeight:900, color:C.text, lineHeight:1.2 }}>{card.track}</div>
            <div style={{ fontSize:14, color:C.muted, marginTop:4 }}>{card.artist}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:`${card.moodColor}12`, border:`1px solid ${card.moodColor}25`, borderRadius:999, padding:'4px 12px' }}>
              <span style={{ fontSize:14 }}>{card.moodEmoji}</span>
              <span style={{ fontSize:12, fontWeight:700, color:card.moodColor }}>{card.mood}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:2, marginLeft:4 }}>
              {[1,0.6,0.9,0.4,0.8,0.5,1].map((h,i) => (
                <motion.div key={i}
                  animate={{ scaleY:[h, h*0.4, h] }}
                  transition={{ duration:0.8+i*0.1, repeat:Infinity, ease:'easeInOut', delay:i*0.08 }}
                  style={{ width:3, height:16, background:card.moodColor, borderRadius:2, opacity:0.7, transformOrigin:'bottom' }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:16 }}>
        {NOW_CARDS.map((_,i) => (
          <div key={i} onClick={() => setIndex(i)} style={{ width:i===index?20:6, height:6, borderRadius:3, background:i===index?NOW_CARDS[index].moodColor:'rgba(255,255,255,0.15)', transition:'all 0.3s', cursor:'pointer' }} />
        ))}
      </div>
    </div>
  );
}

// ── App Screen Components ─────────────────────────────────────────────────────

function ScreenProfile() {
  return (
    <div style={{ width:220, background:C.bg, borderRadius:28, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 24px 64px rgba(0,0,0,0.5)`, flexShrink:0 }}>
      <div style={{ height:80, background:`linear-gradient(135deg, ${C.pink}66, ${C.purple}44)`, position:'relative', overflow:'hidden' }}>
        {[...Array(8)].map((_,i) => (
          <div key={i} style={{ position:'absolute', bottom:0, left:`${i*13}%`, width:'8%', height:`${18+Math.sin(i*0.9)*10}px`, background:`rgba(255,60,172,${0.12+Math.sin(i*0.5)*0.06})`, borderRadius:'3px 3px 0 0' }} />
        ))}
      </div>
      <div style={{ padding:'0 14px', marginTop:-24, marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, opacity:0.8 }} />
          <div style={{ position:'relative', width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', border:`2px solid ${C.bg}` }}>H</div>
        </div>
        <div style={{ fontSize:9, fontWeight:700, color:C.bg, background:`linear-gradient(90deg,${C.cyan},${C.mint})`, padding:'4px 10px', borderRadius:999, marginBottom:4 }}>Edit</div>
      </div>
      <div style={{ padding:'0 14px 14px' }}>
        <div style={{ fontSize:15, fontWeight:900, color:C.text, letterSpacing:0.5 }}>Harmony</div>
        <div style={{ fontSize:10, color:`rgba(255,60,172,0.6)`, fontFamily:'monospace', marginBottom:4 }}>@harmony</div>
        <div style={{ fontSize:10, color:C.muted, marginBottom:10, lineHeight:1.5 }}>🎵 Pop latina addict · Karol G forever</div>
        <div style={{ display:'flex', gap:0, marginBottom:10, background:C.surface, borderRadius:12, border:`1px solid rgba(255,60,172,0.15)`, overflow:'hidden' }}>
          {[['1.2K','ABONNÉS'],['$340','CE MOIS'],['24','DROPS']].map(([v,l],i) => (
            <div key={i} style={{ flex:1, textAlign:'center', padding:'8px 4px', borderRight:i<2?`1px solid rgba(255,60,172,0.1)`:undefined }}>
              <div style={{ fontSize:14, fontWeight:900, color:i===1?C.mint:i===2?C.pink:C.text }}>{v}</div>
              <div style={{ fontSize:7, color:C.muted, letterSpacing:1, textTransform:'uppercase', marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, ${C.pink}22, ${C.purple}15)`, borderRadius:12, padding:'8px 10px', border:`1px solid rgba(255,60,172,0.2)`, marginBottom:8 }}>
          <div style={{ fontSize:8, color:C.pink, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>▶ MY NOW</div>
          <div style={{ fontSize:11, fontWeight:800, color:C.text }}>PROVENZA</div>
          <div style={{ fontSize:9, color:C.muted }}>Karol G · 🌊 Feel Good</div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <span style={{ fontSize:14 }}>🌙</span>
          <div>
            <div style={{ fontSize:9, color:C.muted, letterSpacing:1, textTransform:'uppercase' }}>Archétype</div>
            <div style={{ fontSize:11, fontWeight:700, color:C.purple }}>Night Explorer</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenPulse() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const t = setInterval(() => setCount(c => c === 4 ? 5 : 4), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ width:220, background:C.bg, borderRadius:28, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 24px 64px rgba(0,0,0,0.5)`, flexShrink:0 }}>
      <div style={{ background:`linear-gradient(160deg, #001a2d, ${C.bg})`, padding:'18px 16px 14px' }}>
        <div style={{ fontSize:9, color:C.cyan, letterSpacing:2, textTransform:'uppercase', marginBottom:6, fontFamily:'monospace' }}>🎧 PULSE — LIVE SESSION</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg, ${C.cyan}33, ${C.purple}33)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, border:`1px solid ${C.cyan}30` }}>🎵</div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:C.text }}>Ylang Ylang</div>
            <div style={{ fontSize:10, color:C.muted }}>FKJ</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:40, marginBottom:14 }}>
          {[0.4,0.7,1,0.6,0.9,0.5,0.8,1,0.6,0.7,0.4,0.9,0.7,1,0.5].map((h,i) => (
            <motion.div key={i}
              animate={{ scaleY:[h, h*0.3, h] }}
              transition={{ duration:0.6+i*0.08, repeat:Infinity, ease:'easeInOut', delay:i*0.06 }}
              style={{ width:4, height:36, background:`linear-gradient(180deg, ${C.cyan}, ${C.purple})`, borderRadius:2, opacity:0.7+h*0.3, transformOrigin:'center' }}
            />
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex' }}>
            {['H','M','S','L'].map((l,i) => (
              <div key={i} style={{ width:28, height:28, borderRadius:14, background:`linear-gradient(135deg, ${[C.pink,C.cyan,C.mint,C.purple][i]}, ${[C.purple,C.mint,C.cyan,C.pink][i]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff', border:`2px solid ${C.bg}`, marginLeft:i>0?-8:0 }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, color:C.cyan, fontFamily:'monospace' }}>
            <motion.span animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.2, repeat:Infinity }}>
              {count} listening live
            </motion.span>
          </div>
        </div>
        <div style={{ display:'flex', gap:6, marginBottom:10 }}>
          {['🔥','😮','💜','⚡','🎵'].map((e,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:'4px 8px', fontSize:12, cursor:'pointer', border:`1px solid rgba(255,255,255,0.08)` }}>{e}</div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`, borderRadius:12, padding:'10px', textAlign:'center', cursor:'pointer' }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.bg }}>Join this session</div>
        </div>
      </div>
    </div>
  );
}

function ScreenCompatibility() {
  const score = 87;
  return (
    <div style={{ width:220, background:C.bg, borderRadius:28, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 24px 64px rgba(0,0,0,0.5)`, flexShrink:0 }}>
      <div style={{ padding:'18px 16px' }}>
        <div style={{ fontSize:9, color:C.mint, letterSpacing:2, textTransform:'uppercase', marginBottom:16, fontFamily:'monospace' }}>🎯 MUSIC COMPATIBILITY</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:16 }}>
          <div style={{ width:52, height:52, borderRadius:26, background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', border:`3px solid ${C.bg}`, zIndex:2 }}>H</div>
          <div style={{ zIndex:3, margin:'0 -8px', background:C.card, borderRadius:999, padding:'4px 10px', border:`1px solid ${C.mint}40`, boxShadow:`0 0 20px ${C.mint}30` }}>
            <span style={{ fontSize:16, fontWeight:900, color:C.mint }}>{score}%</span>
          </div>
          <div style={{ width:52, height:52, borderRadius:26, background:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:C.bg, border:`3px solid ${C.bg}`, zIndex:2 }}>M</div>
        </div>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:800, color:C.text }}>@harmony &amp; @marco</div>
          <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>Deep Feeler + Night Explorer</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${score}%` }} transition={{ duration:1.5, ease:'easeOut', delay:0.5 }}
              style={{ height:'100%', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, borderRadius:3 }} />
          </div>
        </div>
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>Artists in common</div>
          {['Frank Ocean','FKJ','Bon Iver'].map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:i<2?`1px solid rgba(255,255,255,0.04)`:undefined }}>
              <div style={{ width:22, height:22, borderRadius:6, background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>🎵</div>
              <span style={{ fontSize:11, color:C.text, fontWeight:600 }}>{a}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <div style={{ flex:1, background:`rgba(255,60,172,0.08)`, borderRadius:10, padding:'6px 8px', border:`1px solid rgba(255,60,172,0.15)` }}>
            <div style={{ fontSize:14 }}>🌙</div>
            <div style={{ fontSize:9, color:C.pink, fontWeight:700, marginTop:2 }}>Night Explorer</div>
          </div>
          <div style={{ flex:1, background:`rgba(0,212,255,0.08)`, borderRadius:10, padding:'6px 8px', border:`1px solid rgba(0,212,255,0.15)` }}>
            <div style={{ fontSize:14 }}>💜</div>
            <div style={{ fontSize:9, color:C.cyan, fontWeight:700, marginTop:2 }}>Deep Feeler</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenNowCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i+1)%NOW_CARDS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const card = NOW_CARDS[idx];
  return (
    <div style={{ width:220, background:C.bg, borderRadius:28, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 24px 64px rgba(0,0,0,0.5)`, flexShrink:0 }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
          style={{ background:`linear-gradient(160deg, ${card.gradient[0]}, ${C.bg})`, padding:'18px 16px', minHeight:240, display:'flex', flexDirection:'column' }}>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:3, textTransform:'uppercase', fontFamily:'monospace', marginBottom:10 }}>MY NOW</div>
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <div style={{ fontSize:40 }}>{card.moodEmoji}</div>
            <div style={{ fontFamily:'monospace', fontSize:16, fontWeight:900, color:'#fff', letterSpacing:4, marginTop:6 }}>{card.mood.toUpperCase()}</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8, fontFamily:'monospace' }}>RIGHT NOW</div>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:2 }}>{card.track}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>{card.artist}</div>
          </div>
          <div style={{ marginTop:14, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>@user · {card.time}</span>
            <span style={{ fontSize:8, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>zik4u.com</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ScreenFeed() {
  const posts = [
    { user:'@harmony', emoji:'🌊', mood:'Feel Good',  track:'PROVENZA',    artist:'Karol G',     time:'2m',  reactions:12 },
    { user:'@marco',   emoji:'💜', mood:'Mélancolie', track:'Self Control', artist:'Frank Ocean', time:'8m',  reactions:7  },
    { user:'@sofia',   emoji:'⚡', mood:'Obsession',  track:'HUMBLE.',     artist:'Kendrick',    time:'15m', reactions:23 },
  ];
  return (
    <div style={{ width:220, background:C.bg, borderRadius:28, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 24px 64px rgba(0,0,0,0.5)`, flexShrink:0 }}>
      <div style={{ padding:'14px 14px 0' }}>
        <div style={{ fontSize:9, color:C.cyan, letterSpacing:2, textTransform:'uppercase', marginBottom:12, fontFamily:'monospace' }}>🎵 LIVE FEED</div>
        {posts.map((p,i) => (
          <div key={i} style={{ marginBottom:10, background:C.surface, borderRadius:14, padding:'10px 12px', border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.cyan }}>{p.user}</span>
              <span style={{ fontSize:8, color:C.muted, fontFamily:'monospace' }}>{p.time}</span>
            </div>
            <div style={{ fontSize:12, fontWeight:800, color:C.text, marginBottom:1 }}>{p.track}</div>
            <div style={{ fontSize:10, color:C.muted, marginBottom:6 }}>{p.artist}</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:4, background:`rgba(255,255,255,0.04)`, borderRadius:20, padding:'3px 8px', border:`1px solid rgba(255,255,255,0.07)` }}>
                <span style={{ fontSize:10 }}>{p.emoji}</span>
                <span style={{ fontSize:8, color:C.muted, fontFamily:'monospace', letterSpacing:0.5 }}>{p.mood}</span>
              </div>
              <span style={{ fontSize:9, color:C.muted }}>♥ {p.reactions}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenWrapped() {
  return (
    <div style={{ width:220, background:C.bg, borderRadius:28, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)`, boxShadow:`0 24px 64px rgba(0,0,0,0.5)`, flexShrink:0 }}>
      <div style={{ position:'relative', background:`linear-gradient(160deg, ${C.purple}, ${C.pink}, ${C.cyan})`, padding:'18px 16px 16px', minHeight:200, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:8, color:'rgba(255,255,255,0.6)', letterSpacing:3, textTransform:'uppercase', fontFamily:'monospace', marginBottom:4 }}>ZIK4U</div>
          <div style={{ fontSize:32, fontWeight:900, color:'#fff', letterSpacing:4, lineHeight:1 }}>WRAPPED</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.65)', marginTop:4 }}>2025 · Your musical life</div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:20 }}>
          {[['8.4K','Plays'],['47d','Best streak'],['#1','Night Explorer']].map(([v,l],i) => (
            <div key={i} style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:900, color:'#fff', lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:8, color:'rgba(255,255,255,0.55)', marginTop:2, lineHeight:1.3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, fontSize:8, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>@harmony · zik4u.com</div>
      </div>
    </div>
  );
}

// ── Scrolling Column ──────────────────────────────────────────────────────────

function ScrollColumn({ screens, direction, speed = 40 }: {
  screens: React.ReactNode[];
  direction: 'up' | 'down';
  speed?: number;
}) {
  const doubled = [...screens, ...screens];
  const itemHeight = 280 + 20; // approx card height + gap
  return (
    <div style={{ overflow:'hidden', position:'relative', height:'100%', maskImage:'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskImage:'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
      <motion.div
        animate={{ y: direction === 'up'
          ? [0, -(screens.length * itemHeight)]
          : [-(screens.length * itemHeight), 0]
        }}
        transition={{ duration: screens.length * speed, repeat: Infinity, ease: 'linear' }}
        style={{ display:'flex', flexDirection:'column', gap:20 }}
      >
        {doubled.map((screen, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'center' }}>
            {screen}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── CTA Card ──────────────────────────────────────────────────────────────────

function CTACard({ href, label, tagline, pain, gradient, textColor, border }: {
  href: string; label: string; tagline: string; pain: string;
  gradient?: string; textColor: string; border?: string;
}) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ scale:1.02, y:-2 }}
      whileTap={{ scale:0.98 }}
      onClick={() => router.push(href)}
      style={{ width:'100%', padding:'22px 28px', background:gradient??C.card, border:border??'none', borderRadius:20, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:6, textAlign:'left' }}
    >
      <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:textColor==='#fff'?'rgba(255,255,255,0.5)':'rgba(10,10,26,0.5)', textTransform:'uppercase' as const }}>{label}</span>
      <span style={{ fontSize:20, fontWeight:900, color:textColor, lineHeight:1.2 }}>{tagline}</span>
      <span style={{ fontSize:13, color:textColor==='#fff'?'rgba(255,255,255,0.45)':'rgba(10,10,26,0.55)', lineHeight:1.5, marginTop:2 }}>{pain}</span>
      <span style={{ marginTop:8, fontSize:13, fontWeight:700, color:textColor }}>Explore →</span>
    </motion.button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const leftScreens  = [<ScreenProfile key="p" />, <ScreenPulse key="pu" />, <ScreenWrapped key="w" />];
  const rightScreens = [<ScreenNowCard key="n" />, <ScreenCompatibility key="c" />, <ScreenFeed key="f" />];

  return (
    <main style={{ minHeight:'100vh', backgroundColor:C.bg, fontFamily:'Inter, system-ui, sans-serif', color:C.text, overflowX:'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 32px', background:'rgba(10,10,26,0.85)', backdropFilter:'blur(16px)', borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
        <span style={{ fontSize:20, fontWeight:900, letterSpacing:'0.2em', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ZIK4U
        </span>
        <div className="nav-links" style={{ display:'flex', gap:24, alignItems:'center' }}>
          {[{label:'Listeners',href:'/listeners'},{label:'Creators',href:'/creators'},{label:'Fans',href:'/fans'}].map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontSize:13, color:C.dim, textDecoration:'none', fontWeight:500 }}
              onMouseEnter={e => (e.currentTarget.style.color=C.text)}
              onMouseLeave={e => (e.currentTarget.style.color=C.dim)}>
              {l.label}
            </Link>
          ))}
          <a href={APP_STORE_URL} style={{ fontSize:12, fontWeight:700, color:C.bg, background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, padding:'7px 16px', borderRadius:999, textDecoration:'none' }}>
            Get the app
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'120px 24px 80px', position:'relative' }}>
          {/* Ambient glow */}
          <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:`radial-gradient(ellipse, ${C.purple}18, transparent 70%)`, pointerEvents:'none' }} />

          {/* Badge */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ marginBottom:40 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:C.cyan, textTransform:'uppercase', background:'rgba(0,212,255,0.08)', padding:'6px 18px', borderRadius:999, border:'1px solid rgba(0,212,255,0.2)' }}>
              ✦ Early Access — Join Now
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.6 }} style={{ textAlign:'center', marginBottom:32 }}>
            <h1 style={{ fontSize:'clamp(16px, 2.2vw, 22px)', fontWeight:700, color:'#fff', letterSpacing:'0.02em', margin:'0 0 20px', lineHeight:1.4 }}>
              The social network built on{' '}
              <span style={{ background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                what you actually listen to
              </span>
            </h1>
            <div style={{ fontSize:'clamp(64px, 12vw, 140px)', fontWeight:900, lineHeight:0.9, letterSpacing:'-0.04em', background:`linear-gradient(135deg, ${C.cyan}, ${C.mint} 40%, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:6 }}>
              FOR
            </div>
            <div style={{ fontSize:'clamp(64px, 12vw, 140px)', fontWeight:900, lineHeight:0.9, letterSpacing:'-0.04em', color:C.text }}>
              REAL.
            </div>
          </motion.div>

          {/* Sub */}
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ fontSize:'clamp(16px, 2vw, 20px)', color:'rgba(255,255,255,0.75)', textAlign:'center', maxWidth:520, lineHeight:1.8, margin:'0 0 60px' }}>
            Not your curated playlist. Not your public profile.<br />
            Your{' '}
            <strong style={{ color:C.pink, fontWeight:800 }}>real</strong>
            {' '}listening identity.{' '}
            <span style={{ color:C.mint }}>Live</span>,{' '}
            <span style={{ color:C.cyan }}>shared</span>,{' '}
            <span style={{ color:'#FFB800' }}>monetized</span>.
          </motion.p>

          {/* Now Card */}
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6, duration:0.7 }} style={{ width:'100%', maxWidth:380, marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:C.pink, textAlign:'center', marginBottom:16, textTransform:'uppercase' }}>
              <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:1.5, repeat:Infinity }} style={{ marginRight:6 }}>●</motion.span>
              Live right now on Zik4U
            </div>
            <NowCardLive />
          </motion.div>

          {/* Store buttons */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
            style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <a href={APP_STORE_URL} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 24px', borderRadius:14, background:C.text, textDecoration:'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={C.bg}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div>
                <div style={{ fontSize:9, color:C.bg, opacity:0.55, letterSpacing:'0.05em' }}>Download on the</div>
                <div style={{ fontSize:14, fontWeight:800, color:C.bg, lineHeight:1 }}>App Store</div>
              </div>
            </a>
            <a href={PLAY_STORE_URL} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 24px', borderRadius:14, background:C.card, border:`1px solid ${C.border}`, textDecoration:'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5c-.5.33-1.5.33-1.5-.5z" fill={C.mint}/></svg>
              <div>
                <div style={{ fontSize:9, color:C.muted, opacity:0.55, letterSpacing:'0.05em' }}>Get it on</div>
                <div style={{ fontSize:14, fontWeight:800, color:C.text, lineHeight:1 }}>Google Play</div>
              </div>
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:2 }}
            style={{ position:'absolute', bottom:32, color:C.dim, fontSize:20 }}>
            ↓
          </motion.div>
        </div>
      </section>

      {/* ── APP SCREENS SHOWCASE ── */}
      <section style={{ padding:'80px 0', position:'relative', overflow:'hidden', background:`linear-gradient(180deg, transparent, rgba(123,47,255,0.03), transparent)` }}>

        {/* ── VERSION DESKTOP (≥ 900px) — 3 colonnes ── */}
        <div className="screens-desktop" style={{ display:'flex', alignItems:'stretch', gap:0, minHeight:700 }}>

          {/* Colonne gauche — scroll UP */}
          <div style={{ flex:'0 0 260px', padding:'0 20px' }}>
            <ScrollColumn screens={leftScreens} direction="up" speed={55} />
          </div>

          {/* Centre */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'40px 32px', textAlign:'center', minWidth:0 }}>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ maxWidth:420 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:C.cyan, textTransform:'uppercase', marginBottom:20 }}>What it looks like</div>
              <h2 style={{ fontSize:'clamp(26px, 3.5vw, 40px)', fontWeight:900, lineHeight:1.1, margin:'0 0 24px', letterSpacing:'-0.02em' }}>
                Music as a<br />
                <span style={{ background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>living identity.</span>
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:32 }}>
                {[
                  { emoji:'🧬', text:'Your real archetype — computed from your behavior, not your self-description.' },
                  { emoji:'⚡', text:'Live Pulse rooms. Strangers listening to the same track at the same moment.' },
                  { emoji:'🎯', text:'Real compatibility. Built from shared listening, not shared taste statements.' },
                ].map((item,i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.15 }}
                    style={{ display:'flex', gap:12, alignItems:'flex-start', textAlign:'left', background:C.card, borderRadius:14, padding:'12px 14px', border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{item.emoji}</span>
                    <span style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <div style={{ padding:'16px 0', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:'clamp(18px, 2.5vw, 26px)', fontWeight:900, letterSpacing:'-0.01em' }}>
                  Not curated.{' '}
                  <span style={{ background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>For real.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite — scroll DOWN */}
          <div style={{ flex:'0 0 260px', padding:'0 20px' }}>
            <ScrollColumn screens={rightScreens} direction="down" speed={55} />
          </div>
        </div>

        {/* ── VERSION MOBILE (< 900px) — 1 colonne centrale ── */}
        <div className="screens-mobile" style={{ display:'none', flexDirection:'column', alignItems:'center', padding:'0 24px', gap:40 }}>

          {/* Texte conviction */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', maxWidth:420 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:C.cyan, textTransform:'uppercase', marginBottom:16 }}>What it looks like</div>
            <h2 style={{ fontSize:28, fontWeight:900, lineHeight:1.1, margin:'0 0 20px' }}>
              Music as a{' '}
              <span style={{ background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>living identity.</span>
            </h2>
            <div style={{ padding:'14px 0', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, marginBottom:24 }}>
              <div style={{ fontSize:22, fontWeight:900 }}>
                Not curated.{' '}
                <span style={{ background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>For real.</span>
              </div>
            </div>
          </motion.div>

          {/* Scroll horizontal d'écrans sur mobile */}
          <div style={{ overflowX:'auto' as const, WebkitOverflowScrolling:'touch' as any }}>
            <div style={{ display:'flex', gap:16, padding:'0 24px', width:'max-content' }}>
              {[...leftScreens, ...rightScreens].map((screen, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:20 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.1 }}
                >
                  {screen}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3 points conviction */}
          <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:400 }}>
            {[
              { emoji:'🧬', text:'Your real archetype — computed from behavior, not self-description.' },
              { emoji:'⚡', text:'Live Pulse rooms. Strangers listening to the same track simultaneously.' },
              { emoji:'🎯', text:'Real compatibility. Built from shared listening, not taste statements.' },
            ].map((item,i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', background:C.card, borderRadius:14, padding:'12px 14px', border:`1px solid ${C.border}` }}>
                <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{item.emoji}</span>
                <span style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── 3 PORTES CTA ── */}
      <section style={{ padding:'80px 24px', background:`linear-gradient(180deg, transparent, rgba(123,47,255,0.04), transparent)` }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:'clamp(28px, 4vw, 42px)', fontWeight:900, lineHeight:1.1, margin:'0 0 16px' }}>
              Who are you in music?
            </h2>
            <p style={{ fontSize:16, color:C.muted, margin:0 }}>Three doors. One truth.</p>
          </motion.div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { href:'/listeners', label:'Listener', tagline:'Your taste is your identity.',     pain:'Find the people who listen like you listen — not like they say they do.', gradient:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`,   textColor:'#0A0A1A', border:undefined, delay:0.1 },
              { href:'/creators',  label:'Creator',  tagline:'Your listens are worth money.',    pain:'Monetize your real music identity. Not your followers count — your data.',  gradient:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, textColor:'#fff',    border:undefined, delay:0.2 },
              { href:'/fans',      label:'Fan',      tagline:'Know your artist for real.',       pain:"Not their PR. What they actually put on at 2am.",                           gradient:undefined,                                          textColor:'#fff',    border:`1px solid ${C.border}`, delay:0.3 },
            ].map(cta => (
              <motion.div key={cta.href} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:cta.delay }}>
                <CTACard href={cta.href} label={cta.label} tagline={cta.tagline} pain={cta.pain} gradient={cta.gradient} textColor={cta.textColor} border={cta.border} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section style={{ padding:'40px 24px 80px', textAlign:'center' }}>
        <p style={{ fontSize:11, color:C.dim, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:20 }}>Works with</p>
        <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', alignItems:'center' }}>
          {[
            { name:'Spotify',       color:'#1DB954', href:'/works-with/spotify'       },
            { name:'Apple Music',   color:'#FC3C44', href:'/works-with/apple-music'   },
            { name:'YouTube Music', color:'#FF0000', href:'/works-with/youtube-music' },
            { name:'SoundCloud',    color:'#FF5500', href:'/works-with/soundcloud'    },
          ].map(p => (
            <Link key={p.name} href={p.href}
              style={{ fontSize:14, fontWeight:700, color:p.color, opacity:0.55, textDecoration:'none', transition:'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity='1')}
              onMouseLeave={e => (e.currentTarget.style.opacity='0.55')}>
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:'32px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, maxWidth:1080, margin:'0 auto' }}>
        <span style={{ fontSize:16, fontWeight:900, letterSpacing:'0.2em', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ZIK4U
        </span>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[
            { label:'Privacy',                  href:'/legal/privacy' },
            { label:'Terms',                    href:'/legal/terms'   },
            { label:'For labels & researchers', href:'/partner'       },
          ].map(l => (
            <a key={l.href} href={l.href}
              style={{ fontSize:12, color:C.dim, textDecoration:'none' }}
              onMouseEnter={e => (e.currentTarget.style.color=C.text)}
              onMouseLeave={e => (e.currentTarget.style.color=C.dim)}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>

    </main>
  );
}
