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
    title: 'Ton identité musicale réelle',
    body: 'Connecte Spotify, Apple Music, YouTube Music. Chaque écoute construit ton profil automatiquement. Pas de curation. Pas de performance. La vérité.',
    color: C.cyan,
  },
  {
    emoji: '🃏',
    title: 'Now Card',
    body: 'Un snapshot live de ton identité musicale aujourd\'hui. Partage-le sur Instagram, TikTok. Les gens demandent "c\'est quoi cette app ?".',
    color: C.mint,
  },
  {
    emoji: '🌙',
    title: 'Ton archétype musical',
    body: '7 profils — Night Explorer, Deep Feeler, Cultural Nomad, Obsessive Fan... Calculé sur tes vraies écoutes. Affiché sur ton profil.',
    color: C.purple,
  },
  {
    emoji: '📅',
    title: 'Weekly Insights',
    body: 'Chaque semaine : ton titre de la semaine, tes découvertes, ton score émotionnel. Le résumé de ce que ta musique dit de toi.',
    color: C.cyan,
  },
  {
    emoji: '🎁',
    title: 'Zik4U Wrapped',
    body: '6 cartes partageables qui résument ton année musicale. Ton top artiste, ton mood dominant, tes premières oreilles. Plus honnête que Spotify.',
    color: C.pink,
  },
];

const FEATURES_SOCIAL = [
  {
    emoji: '🎯',
    title: 'Music Compatibility Score',
    body: 'Un score de 0 à 100% entre toi et n\'importe qui. Basé sur vos vraies écoutes communes des 30 derniers jours. Pas une approximation algorithmique.',
    color: C.mint,
  },
  {
    emoji: '📡',
    title: 'Feed d\'écoute réel',
    body: 'Un feed social où chaque post est une vraie écoute. Tu vois ce que tes amis écoutent maintenant. Pas ce qu\'ils veulent que tu croies.',
    color: C.cyan,
  },
  {
    emoji: '✦',
    title: 'Le Signal',
    body: 'Partage ton mood musical du moment en un tap — 🌙 Nocturne, 🔥 Énergie, 💜 Mélancolie... Visible 3h sur ton profil. Tes amis le voient dans leurs Stories.',
    color: C.gold,
  },
  {
    emoji: '〜',
    title: 'La Vague',
    body: 'Tu écoutes quelque chose qui te touche. Un tap — le titre part dans le feed instantanément. Zéro friction. Zéro construction.',
    color: C.cyan,
  },
  {
    emoji: '〜',
    title: "L'Écho",
    body: 'Réponds à une écoute par une écoute. Sous chaque post, au lieu d\'un commentaire texte — envoie le titre que ça te fait penser. Une conversation sans mots.',
    color: C.mint,
  },
];

const FEATURES_CONNECTION = [
  {
    emoji: '🎵',
    title: 'Music Match',
    body: 'Rencontre des gens qui écoutent comme toi. Pour de vrai. Pas basé sur ta photo. Basé sur ce que tu écoutes à 3h du matin. Opt-in, 17+.',
    color: C.pink,
  },
  {
    emoji: '✨',
    title: 'Synchronicité rare',
    body: 'Quand toi et quelqu\'un d\'autre écoutez le même titre obscur le même jour — Zik4U vous le dit. Vous êtes 12 sur la plateforme à l\'avoir entendu.',
    color: C.purple,
  },
  {
    emoji: '🔴',
    title: 'Le Fil Rouge',
    body: 'Quand tu as une synchronicité avec quelqu\'un, un fil de conversation de 7 jours s\'ouvre autour de cet artiste. La conversation naît de la musique.',
    color: C.pink,
  },
  {
    emoji: '🎧',
    title: 'Pulse — Écouter ensemble',
    body: 'Crée une room d\'écoute live avec tes amis. Même titre, même moment, réactions en temps réel. Ou invite une seule personne pour un moment privé à deux.',
    color: C.purple,
  },
];

const FEATURES_MEMORY = [
  {
    emoji: '🌱',
    title: 'Première Oreille',
    body: 'Tu as découvert un artiste avant tout le monde ? Zik4U te badge. Tu peux voir combien de personnes tu as influencé depuis.',
    color: C.mint,
  },
  {
    emoji: '📈',
    title: 'Portrait Évolutif',
    body: '12 mois d\'archetypes musicaux sur une timeline. Tu vois comment ta musique a évolué — et ce que ça révèle sur toi.',
    color: C.cyan,
  },
  {
    emoji: '🔁',
    title: 'Rituels d\'écoute',
    body: 'Zik4U détecte tes patterns récurrents. "Ton rituel du vendredi : jazz nocturne depuis 6 semaines." Nommés, pas surveillés.',
    color: C.purple,
  },
  {
    emoji: '💌',
    title: 'Ta Lettre Musicale',
    body: 'Une fois par an, à la date de ton inscription, Zik4U génère une lettre écrite à partir de tes données. Pas des stats — ce que ta musique a voulu te dire.',
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
      <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

function SectionTitle({ children, color }: { children: string; color: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
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

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <button onClick={() => router.push('/')} style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.mint}, ${C.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', border: 'none', fontSize: 20, fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', padding: 0 }}>
          ZIK4U
        </button>
        <div style={{ display: 'flex', gap: 24 }}>
          <button onClick={() => router.push('/creators')} style={{ background: 'none', border: 'none', fontSize: 14, color: C.muted, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }} onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
            Créateurs →
          </button>
          <button onClick={() => router.push('/fans')} style={{ background: 'none', border: 'none', fontSize: 14, color: C.muted, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }} onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
            Fans →
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 120px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ marginBottom: 80 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: C.cyan, textTransform: 'uppercase', marginBottom: 24 }}>
            Pour les Listeners
          </p>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Tu es ce que tu écoutes.{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Vraiment.
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: C.muted, lineHeight: 1.7, maxWidth: 580, marginBottom: 40 }}>
            Zik4U capture ce que tu écoutes réellement — pas ce que tu veux montrer.
            Et construit à partir de là des connexions, des insights, et une identité
            que personne d'autre ne peut fabriquer.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`, borderRadius: 12, color: '#0A0A1A', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
               App Store →
            </a>
            <a href={PLAY_STORE_URL} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
               Google Play →
            </a>
          </div>
        </motion.div>

        {/* Section 1 — Identité */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.cyan}>Ton identité musicale</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {FEATURES_IDENTITY.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Section 2 — Social */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.mint}>Le social de l&apos;instant</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {FEATURES_SOCIAL.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Section 3 — Connexion */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.purple}>Connexions réelles</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {FEATURES_CONNECTION.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* Section 4 — Mémoire */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <SectionTitle color={C.pink}>Ta mémoire musicale</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {FEATURES_MEMORY.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </motion.section>

        {/* CTA final */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', padding: '64px 32px', background: `linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,255,178,0.04))`, borderRadius: 24, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>
            Prêt à découvrir{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.mint})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              qui tu es vraiment ?
            </span>
          </h2>
          <p style={{ color: C.muted, fontSize: 16, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
            Gratuit. Aucune carte requise.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${C.cyan}, ${C.mint})`, borderRadius: 12, color: '#0A0A1A', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Télécharger — iOS
            </a>
            <a href={PLAY_STORE_URL} style={{ padding: '14px 32px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Télécharger — Android
            </a>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
