'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const APP_STORE_URL  = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const C = {
  bg:     '#0A0A1A',
  card:   '#12122A',
  surface:'#1A1A35',
  border: 'rgba(255,255,255,0.08)',
  cyan:   '#00D4FF',
  mint:   '#00FFB2',
  pink:   '#FF3CAC',
  purple: '#7B2FFF',
  gold:   '#FFB800',
  text:   '#F0F0FF',
  muted:  'rgba(255,255,255,0.5)',
  dim:    'rgba(255,255,255,0.2)',
} as const;

// ── Now Card Live ─────────────────────────────────────────────────────────────

const NOW_CARDS = [
  { time:'23h47', track:'ocean eyes',    artist:'Billie Eilish',  mood:'Nocturne',    emoji:'🌙', color:C.purple,  grad:['#1a0533','#0A0A1A'] as [string,string] },
  { time:'08h12', track:'HUMBLE.',       artist:'Kendrick Lamar', mood:'High Energy', emoji:'🔥', color:C.pink,    grad:['#2d0a00','#0A0A1A'] as [string,string] },
  { time:'14h33', track:'Ylang Ylang',   artist:'FKJ',            mood:'Deep Focus',  emoji:'🌊', color:C.cyan,    grad:['#001a2d','#0A0A1A'] as [string,string] },
  { time:'02h18', track:'Pink + White',  artist:'Frank Ocean',    mood:'Mélancolie',  emoji:'💜', color:'#9B59B6', grad:['#0d001a','#0A0A1A'] as [string,string] },
  { time:'19h55', track:'Lose Yourself', artist:'Eminem',         mood:'Obsession',   emoji:'⚡', color:C.gold,    grad:['#1a1000','#0A0A1A'] as [string,string] },
];

function NowCardLive() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % NOW_CARDS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const card = NOW_CARDS[i];
  return (
    <div style={{ position:'relative', maxWidth:340, margin:'0 auto', width:'100%' }}>
      <div style={{ position:'absolute', inset:-24, background:`radial-gradient(ellipse, ${card.color}25, transparent 65%)`, borderRadius:48, pointerEvents:'none', transition:'background 1s' }} />
      <AnimatePresence mode="wait">
        <motion.div key={i}
          initial={{ opacity:0, y:10, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:-8, scale:0.98 }}
          transition={{ duration:0.32, ease:'easeOut' }}
          style={{ position:'relative', background:`linear-gradient(160deg, ${card.grad[0]}, ${C.card})`, borderRadius:24, border:`1px solid ${card.color}35`, padding:'22px 22px 18px', boxShadow:`0 0 48px ${card.color}18, 0 12px 40px rgba(0,0,0,0.5)` }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg, ${card.color}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{card.emoji}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>@harmony</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>Night Explorer</div>
              </div>
            </div>
            <div style={{ fontSize:10, color:card.color, fontFamily:'monospace', letterSpacing:'0.08em', background:`${card.color}12`, padding:'3px 9px', borderRadius:7, border:`1px solid ${card.color}28` }}>{card.time}</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:7 }}>▶ NOW PLAYING</div>
            <div style={{ fontSize:21, fontWeight:900, color:C.text, lineHeight:1.15, letterSpacing:'-0.01em' }}>{card.track}</div>
            <div style={{ fontSize:14, color:C.muted, marginTop:5 }}>{card.artist}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:`${card.color}14`, border:`1px solid ${card.color}28`, borderRadius:999, padding:'5px 13px' }}>
              <span style={{ fontSize:13 }}>{card.emoji}</span>
              <span style={{ fontSize:12, fontWeight:700, color:card.color }}>{card.mood}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:2 }}>
              {[1,0.55,0.85,0.4,0.9,0.5,0.75].map((h, j) => (
                <motion.div key={j}
                  animate={{ scaleY:[h, h*0.35, h] }}
                  transition={{ duration:0.75+j*0.1, repeat:Infinity, ease:'easeInOut', delay:j*0.09 }}
                  style={{ width:3, height:15, background:card.color, borderRadius:2, opacity:0.65, transformOrigin:'bottom' }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display:'flex', justifyContent:'center', gap:7, marginTop:14 }}>
        {NOW_CARDS.map((_,j) => (
          <div key={j} onClick={() => setI(j)}
            style={{ width:j===i?22:6, height:6, borderRadius:3, background:j===i?NOW_CARDS[i].color:'rgba(255,255,255,0.14)', transition:'all 0.35s', cursor:'pointer' }} />
        ))}
      </div>
    </div>
  );
}

// ── App Screens ───────────────────────────────────────────────────────────────

function PhoneFrame({ children, shadow }: { children: ReactNode; shadow?: string }) {
  return (
    <div style={{ width:200, height:390, background:C.bg, borderRadius:32, overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', boxShadow:shadow??'0 24px 64px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column', flexShrink:0, position:'relative' }}>
      <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', width:60, height:5, background:'rgba(255,255,255,0.1)', borderRadius:3, zIndex:10 }} />
      <div style={{ height:22, flexShrink:0 }} />
      {children}
    </div>
  );
}

function ScreenProfile() {
  return (
    <PhoneFrame shadow="0 32px 80px rgba(255,60,172,0.25)">
      <div style={{ height:72, background:`linear-gradient(135deg, ${C.pink}55, ${C.purple}44)`, position:'relative', overflow:'hidden', flexShrink:0 }}>
        {[...Array(10)].map((_,i) => (
          <div key={i} style={{ position:'absolute', bottom:0, left:`${i*10.5}%`, width:'7%', height:`${14+Math.sin(i*0.9)*8}px`, background:`rgba(255,60,172,${0.14+Math.sin(i*0.5)*0.06})`, borderRadius:'3px 3px 0 0' }} />
        ))}
      </div>
      <div style={{ padding:'0 14px', marginTop:-22, marginBottom:6, display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexShrink:0 }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, opacity:0.75 }} />
          <div style={{ position:'relative', width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff', border:`2px solid ${C.bg}` }}>H</div>
        </div>
        <div style={{ fontSize:9, fontWeight:700, color:C.bg, background:`linear-gradient(90deg,${C.cyan},${C.mint})`, padding:'4px 10px', borderRadius:999, marginBottom:2 }}>Edit</div>
      </div>
      <div style={{ padding:'0 14px', flex:1, overflow:'hidden' }}>
        <div style={{ fontSize:14, fontWeight:900, color:C.text }}>Harmony</div>
        <div style={{ fontSize:9, color:'rgba(255,60,172,0.65)', fontFamily:'monospace', marginBottom:3 }}>@harmony · Night Explorer 🌙</div>
        <div style={{ display:'flex', background:C.surface, borderRadius:10, border:`1px solid rgba(255,60,172,0.15)`, overflow:'hidden', marginBottom:9 }}>
          {[['1.2K','fans'],['$340','/ mois'],['24','drops']].map(([v,l],i) => (
            <div key={i} style={{ flex:1, textAlign:'center', padding:'7px 3px', borderRight:i<2?`1px solid rgba(255,60,172,0.1)`:undefined }}>
              <div style={{ fontSize:13, fontWeight:900, color:i===1?C.mint:i===2?C.pink:C.text }}>{v}</div>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.35)', letterSpacing:0.8, textTransform:'uppercase', marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, rgba(255,60,172,0.12), rgba(123,47,255,0.08))`, borderRadius:10, padding:'8px 10px', border:`1px solid rgba(255,60,172,0.2)`, marginBottom:7 }}>
          <div style={{ fontSize:8, color:C.pink, letterSpacing:2, textTransform:'uppercase', marginBottom:3 }}>▶ NOW PLAYING</div>
          <div style={{ fontSize:11, fontWeight:800, color:C.text }}>PROVENZA</div>
          <div style={{ fontSize:9, color:C.muted }}>Karol G · 🌊 Feel Good</div>
        </div>
        <div style={{ background:'rgba(0,255,178,0.06)', borderRadius:10, padding:'8px 10px', border:`1px solid rgba(0,255,178,0.18)` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <span style={{ fontSize:8, color:C.muted, textTransform:'uppercase', letterSpacing:0.8 }}>Prochain palier</span>
            <span style={{ fontSize:8, color:C.mint, fontWeight:700 }}>+3 fans</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ width:'78%', height:'100%', background:`linear-gradient(90deg, ${C.mint}, ${C.cyan})`, borderRadius:2 }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ScreenNowCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x+1)%3), 2800);
    return () => clearInterval(t);
  }, []);
  const cards = [
    { emoji:'🌊', mood:'FEEL GOOD',  track:'PROVENZA',    artist:'Karol G',       grad:[C.pink, C.purple] as [string,string] },
    { emoji:'🌙', mood:'NOCTURNE',   track:'ocean eyes',  artist:'Billie Eilish', grad:['#1a0533', C.purple] as [string,string] },
    { emoji:'🌊', mood:'DEEP FOCUS', track:'Ylang Ylang', artist:'FKJ',           grad:['#001a2d', C.cyan] as [string,string] },
  ];
  const card = cards[i];
  return (
    <PhoneFrame shadow="0 32px 80px rgba(0,212,255,0.2)">
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
          style={{ flex:1, background:`linear-gradient(160deg, ${card.grad[0]}, ${C.card})`, display:'flex', flexDirection:'column', padding:'18px 16px' }}>
          <div style={{ fontSize:8, color:'rgba(255,255,255,0.45)', letterSpacing:3, textTransform:'uppercase', fontFamily:'monospace', marginBottom:12 }}>MY NOW · @harmony</div>
          <div style={{ textAlign:'center', flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:12 }}>
            <div style={{ fontSize:48 }}>{card.emoji}</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:4 }}>{card.mood}</div>
            <div style={{ height:1, background:'rgba(255,255,255,0.15)', margin:'0 24px' }} />
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>{card.track}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:3 }}>{card.artist}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:3, alignItems:'center' }}>
              {[0.4,0.7,1,0.5,0.9,0.6,0.8,1,0.5,0.7].map((h,j) => (
                <motion.div key={j} animate={{ scaleY:[h, h*0.3, h] }} transition={{ duration:0.6+j*0.08, repeat:Infinity, ease:'easeInOut', delay:j*0.06 }}
                  style={{ width:4, height:28, background:'rgba(255,255,255,0.6)', borderRadius:2, transformOrigin:'center' }} />
              ))}
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
            <div style={{ display:'flex', gap:5 }}>
              {cards.map((_,j) => <div key={j} style={{ width:j===i?16:5, height:5, borderRadius:3, background:j===i?'rgba(255,255,255,0.8)':'rgba(255,255,255,0.25)', transition:'all 0.3s' }} />)}
            </div>
            <span style={{ fontSize:8, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>zik4u.com</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}

function ScreenPulse() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const t = setInterval(() => setCount(c => c===4?5:4), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <PhoneFrame shadow="0 32px 80px rgba(0,212,255,0.2)">
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'16px 14px', overflow:'hidden' }}>
        <div style={{ fontSize:8, color:C.cyan, letterSpacing:2, textTransform:'uppercase', fontFamily:'monospace', marginBottom:12 }}>🎧 PULSE — LIVE</div>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:`linear-gradient(135deg, ${C.cyan}33, ${C.purple}33)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, border:`1px solid ${C.cyan}28`, flexShrink:0 }}>🎵</div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:C.text, lineHeight:1.2 }}>Ylang Ylang</div>
            <div style={{ fontSize:10, color:C.muted }}>FKJ · Deep Focus 🌊</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, marginBottom:14, height:36 }}>
          {[0.4,0.7,1,0.6,0.9,0.5,0.8,1,0.6,0.7,0.4,0.9,0.7].map((h,i) => (
            <motion.div key={i} animate={{ scaleY:[h, h*0.3, h] }} transition={{ duration:0.55+i*0.08, repeat:Infinity, ease:'easeInOut', delay:i*0.06 }}
              style={{ width:4, height:32, background:`linear-gradient(180deg, ${C.cyan}, ${C.purple})`, borderRadius:2, opacity:0.7, transformOrigin:'center' }} />
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ display:'flex' }}>
            {['H','M','S','L'].map((l,i) => (
              <div key={i} style={{ width:28, height:28, borderRadius:14, background:`linear-gradient(135deg, ${[C.pink,C.cyan,C.mint,C.purple][i]}, ${[C.purple,C.mint,C.cyan,C.pink][i]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff', border:`2px solid ${C.bg}`, marginLeft:i>0?-7:0, zIndex:4-i }}>{l}</div>
            ))}
          </div>
          <motion.div animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.4, repeat:Infinity }} style={{ fontSize:10, color:C.cyan, fontFamily:'monospace' }}>{count} live</motion.div>
        </div>
        <div style={{ display:'flex', gap:5, marginBottom:12 }}>
          {['🔥','😮','💜','⚡','🎵'].map((e,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.05)', borderRadius:18, padding:'4px 8px', fontSize:11, border:`1px solid rgba(255,255,255,0.07)`, cursor:'pointer' }}>{e}</div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`, borderRadius:11, padding:'10px', textAlign:'center', cursor:'pointer', marginTop:'auto' }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.bg }}>Join session</div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ScreenCompatibility() {
  return (
    <PhoneFrame shadow="0 32px 80px rgba(0,255,178,0.18)">
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'16px 14px', overflow:'hidden' }}>
        <div style={{ fontSize:8, color:C.mint, letterSpacing:2, textTransform:'uppercase', fontFamily:'monospace', marginBottom:14 }}>🎯 MUSIC MATCH</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
          <div style={{ width:50, height:50, borderRadius:25, background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff', border:`3px solid ${C.bg}`, zIndex:2 }}>H</div>
          <div style={{ zIndex:3, margin:'0 -10px', background:C.card, borderRadius:999, padding:'5px 12px', border:`1px solid ${C.mint}45`, boxShadow:`0 0 24px ${C.mint}28` }}>
            <span style={{ fontSize:17, fontWeight:900, color:C.mint }}>87%</span>
          </div>
          <div style={{ width:50, height:50, borderRadius:25, background:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:C.bg, border:`3px solid ${C.bg}`, zIndex:2 }}>M</div>
        </div>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:800, color:C.text }}>@harmony & @marco</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>Deep Feeler + Night Explorer</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
            <motion.div initial={{ width:0 }} animate={{ width:'87%' }} transition={{ duration:1.5, ease:'easeOut', delay:0.4 }}
              style={{ height:'100%', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, borderRadius:3 }} />
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:7 }}>In common</div>
          {['Frank Ocean','FKJ','Bon Iver'].map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:i<2?`1px solid rgba(255,255,255,0.04)`:undefined }}>
              <div style={{ width:20, height:20, borderRadius:5, background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9 }}>🎵</div>
              <span style={{ fontSize:11, color:C.text, fontWeight:600 }}>{a}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, marginTop:'auto' }}>
          <div style={{ flex:1, background:'rgba(255,60,172,0.08)', borderRadius:9, padding:'6px 8px', border:`1px solid rgba(255,60,172,0.18)` }}>
            <div style={{ fontSize:12 }}>🌙</div>
            <div style={{ fontSize:8, color:C.pink, fontWeight:700, marginTop:2, lineHeight:1.3 }}>Night Explorer</div>
          </div>
          <div style={{ flex:1, background:'rgba(0,212,255,0.08)', borderRadius:9, padding:'6px 8px', border:`1px solid rgba(0,212,255,0.15)` }}>
            <div style={{ fontSize:12 }}>💜</div>
            <div style={{ fontSize:8, color:C.cyan, fontWeight:700, marginTop:2, lineHeight:1.3 }}>Deep Feeler</div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ── ScrollColumn ──────────────────────────────────────────────────────────────

function ScrollColumn({ screens, direction }: { screens: ReactNode[]; direction: 'up'|'down' }) {
  const doubled = [...screens, ...screens];
  const itemH = 390 + 24;
  return (
    <div style={{ height:500, overflow:'hidden', maskImage:'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskImage:'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
      <motion.div
        animate={{ y: direction==='up' ? [0, -(screens.length * itemH)] : [-(screens.length * itemH), 0] }}
        transition={{ duration:screens.length * 16, repeat:Infinity, ease:'linear' }}
        style={{ display:'flex', flexDirection:'column', gap:24 }}
      >
        {doubled.map((s, i) => <div key={i}>{s}</div>)}
      </motion.div>
    </div>
  );
}

// ── CTACard ───────────────────────────────────────────────────────────────────

function CTACard({ href, label, tagline, pain, gradient, textColor, border }: {
  href: string; label: string; tagline: string; pain: string;
  gradient?: string; textColor: string; border?: string;
}) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ scale:1.015, y:-2 }}
      whileTap={{ scale:0.985 }}
      onClick={() => router.push(href)}
      style={{ width:'100%', padding:'20px 24px', background:gradient??C.card, border:border??'none', borderRadius:18, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:5, textAlign:'left' }}
    >
      <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', color:textColor==='#0A0A1A'?'rgba(10,10,26,0.5)':'rgba(255,255,255,0.45)', textTransform:'uppercase' as const }}>{label}</span>
      <span style={{ fontSize:19, fontWeight:900, color:textColor, lineHeight:1.2 }}>{tagline}</span>
      <span style={{ fontSize:13, color:textColor==='#0A0A1A'?'rgba(10,10,26,0.6)':'rgba(255,255,255,0.5)', lineHeight:1.6, marginTop:2 }}>{pain}</span>
      <span style={{ marginTop:8, fontSize:13, fontWeight:700, color:textColor, opacity:0.8 }}>Explore →</span>
    </motion.button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const leftScreens  = [<ScreenProfile key="p" />, <ScreenPulse key="pu" />];
  const rightScreens = [<ScreenNowCard key="n" />, <ScreenCompatibility key="c" />];


  return (
    <main style={{ backgroundColor:C.bg, fontFamily:'Inter, system-ui, sans-serif', color:C.text, overflowX:'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 28px', background:'rgba(10,10,26,0.9)', backdropFilter:'blur(20px)', borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
        <span style={{ fontSize:19, fontWeight:900, letterSpacing:'0.22em', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ZIK4U
        </span>
        <div className="nav-links" style={{ display:'flex', gap:22, alignItems:'center' }}>
          {[{label:'Listeners',href:'/listeners'},{label:'Creators',href:'/creators'},{label:'Fans',href:'/fans'}].map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontSize:13, color:C.dim, textDecoration:'none', fontWeight:500, transition:'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color=C.text)}
              onMouseLeave={e => (e.currentTarget.style.color=C.dim)}>
              {l.label}
            </Link>
          ))}
          <a href={APP_STORE_URL} style={{ fontSize:12, fontWeight:700, color:'#0A0A1A', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, padding:'8px 18px', borderRadius:999, textDecoration:'none', whiteSpace:'nowrap' }}>
            Get the app
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          BLOC UNIQUE — tout tient ensemble, pas de sections
          ════════════════════════════════════════════════════ */}
      <div style={{ maxWidth:680, margin:'0 auto', padding:'0 20px', paddingTop:100 }}>

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          style={{ display:'flex', justifyContent:'center', paddingTop:40, paddingBottom:40 }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.22em', color:C.cyan, textTransform:'uppercase', background:'rgba(0,212,255,0.07)', padding:'7px 20px', borderRadius:999, border:`1px solid rgba(0,212,255,0.22)`, display:'inline-flex', alignItems:'center', gap:7 }}>
            <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.6, repeat:Infinity }}>●</motion.span>
            Early Access — Join Now
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ textAlign:'center', marginBottom:20 }}>
          <h1 style={{ fontSize:'clamp(20px, 3vw, 28px)', fontWeight:700, lineHeight:1.4, margin:'0 0 16px', color:C.text, letterSpacing:'-0.01em' }}>
            The social network built on{' '}
            <span style={{ background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:800 }}>
              what you actually listen to
            </span>
          </h1>
          {/* FOR REAL — sobre, compact */}
          <div style={{ fontSize:'clamp(40px, 7vw, 72px)', fontWeight:900, lineHeight:1, letterSpacing:'-0.03em', background:`linear-gradient(135deg, ${C.cyan}, ${C.mint} 40%, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>
            For real.
          </div>
        </motion.div>

        {/* Sous-titre */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
          style={{ fontSize:'clamp(16px, 2vw, 19px)', color:'rgba(255,255,255,0.68)', textAlign:'center', lineHeight:1.75, margin:'0 0 40px' }}>
          Not your curated playlist. Not your public profile.<br />
          Your{' '}<strong style={{ color:C.pink, fontWeight:800 }}>real</strong>{' '}listening identity.{' '}
          <span style={{ color:C.mint }}>Live</span>,{' '}
          <span style={{ color:C.cyan }}>shared</span>,{' '}
          <span style={{ color:C.gold }}>monetized</span>.
        </motion.p>

        {/* Label live — sans carte en dessous */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }}
          style={{ display:'flex', justifyContent:'center', marginBottom:48 }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:6, color:C.pink }}>
            <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.6, repeat:Infinity }} style={{ fontSize:8 }}>●</motion.span>
            Live right now on Zik4U
          </span>
        </motion.div>

        {/* 3 CTAs */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:64 }}>
          {[
            { href:'/listeners', label:'Listener', tagline:'Your taste is your identity.',  pain:'Find people who listen like you listen — not like they say they do.', gradient:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`,   textColor:'#0A0A1A' },
            { href:'/creators',  label:'Creator',  tagline:'Your listens are worth money.', pain:'Monetize your real music identity. Not followers — your data.',         gradient:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, textColor:'#fff' },
            { href:'/fans',      label:'Fan',       tagline:'Know your artist. For real.',  pain:"Not their PR. What they actually put on at 2am.",                      gradient:undefined, textColor:'#fff', border:`1px solid ${C.border}` },
          ].map(cta => (
            <CTACard key={cta.href} href={cta.href} label={cta.label} tagline={cta.tagline} pain={cta.pain} gradient={cta.gradient} textColor={cta.textColor} border={'border' in cta ? cta.border : undefined} />
          ))}
        </motion.div>

      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth:680, margin:'0 auto', padding:'0 24px 64px' }}>
        <motion.p
          initial={{ opacity:0, y:12 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          style={{ fontSize:11, fontWeight:700, letterSpacing:'0.22em',
            color:'rgba(255,255,255,0.35)', textTransform:'uppercase',
            textAlign:'center', marginBottom:32 }}>
          Why it&apos;s different
        </motion.p>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {[
            {
              emoji:'🧬', color:'#00D4FF',
              title:'Your real archetype.',
              sub:'For real.',
              text:'7 behavioral profiles computed from how you actually listen — not what you say you like.',
            },
            {
              emoji:'⚡', color:'#FF3CAC',
              title:'Live Pulse rooms.',
              sub:'For real.',
              text:'Strangers listening to the same track at the same moment. Collective experience, unfiltered.',
            },
            {
              emoji:'🎯', color:'#00FFB2',
              title:'Real compatibility.',
              sub:'For real.',
              text:'87% means you both played the same FKJ track at 2am. Not "I like jazz too."',
            },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:10 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1 }}
              style={{
                display:'flex', gap:16, alignItems:'flex-start',
                padding:'20px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
              <span style={{ fontSize:28, flexShrink:0, lineHeight:1, paddingTop:3 }}>
                {item.emoji}
              </span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:17, fontWeight:900, color:'#F0F0FF',
                  lineHeight:1.2, marginBottom:4 }}>
                  {item.title}{' '}
                  <span style={{
                    background:`linear-gradient(90deg, ${item.color}, #FF3CAC)`,
                    WebkitBackgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    fontStyle:'italic',
                  }}>
                    {item.sub}
                  </span>
                </div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)',
                  lineHeight:1.65 }}>
                  {item.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── APP SCREENS ── */}
      <div style={{ overflow:'hidden', padding:'0 0 80px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 40%, rgba(123,47,255,0.06), transparent 70%)`, pointerEvents:'none' }} />

        {/* Titre */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ textAlign:'center', padding:'0 24px', marginBottom:48, position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'clamp(24px, 3.5vw, 36px)', fontWeight:900, lineHeight:1.15, margin:'0 0 12px', letterSpacing:'-0.02em' }}>
            What it feels like.{' '}
            <span style={{ background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </h2>
          <p style={{ fontSize:15, color:C.muted, margin:0 }}>
            Not curated. Not filtered. The real thing.
          </p>
        </motion.div>

        {/* Desktop — 2 colonnes centrées */}
        <div className="screens-desktop" style={{ display:'flex', justifyContent:'center', alignItems:'flex-start', gap:32, position:'relative', zIndex:1 }}>
          <div style={{ width:200, flexShrink:0 }}>
            <ScrollColumn screens={leftScreens} direction="up" />
          </div>
          <div style={{ width:200, flexShrink:0, marginTop:60 }}>
            <ScrollColumn screens={rightScreens} direction="down" />
          </div>
        </div>

        {/* Mobile — scroll horizontal */}
        <div className="screens-mobile" style={{ display:'none', overflowX:'auto', WebkitOverflowScrolling:'touch' as any, padding:'4px 24px 12px', position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', gap:16, width:'max-content' }}>
            {[<ScreenProfile key="p" />, <ScreenNowCard key="n" />, <ScreenPulse key="pu" />, <ScreenCompatibility key="c" />].map((screen, i) => (
              <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}>
                {screen}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STORE BUTTONS ── */}
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', padding:'0 24px 48px' }}>
        <a href={APP_STORE_URL}
          style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 26px', borderRadius:14, background:C.text, textDecoration:'none', boxShadow:'0 4px 24px rgba(0,0,0,0.3)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={C.bg}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          <div>
            <div style={{ fontSize:10, color:C.bg, opacity:0.5, letterSpacing:'0.06em' }}>Download on the</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.bg, lineHeight:1 }}>App Store</div>
          </div>
        </a>
        <a href={PLAY_STORE_URL}
          style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 26px', borderRadius:14, background:C.card, border:`1px solid rgba(255,255,255,0.12)`, textDecoration:'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5c-.5.33-1.5.33-1.5-.5z" fill={C.mint}/></svg>
          <div>
            <div style={{ fontSize:10, color:C.muted, opacity:0.6, letterSpacing:'0.06em' }}>Get it on</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, lineHeight:1 }}>Google Play</div>
          </div>
        </a>
      </div>

      {/* ── WORKS WITH ── */}
      <div style={{ textAlign:'center', padding:'0 24px 72px' }}>
        <p style={{ fontSize:11, color:C.dim, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:20 }}>Works with</p>
        <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { name:'Spotify',       color:'#1DB954', href:'/works-with/spotify'       },
            { name:'Apple Music',   color:'#FC3C44', href:'/works-with/apple-music'   },
            { name:'YouTube Music', color:'#FF0000', href:'/works-with/youtube-music' },
            { name:'SoundCloud',    color:'#FF5500', href:'/works-with/soundcloud'    },
          ].map(p => (
            <Link key={p.name} href={p.href}
              style={{ fontSize:17, fontWeight:700, color:p.color, opacity:0.65, textDecoration:'none', transition:'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity='1')}
              onMouseLeave={e => (e.currentTarget.style.opacity='0.65')}>
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:'28px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, maxWidth:1100, margin:'0 auto' }}>
        <span style={{ fontSize:16, fontWeight:900, letterSpacing:'0.22em', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>ZIK4U</span>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[{label:'Privacy',href:'/legal/privacy'},{label:'Terms',href:'/legal/terms'},{label:'For labels & researchers',href:'/partner'}].map(l => (
            <a key={l.href} href={l.href}
              style={{ fontSize:12, color:C.dim, textDecoration:'none', transition:'color 0.2s' }}
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
