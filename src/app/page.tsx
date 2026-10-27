'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { WaitlistForm, WaitlistLink } from '@/components/waitlist/WaitlistForm';


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
            src="/zik4u-logo.svg"
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
          style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', padding:'0 20px 32px' }}
        >
          <WaitlistForm defaultRole="listener" />
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
            { num:'01', color:'#00D4FF', title:'Everything you play. Everywhere.', body:'The music apps you already use, captured automatically in the background. Your complete listening reality, across every app you use, not just one platform\'s version of it.' },
            { num:'02', color:'#FF3CAC', title:'Who you really are, musically.', body:'Not a playlist. Not a genre. A behavioral profile built from every track you\'ve actually played, when, how often, at what hour. Seven archetypes. Yours is already forming.' },
            { num:'03', color:'#00FFB2', title:'Find your people', body:'Match with listeners who share your actual taste. Subscribe to see what your favorite artists or creators really listen to. And if you\'re a creator, your real listening feed is your most authentic product.' },
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
          <div style={{ fontSize:'clamp(26px, 5vw, 36px)', fontWeight:900, background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:40 }}>
            Own it.
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <WaitlistLink />
          </div>
        </motion.div>
      </div>

      {/* ── WORKS WITH ── */}
      <div style={{ padding:'0 20px 80px' }}>

        {/* Bloc hero "Every source. One identity." très mis en valeur */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          style={{
            background:'linear-gradient(135deg, rgba(0,212,255,0.07), rgba(0,255,178,0.05), rgba(255,60,172,0.06))',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:28, padding:'48px 32px',
            textAlign:'center', marginBottom:40,
            position:'relative', overflow:'hidden',
          }}
        >
          {/* Glow décoratif */}
          <div style={{ position:'absolute', top:'-40%', left:'50%', transform:'translateX(-50%)', width:400, height:200, background:'radial-gradient(ellipse, rgba(0,212,255,0.12), transparent 70%)', pointerEvents:'none' }} />

          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.25em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:16, position:'relative' }}>
            The core of Zik4U
          </p>
          <h2 style={{ fontSize:'clamp(28px, 5vw, 48px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:12, position:'relative' }}>
            Every source.{' '}
            <span style={{ background:'linear-gradient(90deg, #00D4FF, #00FFB2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              One identity.
            </span>
          </h2>
          <p style={{ fontSize:'clamp(15px, 3vw, 20px)', fontWeight:900, color:'#F0F0FF', marginBottom:6, position:'relative' }}>
            Works with{' '}
            <span style={{ background:'linear-gradient(90deg, #FF3CAC, #7B2FFF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              14+ music sources
            </span>
          </p>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', marginBottom:0, position:'relative' }}>
            Every platform you use. One unified identity. For real.
          </p>
        </motion.div>

        {/* COMPLY1g (Decision 106 = A, 19/10/2026): no per-service tiles, no brand colors. */}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:'28px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img
            src="/zik4u-logo.svg"
            alt="Zik4U"
            width={28}
            height={28}
            style={{ borderRadius:'50%', display:'block' }}
          />
          <span style={{ fontSize:20, fontWeight:900, letterSpacing:'0.22em', background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>ZIK4U</span>
        </div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[{label:'Privacy',href:'/legal/privacy'},{label:'Terms',href:'/legal/terms'},{label:'Legal notice',href:'/legal/notice'}].map(l => (
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
