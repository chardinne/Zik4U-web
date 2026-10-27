import localFont from 'next/font/local';
import Link from 'next/link';
import { getFounderGalaxy, FOUNDER_REVALIDATE_SECONDS } from '@/lib/founderGalaxy';
import { HOME_TEXTS } from '@/lib/homeTexts';
import { HomeHero } from '@/components/home/HomeHero';
import styles from '@/components/home/home.module.css';

// SITE1-2 — home page M2 (Decisions 174 = A, 175 = M2, 176 = A, 177 = B of 26/10/2026):
// the founder's live galaxy, Kant, one waitlist form, why it's different, three ways in.
// No store button, no demo profile. Rebuilt every 15 minutes (ISR).
export const revalidate = 900;
if (FOUNDER_REVALIDATE_SECONDS !== revalidate) throw new Error('revalidate must match FOUNDER_REVALIDATE_SECONDS');

const bebas = localFont({ src: '../fonts/bebas-neue-400.woff2', weight: '400', variable: '--font-bebas', display: 'swap' });

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Creator Terms', href: '/legal/creator-terms' },
  { label: 'Legal notice', href: '/legal/notice' },
  { label: 'Delete account', href: '/delete-account' },
];

export default async function Home() {
  const galaxy = await getFounderGalaxy();
  return (
    <main className={`${styles.root} ${bebas.variable}`}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <Link href="/" className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zik4u-logo.svg" alt="" width={28} height={28} />
            Zik4U
          </Link>
          <nav className={styles.nav}>
            {HOME_TEXTS.doors.map((d) => <Link key={d.href} href={d.href}>{d.label}</Link>)}
          </nav>
        </header>
        <HomeHero initial={galaxy} />
        <section className={styles.section}>
          <div className={styles.label}>{HOME_TEXTS.whyLabel}</div>
          <h2 className={styles.h2}>{HOME_TEXTS.whyTitle}</h2>
          <div className={styles.ideas}>
            {HOME_TEXTS.ideas.map((i) => (
              <div key={i.title} className={styles.idea}><h3>{i.title}</h3><p>{i.body}</p></div>
            ))}
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.label}>{HOME_TEXTS.doorsLabel}</div>
          <h2 className={styles.h2}>{HOME_TEXTS.doorsTitle}</h2>
          <div className={styles.doors}>
            {HOME_TEXTS.doors.map((d) => (
              <Link key={d.href} href={d.href} className={styles.door}>
                <div><small>{d.label}</small><p>{d.body}</p></div><em>→</em>
              </Link>
            ))}
          </div>
        </section>
        <footer className={styles.footer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/zik4u-logo.svg" alt="Zik4U" width={22} height={22} className={styles.footerLogo} />
          <span>{HOME_TEXTS.footerNote}</span>
          {FOOTER_LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </footer>
      </div>
    </main>
  );
}
