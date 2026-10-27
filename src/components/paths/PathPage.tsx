import localFont from 'next/font/local';
import Link from 'next/link';
import { PATH_TEXTS, type PathKey } from '@/lib/pathTexts';
import { HOME_TEXTS } from '@/lib/homeTexts';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import home from '@/components/home/home.module.css';
import styles from './paths.module.css';

// SITE1-3 — short path page (Decisions 182 = A and 184 = A of 27/10/2026): who it is for, the
// waitlist form with the right profile picked, then only what exists in the app.

const bebas = localFont({ src: '../../fonts/bebas-neue-400.woff2', weight: '400', variable: '--font-bebas', display: 'swap' });

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Creator Terms', href: '/legal/creator-terms' },
  { label: 'Legal notice', href: '/legal/notice' },
  { label: 'Delete account', href: '/delete-account' },
];

export function PathPage({ page }: { page: PathKey }) {
  const t = PATH_TEXTS[page];
  const steps = 'steps' in t ? t.steps : null;
  const money = 'money' in t ? t.money : null;
  const toolsLabel = 'toolsLabel' in t ? t.toolsLabel : null;
  const note = 'note' in t ? t.note : null;
  const items = (
    <>
      {t.items.map((i) => (
        <div key={i.title} className={styles.item}><h3>{i.title}</h3><p>{i.body}</p></div>
      ))}
    </>
  );
  return (
    <main className={`${home.root} ${bebas.variable}`} data-testid={`path-${page}`}>
      <div className={`${home.wrap} ${styles.page}`}>
        <header className={home.top}>
          <Link href="/" className={home.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zik4u-logo.svg" alt="" width={28} height={28} />
            Zik4U
          </Link>
          <nav className={home.nav}>
            {HOME_TEXTS.doors.filter((d) => d.href !== `/${page}`).map((d) => <Link key={d.href} href={d.href}>{d.label}</Link>)}
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={home.label}>{t.label}</div>
          <h1 className={home.title}>
            <span>{t.titleTop}</span>
            <span className={home.cyan}>{t.titleBottom}</span>
          </h1>
          <p className={home.sub}>{t.sub}</p>
          <WaitlistForm defaultRole={t.role} />
        </section>

        <section className={styles.sec}>
          <div className={home.label}>{t.sectionLabel}</div>
          <h2 className={home.h2}>{t.sectionTitle}</h2>
          {steps ? (
            <>
              {steps.map((s, n) => (
                <div key={s.lead} className={styles.step}><i>{n + 1}</i><p><b>{s.lead}</b>{s.rest ? ` ${s.rest}` : ''}</p></div>
              ))}
              {money && <div className={styles.money}><strong>{money.big}</strong><p>{money.body}</p></div>}
            </>
          ) : items}
          {note && <div className={styles.note}>{note}</div>}
        </section>

        {toolsLabel && (
          <section className={styles.sec}>
            <div className={home.label}>{toolsLabel}</div>
            {items}
          </section>
        )}

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
