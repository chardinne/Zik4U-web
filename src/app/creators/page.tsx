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

const STORY_TEXT = `I just joined Zik4U. You can now see what I'm actually listening to, in real time.\nLink in bio 👇\n#Zik4U #Music`;

const FEATURES_MONETIZE = [
  {
    emoji: '💰',
    title: 'Abonnements mensuels',
    body: 'Tu gardes 80% de chaque abonnement. Zik4U prend 20%. Paiement direct chaque mois via Trolley. Les abonnements web sont au prix juste — les stores majorent de 15% de leur côté.',
    color: C.mint,
  },
  {
    emoji: '🎵',
    title: 'Drops exclusifs',
    body: '5 moods : Découverte, Obsession, Nostalgie, Réconfort, Bouleversant. Partage un titre avec ton ressenti — réservé à tes abonnés.',
    color: C.pink,
  },
  {
    emoji: '📊',
    title: 'Creator Analytics',
    body: 'Dashboard complet : revenus, nouveaux abonnés, compatibilité musicale avec ta communauté, tes titres qui performent le mieux.',
    color: C.cyan,
  },
  {
    emoji: '💳',
    title: 'Paiements directs',
    body: 'Via Trolley — virement bancaire automatique chaque mois. Seuil minimum $25. Tu gardes 70% des revenus d\'abonnement.',
    color: C.gold,
  },
];

const FEATURES_VISIBILITY = [
  {
    emoji: '🎁',
    title: 'WrappedCreator',
    body: '6 cartes partageables générées automatiquement : ton top titre, ton archétype, tes premières oreilles. Le levier viral de Zik4U. Tes fans les repartagent.',
    color: C.pink,
  },
  {
    emoji: '👂',
    title: 'Première Oreille',
    body: 'Badge visible sur ton profil : tu as découvert cet artiste avant tout le monde. Tes abonnés voient ton influence. Ça crédibilise ta curation.',
    color: C.mint,
  },
  {
    emoji: '🎯',
    title: 'Score de compatibilité',
    body: 'Chaque fan voit son score de compatibilité musicale avec toi. Ça crée un lien fort — ce n\'est pas juste un abonnement, c\'est une affinité.',
    color: C.cyan,
  },
  {
    emoji: '🔔',
    title: 'Notifications push',
    body: 'Quand tu publies un Drop, tes abonnés reçoivent une notification push immédiate. Pas d\'algorithme entre toi et ta communauté.',
    color: C.purple,
  },
];

const FEATURES_PRESENCE = [
  {
    emoji: '📡',
    title: 'Feed d\'écoute live',
    body: 'Tes fans voient ce que tu écoutes en temps réel. Pas ce que tu veux montrer — ce que tu écoutes vraiment. C\'est ça l\'authenticité.',
    color: C.cyan,
  },
  {
    emoji: '🎧',
    title: 'Pulse — Rooms live',
    body: 'Lance une session d\'écoute live avec ta communauté. Même titre, même moment, réactions en temps réel. Une expérience collective autour de ta musique.',
    color: C.purple,
  },
  {
    emoji: '🃏',
    title: 'Profil public zik4u.com',
    body: 'Chaque créateur a sa page publique zik4u.com/creator/[username]. Tes fans peuvent s\'abonner directement depuis le web.',
    color: C.pink,
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Connecte tes services de streaming',
    body: 'Spotify, Apple Music, YouTube Music. Zik4U capture automatiquement ton écoute réelle. Pas de saisie manuelle.',
    color: C.cyan,
  },
  {
    number: '02',
    title: 'Active le Creator Studio',
    body: 'Crée tes tiers d\'abonnement, publie tes premiers Drops exclusifs, configure ton profil public. 10 minutes.',
    color: C.mint,
  },
  {
    number: '03',
    title: 'Partage ton WrappedCreator',
    body: 'Tes 6 cartes partageables sont générées automatiquement. Poste-les sur tes réseaux. Tes fans suivent le lien.',
    color: C.pink,
  },
  {
    number: '04',
    title: 'Reçois tes revenus chaque mois',
    body: 'Virement automatique. Tu gardes 70%. Le reste finance la plateforme et les coûts opérationnels.',
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
            Pour les Créateurs
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 76px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Ta musique réelle.{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ta communauté réelle.
            </span>
          </h1>
          <p style={{ fontSize:'clamp(15px, 2vw, 18px)',
            color:'rgba(255,255,255,0.55)', lineHeight:1.7,
            maxWidth:520, marginBottom:32 }}>
            Pas d&apos;algorithme entre toi et tes fans.
            Tes abonnés suivent ce que tu écoutes vraiment.<br />
            <strong style={{ color:'#FF3CAC', fontWeight:700 }}>
              70% des revenus. For real.
            </strong>
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Devenir créateur — iOS →
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '14px 28px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Devenir créateur — Android →
            </a>
          </div>
        </motion.div>

        {/* 4 étapes */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.pink}>Comment ça marche</SectionTitle>
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

        {/* Monétisation */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.gold}>Monétisation</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_MONETIZE.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Visibilité */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.mint}>Visibilité &amp; viralité</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_VISIBILITY.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Présence live */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.purple}>Présence live</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES_PRESENCE.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Social proof — copier le post */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ background: `linear-gradient(135deg, rgba(255,60,172,0.06), rgba(123,47,255,0.04))`, borderRadius: 20, padding: 32, border: `1px solid rgba(255,60,172,0.15)`, marginBottom: 48 }}>
          <p style={{ fontSize: 19, fontWeight: 700, letterSpacing: '0.15em', color: C.pink, textTransform: 'uppercase', marginBottom: 16 }}>
            Annonce à ta communauté
          </p>
          <pre style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', marginBottom: 16 }}>
            {STORY_TEXT}
          </pre>
          <button onClick={handleCopy} style={{ background: copied ? 'rgba(0,255,178,0.1)' : C.card, border: `1px solid ${copied ? C.mint : C.border}`, borderRadius: 8, padding: '10px 20px', color: copied ? C.mint : C.muted, fontSize: 17, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {copied ? '✓ Copié !' : 'Copier le post →'}
          </button>
        </motion.div>

        {/* CTA final */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', padding: '64px 32px', background: `linear-gradient(135deg, rgba(255,60,172,0.06), rgba(123,47,255,0.04))`, borderRadius: 24, border: `1px solid rgba(255,60,172,0.15)` }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>
            Ton premier abonné{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.pink}, ${C.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              peut être aujourd&apos;hui.
            </span>
          </h2>
          <p style={{ color: C.muted, fontSize: 20, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
            Gratuit. Setup en 10 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Télécharger — iOS
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '14px 32px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 19, textDecoration: 'none' }}>
              Télécharger — Android
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
            Lance-toi.{' '}
            <span style={{ background:`linear-gradient(90deg, #FF3CAC, #7B2FFF)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              For real.
            </span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:19,
            marginBottom:28 }}>
            Ton Creator Studio t&apos;attend. Gratuit pour commencer.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center',
            flexWrap:'wrap' }}>
            <a href="https://apps.apple.com/app/zik4u/id6748722257"
              style={{ padding:'15px 28px',
                background:`linear-gradient(135deg, #FF3CAC, #7B2FFF)`,
                borderRadius:12, color:'#fff', fontWeight:800,
                fontSize:19, textDecoration:'none' }}>
              App Store →
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.zik4u.app"
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
