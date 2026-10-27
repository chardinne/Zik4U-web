import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFounderGalaxy, founderGalaxyEnabled, FOUNDER_REVALIDATE_SECONDS } from '@/lib/founderGalaxy';
import { getFounderCard } from '@/lib/sharedCard';
import { HOME_TEXTS } from '@/lib/homeTexts';
import { FOUNDER_PAGE_TEXTS as T, dnaTitle, galaxyTitle } from '@/lib/founderPageTexts';
import { ARCHETYPE_LABELS } from '@/lib/cosmicCard';
import { FounderSky } from '@/components/home/FounderSky';
import { MusicDnaCard } from '@/components/profile/SharedFullCard';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import home from '@/components/home/home.module.css';
import styles from '@/components/founder/founder.module.css';

// SITE2 — the founder's real profile, live (Decisions 174, 188 = V2, 189 = A, 190 = A of
// 27/10/2026): his galaxy, his Music DNA card (play buttons = search links, like D180), then the
// waitlist. His account only, by his consent; the FOUNDER_GALAXY=off switch removes the page.
export const revalidate = 900;
if (FOUNDER_REVALIDATE_SECONDS !== revalidate) throw new Error('revalidate must match FOUNDER_REVALIDATE_SECONDS');

const bebas = localFont({ src: '../../fonts/bebas-neue-400.woff2', weight: '400', variable: '--font-bebas', display: 'swap' });

export const metadata: Metadata = {
  title: { absolute: T.metaTitle },
  description: T.sub,
  openGraph: { title: T.metaTitle, description: T.sub, url: 'https://zik4u.com/bertrand' },
  twitter: { title: T.metaTitle, description: T.sub },
  alternates: { canonical: 'https://zik4u.com/bertrand' },
};

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Creator Terms', href: '/legal/creator-terms' },
  { label: 'Legal notice', href: '/legal/notice' },
  { label: 'Delete account', href: '/delete-account' },
];

export default async function FounderPage() {
  if (!founderGalaxyEnabled()) notFound();
  const [galaxy, card] = await Promise.all([getFounderGalaxy(), getFounderCard()]);
  const liveGalaxy = galaxy && galaxy.tracks.length > 0 ? galaxy : null;
  const archetypeLabel = card?.archetype && card.archetype !== 'emerging' ? ARCHETYPE_LABELS[card.archetype] ?? null : null;
  const g = T.galaxyTouch;

  return (
    <main className={`${home.root} ${bebas.variable}`} data-testid="founder-page">
      <div className={`${home.wrap} ${styles.page}`}>
        <header className={home.top}>
          <Link href="/" className={home.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zik4u-logo.svg" alt="" width={28} height={28} />
            Zik4U
          </Link>
          <nav className={home.nav}>
            {HOME_TEXTS.doors.map((d) => <Link key={d.href} href={d.href}>{d.label}</Link>)}
          </nav>
        </header>

        <section className={styles.intro}>
          <div className={home.label}>{T.label}</div>
          <h1 className={home.title}>
            <span>{T.titleTop}</span>
            <span className={home.cyan}>{T.titleBottom}</span>
          </h1>
          <p className={home.sub}>{T.sub}</p>
        </section>

        <section className={styles.sec} data-testid="founder-galaxy-section">
          <div className={home.label}>{T.galaxyLabel}</div>
          <h2 className={home.h2}>{liveGalaxy ? galaxyTitle(liveGalaxy.listens) : T.galaxyFallbackTitle}</h2>
          {liveGalaxy && (
            <p className={styles.ex}>
              {g.before}<b>{g.sun}</b>{g.middle}<b>{g.planet}</b>
              <span className={home.subTouch}>{g.after}</span>
              <span className={home.subPointer}>{T.galaxyPointerEnd}</span>
            </p>
          )}
          <div className={styles.sky}><FounderSky galaxy={liveGalaxy} /></div>
        </section>

        {card && (
          <section className={styles.sec} data-testid="founder-dna-section">
            <div className={home.label}>{T.dnaLabel}</div>
            <h2 className={home.h2}>{archetypeLabel ? dnaTitle(archetypeLabel) : T.dnaFallbackTitle}</h2>
            <p className={styles.ex}>
              {archetypeLabel && <>{T.dnaArchetype.before}<b>{T.dnaArchetype.word}</b>{T.dnaArchetype.after}</>}
              {card.fingerprint && <>{T.dnaRecord.before}<b>{T.dnaRecord.word}</b>{T.dnaRecord.after}</>}
            </p>
            <MusicDnaCard card={card} footerUrl={T.cardFooter} />
          </section>
        )}

        <section className={styles.sec}>
          <div className={home.label}>{T.yoursLabel}</div>
          <h2 className={home.h2}>{T.yoursTitle}</h2>
          <WaitlistForm defaultRole="listener" />
        </section>

        <footer className={home.footer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/zik4u-logo.svg" alt="Zik4U" width={22} height={22} className={home.footerLogo} />
          <span>{HOME_TEXTS.footerNote}</span>
          {FOOTER_LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </footer>
      </div>
    </main>
  );
}
