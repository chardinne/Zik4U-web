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

// ── App Screens ───────────────────────────────────────────────────────────────

function PhoneFrame({ children, shadow }: { children: ReactNode; shadow?: string }) {
  return (
    <div style={{ width:'100%', maxWidth:360, height:480, background:'#0A0A1A', borderRadius:32, overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', boxShadow:shadow??'0 24px 64px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column', flexShrink:0, position:'relative' }}>
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
      <div style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,0.08)', borderRadius:4, padding:'2px 6px', fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', letterSpacing:1 }}>DEMO</div>
      <div style={{ padding:'0 14px', marginTop:-22, marginBottom:6, display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexShrink:0 }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, opacity:0.75 }} />
          <div style={{ position:'relative', width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff', border:`2px solid ${C.bg}` }}>H</div>
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:C.bg, background:`linear-gradient(90deg,${C.cyan},${C.mint})`, padding:'4px 10px', borderRadius:999, marginBottom:2 }}>Edit</div>
      </div>
      <div style={{ padding:'0 14px', flex:1, overflow:'hidden' }}>
        <div style={{ fontSize:18, fontWeight:900, color:C.text }}>Harmony</div>
        <div style={{ fontSize:13, color:'rgba(255,60,172,0.65)', fontFamily:'monospace', marginBottom:3 }}>@harmony · Night Explorer 🌙</div>
        <div style={{ display:'flex', background:C.surface, borderRadius:10, border:`1px solid rgba(255,60,172,0.15)`, overflow:'hidden', marginBottom:9 }}>
          {[['1.2K','fans'],['$340','/ mo'],['24','drops']].map(([v,l],i) => (
            <div key={i} style={{ flex:1, textAlign:'center', padding:'7px 3px', borderRight:i<2?`1px solid rgba(255,60,172,0.1)`:undefined }}>
              <div style={{ fontSize:17, fontWeight:900, color:i===1?C.mint:i===2?C.pink:C.text }}>{v}</div>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.35)', letterSpacing:0.8, textTransform:'uppercase', marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, rgba(255,60,172,0.12), rgba(123,47,255,0.08))`, borderRadius:10, padding:'8px 10px', border:`1px solid rgba(255,60,172,0.2)`, marginBottom:7 }}>
          <div style={{ fontSize:12, color:C.pink, letterSpacing:2, textTransform:'uppercase', marginBottom:3 }}>▶ NOW PLAYING</div>
          <div style={{ fontSize:15, fontWeight:800, color:C.text }}>PROVENZA</div>
          <div style={{ fontSize:13, color:C.muted }}>Karol G · 🌊 Feel Good</div>
        </div>
        <div style={{ background:'rgba(0,255,178,0.06)', borderRadius:10, padding:'8px 10px', border:`1px solid rgba(0,255,178,0.18)` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <span style={{ fontSize:12, color:C.muted, textTransform:'uppercase', letterSpacing:0.8 }}>Next tier</span>
            <span style={{ fontSize:12, color:C.mint, fontWeight:700 }}>+3 fans</span>
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
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', letterSpacing:3, textTransform:'uppercase', fontFamily:'monospace', marginBottom:12 }}>MY NOW · @harmony</div>
          <div style={{ textAlign:'center', flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:12 }}>
            <div style={{ fontSize:48 }}>{card.emoji}</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:4 }}>{card.mood}</div>
            <div style={{ height:1, background:'rgba(255,255,255,0.15)', margin:'0 24px' }} />
            <div>
              <div style={{ fontSize:19, fontWeight:800, color:'#fff' }}>{card.track}</div>
              <div style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginTop:3 }}>{card.artist}</div>
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
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>zik4u.com</span>
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
        <div style={{ fontSize:12, color:C.cyan, letterSpacing:2, textTransform:'uppercase', fontFamily:'monospace', marginBottom:12 }}>🎧 PULSE — LIVE</div>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:`linear-gradient(135deg, ${C.cyan}33, ${C.purple}33)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, border:`1px solid ${C.cyan}28`, flexShrink:0 }}>🎵</div>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:C.text, lineHeight:1.2 }}>Ylang Ylang</div>
            <div style={{ fontSize:14, color:C.muted }}>FKJ · Deep Focus 🌊</div>
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
              <div key={i} style={{ width:28, height:28, borderRadius:14, background:`linear-gradient(135deg, ${[C.pink,C.cyan,C.mint,C.purple][i]}, ${[C.purple,C.mint,C.cyan,C.pink][i]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', border:`2px solid ${C.bg}`, marginLeft:i>0?-7:0, zIndex:4-i }}>{l}</div>
            ))}
          </div>
          <motion.div animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.4, repeat:Infinity }} style={{ fontSize:14, color:C.cyan, fontFamily:'monospace' }}>{count} live</motion.div>
        </div>
        <div style={{ display:'flex', gap:5, marginBottom:12 }}>
          {['🔥','😮','💜','⚡','🎵'].map((e,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.05)', borderRadius:18, padding:'4px 8px', fontSize:15, border:`1px solid rgba(255,255,255,0.07)`, cursor:'pointer' }}>{e}</div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`, borderRadius:11, padding:'10px', textAlign:'center', cursor:'pointer', marginTop:'auto' }}>
          <div style={{ fontSize:16, fontWeight:800, color:C.bg }}>Join session</div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ScreenCompatibility() {
  return (
    <PhoneFrame shadow="0 32px 80px rgba(0,255,178,0.18)">
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'16px 14px', overflow:'hidden' }}>
        <div style={{ fontSize:12, color:C.mint, letterSpacing:2, textTransform:'uppercase', fontFamily:'monospace', marginBottom:14 }}>🎯 MUSIC MATCH</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
          <div style={{ width:50, height:50, borderRadius:25, background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff', border:`3px solid ${C.bg}`, zIndex:2 }}>H</div>
          <div style={{ zIndex:3, margin:'0 -10px', background:C.card, borderRadius:999, padding:'5px 12px', border:`1px solid ${C.mint}45`, boxShadow:`0 0 24px ${C.mint}28` }}>
            <span style={{ fontSize:21, fontWeight:900, color:C.mint }}>87%</span>
          </div>
          <div style={{ width:50, height:50, borderRadius:25, background:`linear-gradient(135deg, ${C.cyan}, ${C.mint})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:C.bg, border:`3px solid ${C.bg}`, zIndex:2 }}>M</div>
        </div>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontSize:15, fontWeight:800, color:C.text }}>@harmony & @marco</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>Deep Feeler + Night Explorer</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
            <motion.div initial={{ width:0 }} animate={{ width:'87%' }} transition={{ duration:1.5, ease:'easeOut', delay:0.4 }}
              style={{ height:'100%', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, borderRadius:3 }} />
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:7 }}>In common</div>
          {['Frank Ocean','FKJ','Bon Iver'].map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:i<2?`1px solid rgba(255,255,255,0.04)`:undefined }}>
              <div style={{ width:20, height:20, borderRadius:5, background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🎵</div>
              <span style={{ fontSize:15, color:C.text, fontWeight:600 }}>{a}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, marginTop:'auto' }}>
          <div style={{ flex:1, background:'rgba(255,60,172,0.08)', borderRadius:9, padding:'6px 8px', border:`1px solid rgba(255,60,172,0.18)` }}>
            <div style={{ fontSize:16 }}>🌙</div>
            <div style={{ fontSize:12, color:C.pink, fontWeight:700, marginTop:2, lineHeight:1.3 }}>Night Explorer</div>
          </div>
          <div style={{ flex:1, background:'rgba(0,212,255,0.08)', borderRadius:9, padding:'6px 8px', border:`1px solid rgba(0,212,255,0.15)` }}>
            <div style={{ fontSize:16 }}>💜</div>
            <div style={{ fontSize:12, color:C.cyan, fontWeight:700, marginTop:2, lineHeight:1.3 }}>Deep Feeler</div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ── ScrollColumn ──────────────────────────────────────────────────────────────

function ScrollColumn({ screens, direction }: { screens: ReactNode[]; direction: 'up'|'down' }) {
  const doubled = [...screens, ...screens];
  const itemH = 480 + 24;
  return (
    <div style={{ height:640, overflow:'hidden', maskImage:'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskImage:'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
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
      <span style={{ fontSize:14, fontWeight:700, letterSpacing:'0.18em', color:textColor==='#0A0A1A'?'rgba(10,10,26,0.5)':'rgba(255,255,255,0.45)', textTransform:'uppercase' as const }}>{label}</span>
      <span style={{ fontSize:19, fontWeight:900, color:textColor, lineHeight:1.2 }}>{tagline}</span>
      <span style={{ fontSize:17, color:textColor==='#0A0A1A'?'rgba(10,10,26,0.6)':'rgba(255,255,255,0.5)', lineHeight:1.6, marginTop:2 }}>{pain}</span>
      <span style={{ marginTop:8, fontSize:17, fontWeight:700, color:textColor, opacity:0.8 }}>Explore →</span>
    </motion.button>
  );
}

// ── Live Equalizer ────────────────────────────────────────────────────────────

// ── Live Ticker ───────────────────────────────────────────────────────────────

const LIVE_FEEDS = [
  { emoji:'🌙', user:'@harmony', track:'ocean eyes', artist:'Billie Eilish', time:'now', color:'#7B2FFF' },
  { emoji:'🔥', user:'@marco', track:'HUMBLE.', artist:'Kendrick Lamar', time:'2 min', color:'#FF3CAC' },
  { emoji:'🌊', user:'@luna', track:'Ylang Ylang', artist:'FKJ', time:'4 min', color:'#00D4FF' },
  { emoji:'💜', user:'@sasha', track:'Pink + White', artist:'Frank Ocean', time:'6 min', color:'#9B59B6' },
  { emoji:'⚡', user:'@tyler', track:'Lose Yourself', artist:'Eminem', time:'8 min', color:'#FFB800' },
  { emoji:'🎵', user:'@priya', track:'PROVENZA', artist:'Karol G', time:'now', color:'#00FFB2' },
  { emoji:'🌙', user:'@alex', track:'Skinny Love', artist:'Bon Iver', time:'3 min', color:'#7B2FFF' },
  { emoji:'🔥', user:'@zoe', track:'good 4 u', artist:'Olivia Rodrigo', time:'5 min', color:'#FF3CAC' },
];

function LiveTicker() {
  const doubled = [...LIVE_FEEDS, ...LIVE_FEEDS];
  return (
    <div style={{
      width:'100%', overflow:'hidden',
      margin:'16px 0 32px',
      maskImage:'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      WebkitMaskImage:'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ display:'flex', gap:0, width:'max-content' }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:7,
            padding:'8px 20px',
            borderRight:'1px solid rgba(255,255,255,0.06)',
            whiteSpace:'nowrap', flexShrink:0,
          }}>
            <span style={{ fontSize:15 }}>{item.emoji}</span>
            <span style={{ fontSize:13, fontWeight:700, color:item.color }}>{item.user}</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>is listening to</span>
            <span style={{ fontSize:13, fontWeight:700, color:'#F0F0FF' }}>{item.track}</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>—</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{item.artist}</span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginLeft:4 }}>· {item.time}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const leftScreens  = [<ScreenProfile key="p" />, <ScreenPulse key="pu" />];
  const rightScreens = [<ScreenNowCard key="n" />, <ScreenCompatibility key="c" />];


  return (
    <main style={{ backgroundColor:C.bg, fontFamily:'Inter, system-ui, sans-serif', color:C.text, overflowX:'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'14px 16px',
        background:'rgba(10,10,26,0.92)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img
            src="/zik4u-logo-512.svg"
            alt="Zik4U"
            width={28}
            height={28}
            style={{ borderRadius:'50%', display:'block' }}
          />
          <span style={{
            fontSize:21, fontWeight:900, letterSpacing:'0.22em',
            background:'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>ZIK4U</span>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <a href="/listeners" style={{
            fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.6)',
            textDecoration:'none', padding:'6px 10px',
            borderRadius:8,
          }}
            onMouseEnter={e => (e.currentTarget.style.color='#fff')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.6)')}>
            Listeners
          </a>
          <a href="/creators" style={{
            fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.6)',
            textDecoration:'none', padding:'6px 10px',
            borderRadius:8,
          }}
            onMouseEnter={e => (e.currentTarget.style.color='#fff')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.6)')}>
            Creators
          </a>
          <a href="/fans" style={{
            fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.6)',
            textDecoration:'none', padding:'6px 10px',
            borderRadius:8,
          }}
            onMouseEnter={e => (e.currentTarget.style.color='#fff')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.6)')}>
            Fans
          </a>
          <a href="https://apps.apple.com/app/zik4u/id6748722257" style={{
            fontSize:15, fontWeight:900, color:'#0A0A1A',
            background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)',
            padding:'9px 20px', borderRadius:999, textDecoration:'none',
            whiteSpace:'nowrap', marginLeft:8,
            boxShadow:'0 0 20px rgba(255,60,172,0.35)',
            letterSpacing:'0.03em',
          }}>
            Get the app ↓
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          BLOC UNIQUE — tout tient ensemble, pas de sections
          ════════════════════════════════════════════════════ */}
      <div style={{ paddingTop:80 }}>

        {/* Headline */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ textAlign:'center', marginBottom:20, padding:'0 20px', maxWidth:600, margin:'0 auto 20px' }}>
          <h1 style={{
            fontSize:'clamp(30px, 6vw, 36px)', fontWeight:700,
            lineHeight:1.4, margin:'0 0 14px', color:'#F0F0FF',
            letterSpacing:'-0.01em',
          }}>
            Your music identity,{' '}
            <span style={{ background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:800 }}>
              live and authentic.
            </span>
          </h1>
          {/* FOR REAL */}
          <div style={{
            fontSize:'clamp(48px, 12vw, 80px)', fontWeight:900,
            lineHeight:1, letterSpacing:'-0.03em',
            background:'linear-gradient(135deg, #00D4FF, #00FFB2 40%, #FF3CAC)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            marginBottom:4,
          }}>
            For real.
          </div>
        </motion.div>

        {/* Sous-titre */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
          style={{
            fontSize:'clamp(18px, 4.5vw, 22px)',
            color:'rgba(255,255,255,0.65)',
            textAlign:'center', lineHeight:1.75, margin:'0 0 40px',
            padding:'0 20px',
          }}>
          What you actually listen to. Who you really are.{' '}
          <strong style={{ color:'#00FFB2', fontWeight:800 }}>The people who get it.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'0 20px 32px' }}
        >
          <a href="https://apps.apple.com/app/zik4u/id6748722257"
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'18px 40px', borderRadius:999,
              background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)',
              textDecoration:'none', fontSize:18, fontWeight:900, color:'#fff',
              boxShadow:'0 0 40px rgba(255,60,172,0.4)',
              letterSpacing:'0.02em', whiteSpace:'nowrap',
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Download Free — App Store
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.zik4u.app"
            style={{
              fontSize:14, color:'rgba(255,255,255,0.4)', textDecoration:'none',
              fontWeight:600, letterSpacing:'0.03em',
            }}>
            Also on Google Play →
          </a>
        </motion.div>

        <LiveTicker />

      </div>

      <motion.div
        initial={{ opacity:0, y:16 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }}
        style={{ padding:'0 20px 48px', maxWidth:560, margin:'0 auto' }}
      >
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.25em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', textAlign:'center', marginBottom:32 }}>
          How Zik4U reads you
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            { num:'01', color:'#00D4FF', title:'Everything you play. Everywhere.', body:'Spotify, Apple Music, YouTube Music, SoundCloud, local files. All sources, captured automatically in the background. Your complete listening reality — not just one platform\'s version of it.' },
            { num:'02', color:'#FF3CAC', title:'Who you really are, musically.', body:'Not a playlist. Not a genre. A behavioral profile built from every track you\'ve actually played — when, how often, at what hour. Seven archetypes. Yours is already forming.' },
            { num:'03', color:'#00FFB2', title:'Find your people', body:'Match with listeners who share your actual taste. Subscribe to see what your favorite artists or creators really listen to. And if you\'re a creator — your real listening feed is your most authentic product.' },
          ].map((step, i) => (
            <div key={i} style={{ display:'flex', gap:20, padding:'20px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontSize:28, fontWeight:900, color:step.color, fontFamily:'monospace', opacity:0.4, flexShrink:0, lineHeight:1, paddingTop:2 }}>{step.num}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:'#F0F0FF', marginBottom:6 }}>{step.title}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3 tunnels d'acquisition */}
      <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5 }}
          style={{ display:'flex', flexDirection:'column', gap:16, padding:'0 16px', marginBottom:64 }}>

          {/* LISTENERS */}
          <a href="/listeners" style={{ textDecoration:'none', display:'block' }}>
            <div style={{
              background:'linear-gradient(135deg, #00D4FF, #00FFB2)',
              borderRadius:24, padding:'24px 24px 20px', cursor:'pointer',
              display:'flex', flexDirection:'column', gap:12,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontSize:56, lineHeight:1, flexShrink:0 }}>🎧</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:900, letterSpacing:'0.25em', color:'rgba(10,10,26,0.55)', textTransform:'uppercase', marginBottom:4 }}>LISTENERS</div>
                  <div style={{ fontSize:19, fontWeight:900, color:'#0A0A1A', lineHeight:1.25 }}>Discover who listens exactly like you.</div>
                </div>
              </div>
              <div style={{ alignSelf:'flex-start', background:'rgba(10,10,26,0.12)', borderRadius:999, padding:'8px 20px', fontSize:15, fontWeight:800, color:'#0A0A1A' }}>
                I'm a Listener →
              </div>
            </div>
          </a>

          {/* CREATORS */}
          <a href="/creators" style={{ textDecoration:'none', display:'block' }}>
            <div style={{
              background:'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
              borderRadius:24, padding:'24px 24px 20px', cursor:'pointer',
              display:'flex', flexDirection:'column', gap:12,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontSize:56, lineHeight:1, flexShrink:0 }}>🎤</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:900, letterSpacing:'0.25em', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', marginBottom:4 }}>CREATORS</div>
                  <div style={{ fontSize:19, fontWeight:900, color:'#fff', lineHeight:1.25 }}>Turn your real taste into income.</div>
                </div>
              </div>
              <div style={{ alignSelf:'flex-start', background:'rgba(255,255,255,0.15)', borderRadius:999, padding:'8px 20px', fontSize:15, fontWeight:800, color:'#fff' }}>
                I'm a Creator →
              </div>
            </div>
          </a>

          {/* FANS */}
          <a href="/fans" style={{ textDecoration:'none', display:'block' }}>
            <div style={{
              background:'linear-gradient(135deg, #1a1a3a, #12122A)',
              border:'1.5px solid rgba(255,255,255,0.22)',
              borderRadius:24, padding:'24px 24px 20px', cursor:'pointer',
              display:'flex', flexDirection:'column', gap:12,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontSize:56, lineHeight:1, flexShrink:0 }}>🌟</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:900, letterSpacing:'0.25em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:4 }}>FANS</div>
                  <div style={{ fontSize:19, fontWeight:900, color:'#fff', lineHeight:1.25 }}>Get inside your favorite artist's actual world.</div>
                </div>
              </div>
              <div style={{ alignSelf:'flex-start', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:999, padding:'8px 20px', fontSize:15, fontWeight:800, color:'rgba(255,255,255,0.8)' }}>
                I'm a Fan →
              </div>
            </div>
          </a>

      </motion.div>

      {/* ── EQUALIZER SECTION ── */}
      <div style={{ padding:'0 0 80px', overflow:'hidden' }}>
        {/* Equalizer pleine largeur — effet chaîne hifi */}
        <div style={{
          width:'100%',
          background:'#0A0A1A',
          padding:'32px 0',
          position:'relative',
          overflow:'hidden',
        }}>
          {/* Ligne centrale style VU-mètre */}
          <div style={{
            position:'absolute', top:'50%', left:0, right:0,
            height:1, background:'rgba(255,255,255,0.04)',
            transform:'translateY(-50%)', zIndex:0,
          }} />

          {/* Les barres pleine largeur */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            gap:2, height:120, padding:'0 12px',
            position:'relative', zIndex:1,
          }}>
            {Array.from({ length: 80 }, (_, i) => {
              const colors = ['#00D4FF','#00D4FF','#00FFB2','#00FFB2','#FF3CAC','#7B2FFF','#FFB800','#00FFB2'];
              const color = colors[i % colors.length];
              const baseH = 0.2 + Math.abs(Math.sin(i * 0.35)) * 0.8;
              return (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [baseH, baseH * 0.15, baseH * 0.9, baseH * 0.3, baseH * 0.75, baseH * 0.1, baseH],
                    opacity: [1, 0.7, 1, 0.6, 1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.2 + (i % 11) * 0.13,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.025,
                  }}
                  style={{
                    width: 3,
                    height: 120,
                    borderRadius: 2,
                    background: `linear-gradient(180deg, ${color}, ${color}44)`,
                    transformOrigin: 'center',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>

        </div>

        {/* 3 features sous l'égaliseur */}
        <div style={{ display:'flex', flexDirection:'column', padding:'40px 20px 0', maxWidth:640, margin:'0 auto' }}>
          {[
            { color:'#00D4FF', title:'Your real archetype.', text:'7 behavioral profiles computed from how you actually listen. Not what you claim to like.' },
            { color:'#FF3CAC', title:'Live Pulse rooms.', text:'Strangers listening to the same track at the same moment. Collective, unfiltered.' },
            { color:'#00FFB2', title:'Real compatibility.', text:'87% means you both played the same FKJ track at 2am. Not just "I like jazz too".' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:10 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1 }}
              style={{
                padding:'22px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
              <div style={{ width:28, height:3, background:item.color, borderRadius:2, marginBottom:12 }} />
              <div style={{ fontSize:22, fontWeight:900, color:'#F0F0FF', lineHeight:1.2, marginBottom:8 }}>{item.title}</div>
              <div style={{ fontSize:18, color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>{item.text}</div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* disclaimer moved to footer */}

      {/* ── APP SCREENS ── */}
      <div style={{ overflow:'hidden', padding:'0 0 80px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 40%, rgba(123,47,255,0.06), transparent 70%)`, pointerEvents:'none' }} />

        {/* Titre */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ textAlign:'center', padding:'0 24px', marginBottom:48, position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'clamp(30px, 3.5vw, 36px)', fontWeight:900, lineHeight:1.15, margin:'0 0 12px', letterSpacing:'-0.02em' }}>
            What it feels like.{' '}
            <span style={{ background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </h2>
          <p style={{ fontSize:19, color:C.muted, margin:0 }}>
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

        {/* Mobile — stack vertical */}
        <div className="screens-mobile" style={{ display:'none', flexDirection:'column', alignItems:'center', gap:20, padding:'4px 16px 12px', position:'relative', zIndex:1 }}>
          {[<ScreenProfile key="p" />, <ScreenNowCard key="n" />].map((screen, i) => (
            <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              style={{ width:'100%', maxWidth:400, display:'flex', justifyContent:'center' }}>
              {screen}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA FINAL FORT ── */}
      <div style={{ textAlign:'center', padding:'0 24px 56px' }}>
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <h2 style={{ fontSize:'clamp(26px, 5vw, 36px)', fontWeight:900, lineHeight:1.2, margin:'0 0 8px', letterSpacing:'-0.02em' }}>
            Your music taste is your identity.
          </h2>
          <div style={{ fontSize:'clamp(26px, 5vw, 36px)', fontWeight:900, background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:32 }}>
            Own it.
          </div>
          <a href="https://apps.apple.com/app/zik4u/id6748722257"
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'20px 48px', borderRadius:999,
              background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)',
              textDecoration:'none', fontSize:18, fontWeight:900, color:'#fff',
              boxShadow:'0 0 60px rgba(255,60,172,0.35)',
              letterSpacing:'0.02em',
            }}>
            Download Zik4U — It's free
          </a>
          <div style={{ marginTop:12, fontSize:13, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>
            App Store · Google Play
          </div>
        </motion.div>
      </div>

      {/* ── STORE BUTTONS ── */}
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', padding:'0 24px 48px' }}>
        <a href={APP_STORE_URL}
          style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 26px', borderRadius:14, background:C.text, textDecoration:'none', boxShadow:'0 4px 24px rgba(0,0,0,0.3)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={C.bg}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          <div>
            <div style={{ fontSize:14, color:C.bg, opacity:0.5, letterSpacing:'0.06em' }}>Download on the</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.bg, lineHeight:1 }}>App Store</div>
          </div>
        </a>
        <a href={PLAY_STORE_URL}
          style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 26px', borderRadius:14, background:C.card, border:`1px solid rgba(255,255,255,0.12)`, textDecoration:'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5c-.5.33-1.5.33-1.5-.5z" fill={C.mint}/></svg>
          <div>
            <div style={{ fontSize:14, color:C.muted, opacity:0.6, letterSpacing:'0.06em' }}>Get it on</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.text, lineHeight:1 }}>Google Play</div>
          </div>
        </a>
      </div>

      {/* ── WORKS WITH ── */}
      <div style={{ textAlign:'center', padding:'0 20px 72px' }}>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.2)',
          letterSpacing:'0.18em', textTransform:'uppercase',
          marginBottom:28 }}>Works with</p>
        <div style={{ display:'flex', gap:16, justifyContent:'center',
          flexWrap:'wrap', alignItems:'center' }}>

          {/* Spotify */}
          <a href="/works-with/spotify" style={{ display:'flex',
            alignItems:'center', gap:8, textDecoration:'none',
            padding:'10px 16px', borderRadius:12,
            background:'rgba(29,185,84,0.08)',
            border:'1px solid rgba(29,185,84,0.2)',
            transition:'opacity 0.2s', opacity:0.8 }}
            onMouseEnter={e => (e.currentTarget.style.opacity='1')}
            onMouseLeave={e => (e.currentTarget.style.opacity='0.8')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span style={{ fontSize:20, fontWeight:700, color:'#1DB954' }}>Spotify</span>
          </a>

          {/* Apple Music */}
          <a href="/works-with/apple-music" style={{ display:'flex',
            alignItems:'center', gap:8, textDecoration:'none',
            padding:'10px 16px', borderRadius:12,
            background:'rgba(252,60,68,0.08)',
            border:'1px solid rgba(252,60,68,0.2)',
            transition:'opacity 0.2s', opacity:0.8 }}
            onMouseEnter={e => (e.currentTarget.style.opacity='1')}
            onMouseLeave={e => (e.currentTarget.style.opacity='0.8')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FC3C44">
              <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208A4.95 4.95 0 00.05 4.783c-.004.052-.007.104-.01.156v14.12c.016.229.027.457.058.684.135 1.056.504 2.01 1.136 2.83.766 1.007 1.775 1.63 3.004 1.905.39.086.787.126 1.187.14.047.002.094.007.14.007H18.65c.37-.014.738-.052 1.098-.126 1.285-.267 2.32-.933 3.092-1.95.467-.627.783-1.323.917-2.076.108-.597.145-1.2.148-1.804V6.34c-.002-.072-.005-.144-.01-.216zm-10.55 12.565c-.66.46-1.413.65-2.21.53-.785-.117-1.427-.49-1.9-1.12-.398-.526-.574-1.12-.573-1.773.002-.684.193-1.294.57-1.837.528-.77 1.27-1.22 2.203-1.296.428-.035.845.022 1.245.178V8.7l-5.05 1.053v7.73c0 .127-.015.254-.03.38-.075.582-.368 1.043-.853 1.376-.378.26-.803.39-1.255.387-.226-.003-.45-.034-.667-.105-.742-.238-1.25-.892-1.28-1.676a1.916 1.916 0 01.433-1.292c.345-.408.79-.635 1.3-.72.3-.05.605-.033.898.06V11.63l7.027-1.466v6.853c-.008.78-.26 1.444-.857 1.672z"/>
            </svg>
            <span style={{ fontSize:20, fontWeight:700, color:'#FC3C44' }}>Apple Music</span>
          </a>

          {/* YouTube Music */}
          <a href="/works-with/youtube-music" style={{ display:'flex',
            alignItems:'center', gap:8, textDecoration:'none',
            padding:'10px 16px', borderRadius:12,
            background:'rgba(255,0,0,0.08)',
            border:'1px solid rgba(255,0,0,0.18)',
            transition:'opacity 0.2s', opacity:0.8 }}
            onMouseEnter={e => (e.currentTarget.style.opacity='1')}
            onMouseLeave={e => (e.currentTarget.style.opacity='0.8')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12 9.684 15.54z"/>
            </svg>
            <span style={{ fontSize:20, fontWeight:700, color:'#FF0000' }}>YT Music</span>
          </a>

          {/* SoundCloud */}
          <a href="/works-with/soundcloud" style={{ display:'flex',
            alignItems:'center', gap:8, textDecoration:'none',
            padding:'10px 16px', borderRadius:12,
            background:'rgba(255,85,0,0.08)',
            border:'1px solid rgba(255,85,0,0.2)',
            transition:'opacity 0.2s', opacity:0.8 }}
            onMouseEnter={e => (e.currentTarget.style.opacity='1')}
            onMouseLeave={e => (e.currentTarget.style.opacity='0.8')}>
            <svg width="22" height="14" viewBox="0 0 40 20" fill="#FF5500">
              <path d="M0 14.5c0 1.4 1.1 2.5 2.4 2.5.6 0 1.2-.2 1.6-.6V9.8C3.6 9.4 3 9.2 2.4 9.2 1.1 9.2 0 10.3 0 14.5zm5.5 2.5h1.6V8.8c-.5-.3-1-.5-1.6-.5v8.7zm3.2 0h1.6V7.2c-.5.1-1 .3-1.6.6v9.2zm3.2 0h1.6V6.4c-.5.2-1 .5-1.6.8v9.8zm3.2 0h1.6V5.8c-.5.3-1 .6-1.6 1v10.2zm3.2.1c.1 0 .1 0 0 0h1.7V3.5c-.2 0-.5-.1-.7-.1-.3 0-.6 0-.9.1l-.1 13.5zm3.3-.1h1.6V3.1c-.5.1-1.1.3-1.6.6V17zm3.2 0h1.6V2.8c-.5.1-1.1.2-1.6.4V17zm3.2 0H28V2.5c-.5 0-1.1.1-1.6.2V17zm3.2 0h1.6V2.3h-.1c-.5 0-1 0-1.5.1V17zm5.3-10.6c-.2 0-.5 0-.7.1C31.4 3 28.4.5 24.8.5c-1 0-1.9.2-2.8.6V17h10.8c2.5 0 4.5-2 4.5-4.5s-2-4.6-4.5-4.6c-.3 0-.7 0-1 .1.1-.2.1-.4.1-.6 0-1.7-1.3-3-3-3z"/>
            </svg>
            <span style={{ fontSize:20, fontWeight:700, color:'#FF5500' }}>SoundCloud</span>
          </a>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:'28px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img
            src="/zik4u-logo-512.svg"
            alt="Zik4U"
            width={28}
            height={28}
            style={{ borderRadius:'50%', display:'block' }}
          />
          <span style={{ fontSize:20, fontWeight:900, letterSpacing:'0.22em', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>ZIK4U</span>
        </div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[{label:'Privacy',href:'/legal/privacy'},{label:'Terms',href:'/legal/terms'},{label:'For labels & researchers',href:'/partner'}].map(l => (
            <a key={l.href} href={l.href}
              style={{ fontSize:16, color:C.dim, textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color=C.text)}
              onMouseLeave={e => (e.currentTarget.style.color=C.dim)}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ width:'100%', marginTop:12, textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'monospace', letterSpacing:1 }}>
          Screens shown are simulated. Data is illustrative.
        </div>
      </footer>

    </main>
  );
}
