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

const ALL_PLATFORMS = [
  { slug:'spotify',       name:'Spotify',        color:'#1DB954', region:'🌍 Global',      users:'600M+',  status:'full' },
  { slug:'apple-music',   name:'Apple Music',    color:'#FC3C44', region:'🌍 Global',      users:'100M+',  status:'full' },
  { slug:'youtube-music', name:'YouTube Music',  color:'#FF0000', region:'🌍 Global',      users:'80M+',   status:'full' },
  { slug:'soundcloud',    name:'SoundCloud',     color:'#FF5500', region:'🌍 Global',      users:'40M+',   status:'full' },
  { slug:'deezer',        name:'Deezer',         color:'#A238FF', region:'🇫🇷 FR / LATAM / Africa', users:'16M+', status:'full' },
  { slug:'tidal',         name:'Tidal',          color:'#00FFFF', region:'🌍 Global',      users:'10M+',   status:'full' },
  { slug:'lastfm',        name:'Last.fm',        color:'#D51007', region:'🌍 Global',      users:'50M+',   status:'full' },
  { slug:'amazon-music',  name:'Amazon Music',   color:'#00A8E1', region:'🌍 Global',      users:'55M+',   status:'full' },
  { slug:'boomplay',      name:'Boomplay',       color:'#F5A623', region:'🌍 Africa / Global', users:'100M+', status:'full' },
  { slug:null,            name:'Anghami',        color:'#6B3FA0', region:'🌍 MENA',        users:'70M+',   status:'soon' },
  { slug:null,            name:'JioSaavn',       color:'#2BC5B4', region:'🇮🇳 India',       users:'100M+',  status:'soon' },
  { slug:null,            name:'Gaana',          color:'#E72C30', region:'🇮🇳 India',       users:'50M+',   status:'soon' },
  { slug:null,            name:'Qobuz',          color:'#2A7FFF', region:'🇫🇷 FR / EU',    users:'4M+',    status:'soon' },
  { slug:null,            name:'Bandcamp',       color:'#1DA0C3', region:'🌍 Global',      users:'6M+',    status:'soon' },
  { slug:null,            name:'Local files',    color:'#00FFB2', region:'🌍 All devices', users:'—',      status:'full' },
];

const REGIONS = [
  { flag:'🌍', label:'Global', coverage:'Spotify · Apple Music · YouTube Music · SoundCloud · Last.fm · Tidal · Amazon Music' },
  { flag:'🇫🇷', label:'France & Europe', coverage:'Deezer · Qobuz · Spotify · Apple Music' },
  { flag:'🌍', label:'Africa', coverage:'Boomplay · Deezer · Spotify' },
  { flag:'🌍', label:'Middle East & North Africa', coverage:'Anghami · Spotify · Deezer' },
  { flag:'🇮🇳', label:'India', coverage:'JioSaavn · Gaana · Spotify · Apple Music' },
  { flag:'🌎', label:'Latin America', coverage:'Deezer · Spotify · Apple Music' },
];

export default function WorksWithCatalogPage() {
  const router = useRouter();
  const full = ALL_PLATFORMS.filter(p => p.status === 'full');
  const soon = ALL_PLATFORMS.filter(p => p.status === 'soon');

  return (
    <main style={{ minHeight:'100vh', backgroundColor:C.bg, color:C.text, fontFamily:'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 32px', maxWidth:900, margin:'0 auto', borderBottom:`1px solid ${C.border}` }}>
        <button onClick={() => router.push('/')} style={{ background:`linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', border:'none', fontSize:20, fontWeight:900, letterSpacing:'0.2em', cursor:'pointer', fontFamily:'Inter, system-ui, sans-serif', padding:0 }}>
          ZIK4U
        </button>
        <a href="https://apps.apple.com/app/zik4u/id6748722257" style={{ fontSize:14, fontWeight:800, color:'#0A0A1A', background:`linear-gradient(90deg, ${C.pink}, ${C.purple})`, padding:'8px 18px', borderRadius:999, textDecoration:'none' }}>
          Get the app ↓
        </a>
      </nav>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px 100px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} style={{ padding:'64px 0 48px', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:16 }}>Every source. One identity.</p>
          <h1 style={{ fontSize:'clamp(32px, 6vw, 56px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:16 }}>
            Works with{' '}
            <span style={{ background:`linear-gradient(90deg, ${C.cyan}, ${C.mint})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              14+ music sources
            </span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>
            Zik4U is the only music social platform that captures your listening identity across every ecosystem — Western, African, South Asian, and beyond.
          </p>
          <div style={{ display:'flex', gap:24, justifyContent:'center', marginTop:32, flexWrap:'wrap' }}>
            {[['14+','Sources integrated'],['700M+','Combined users reached'],['6','Geographic regions']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:900, background:`linear-gradient(90deg,${C.cyan},${C.mint})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{n}</div>
                <div style={{ fontSize:13, color:C.muted }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Plateformes disponibles */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:56 }}>
          <h2 style={{ fontSize:18, fontWeight:900, marginBottom:6 }}>Available now</h2>
          <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>Connect any of these sources in the app.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12 }}>
            {full.map(p => (
              <div key={p.name}
                onClick={() => p.slug && router.push(`/works-with/${p.slug}`)}
                style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`3px solid ${p.color}`, borderRadius:14, padding:'16px 18px', cursor:p.slug?'pointer':'default', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'border-color 0.2s' }}
                onMouseEnter={e => p.slug && ((e.currentTarget as HTMLDivElement).style.borderColor=p.color)}
                onMouseLeave={e => p.slug && ((e.currentTarget as HTMLDivElement).style.borderColor=C.border)}
              >
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:p.color }}>{p.name}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{p.region} · {p.users} users</div>
                </div>
                {p.slug && <span style={{ color:C.muted, fontSize:18 }}>→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Coming soon */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:64 }}>
          <h2 style={{ fontSize:18, fontWeight:900, marginBottom:6 }}>Coming soon</h2>
          <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>More integrations in progress.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12 }}>
            {soon.map(p => (
              <div key={p.name} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid rgba(255,255,255,0.06)`, borderRadius:14, padding:'16px 18px', opacity:0.6, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:'rgba(255,255,255,0.5)' }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{p.region} · {p.users} users</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Soon</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Couverture géographique */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ marginBottom:64 }}>
          <h2 style={{ fontSize:18, fontWeight:900, marginBottom:6 }}>Global coverage</h2>
          <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>Zik4U is the only music social platform built for every ecosystem.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {REGIONS.map((r,i) => (
              <div key={r.label} style={{ display:'flex', gap:16, padding:'16px 0', borderBottom:i<REGIONS.length-1?`1px solid ${C.border}`:undefined, alignItems:'flex-start' }}>
                <span style={{ fontSize:24, flexShrink:0, lineHeight:1.3 }}>{r.flag}</span>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:13, color:C.muted }}>{r.coverage}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center' }}>
          <h2 style={{ fontSize:26, fontWeight:900, marginBottom:12 }}>Your music taste is your identity.</h2>
          <p style={{ color:C.muted, fontSize:15, marginBottom:32 }}>Connect every source. Own the full picture. For real.</p>
          <a href="https://apps.apple.com/app/zik4u/id6748722257" style={{ display:'inline-block', background:`linear-gradient(135deg, ${C.pink}, ${C.purple})`, borderRadius:14, padding:'16px 40px', color:'#fff', fontSize:16, fontWeight:900, textDecoration:'none', boxShadow:`0 0 40px rgba(255,60,172,0.3)` }}>
            Download Zik4U — It's free
          </a>
        </motion.div>

      </div>
    </main>
  );
}
