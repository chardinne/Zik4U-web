import type { ReactNode } from 'react';
import Link from 'next/link';

// COMPLY1c — shared frame of the legal pages (Privacy Policy, Terms of Service,
// Delete your account, Legal notice). Texts validated by Bertrand on 16/10/2026
// (claude/COMPLY1c-TEXTES.md v2.1); guarded by src/__tests__/comply1c-site.test.ts.

const LINK = { color: '#00D4FF', textDecoration: 'none' } as const;

// COMPLY1e (Decision 103 = A, 19/10/2026) — the legal pages also exist in French
// (/fr/...), with a language link on each page. Labels validated with the French texts
// (claude/COMPLY1e-TEXTES-FR.md).
export type LegalLang = 'en' | 'fr';
const LABELS = {
  en: {
    lastUpdated: 'Last updated: ',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    delete: 'Delete your account',
    notice: 'Legal notice',
    home: 'Home',
    rights: 'All rights reserved.',
    switchTo: 'Français',
    prefix: '',
  },
  fr: {
    lastUpdated: 'Dernière mise à jour : ',
    privacy: 'Politique de confidentialité',
    terms: "Conditions générales d'utilisation",
    delete: 'Supprimer votre compte',
    notice: 'Mentions légales',
    home: 'Accueil',
    rights: 'Tous droits réservés.',
    switchTo: 'English',
    prefix: '/fr',
  },
} as const;
export const FR_EQUAL_VALUE = 'Les versions française et anglaise ont la même valeur.';

export function LegalPage({
  crumb,
  title,
  lastUpdated,
  current,
  lang = 'en',
  altHref,
  children,
}: {
  crumb: string;
  title: string;
  lastUpdated?: string;
  current: 'privacy' | 'terms' | 'delete' | 'notice';
  lang?: LegalLang;
  altHref?: string;
  children: ReactNode;
}) {
  const L = LABELS[lang];
  const footerLink = (key: typeof current, href: string, label: string) => (
    <Link
      href={href}
      style={{
        color: current === key ? '#00D4FF' : 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: '14px',
      }}
    >
      {label}
    </Link>
  );
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A1A', color: 'rgba(255,255,255,0.8)' }}>
      <header
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Link
          href="/"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900,
            fontSize: '22px',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          ZIK4U
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>/ {crumb}</span>
        {altHref && (
          <Link
            href={altHref}
            hrefLang={lang === 'en' ? 'fr' : 'en'}
            data-testid="legal-lang-switch"
            style={{ marginLeft: 'auto', color: '#00D4FF', textDecoration: 'none', fontSize: '14px' }}
          >
            {L.switchTo}
          </Link>
        )}
      </header>
      <main lang={lang} style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 80px', lineHeight: 1.7, fontSize: '15px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px', color: '#FFFFFF' }}>{title}</h1>
        {lastUpdated && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '40px' }}>
            {L.lastUpdated}
            {lastUpdated}
          </p>
        )}
        {lang === 'fr' && (
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginBottom: '32px' }}>{FR_EQUAL_VALUE}</p>
        )}
        {children}
      </main>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {footerLink('privacy', `${L.prefix}/legal/privacy`, L.privacy)}
          {footerLink('terms', `${L.prefix}/legal/terms`, L.terms)}
          {footerLink('delete', `${L.prefix}/delete-account`, L.delete)}
          {footerLink('notice', `${L.prefix}/legal/notice`, L.notice)}
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>
            {L.home}
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '12px' }}>
          © {new Date().getFullYear()} Zik4U. {L.rights}
        </p>
      </footer>
    </div>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: '40px', scrollMarginTop: '24px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>{title}</h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ marginBottom: '12px' }}>{children}</p>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong style={{ color: '#FFFFFF' }}>{children}</strong>;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul style={{ paddingLeft: '20px', margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

// Rows rendered as cards (first cell as title, the others labelled by their column): a
// three-column table does not fit a phone, the site being zoomed by 1.25.
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#12122A',
            borderRadius: '12px',
            padding: '14px 18px',
            borderLeft: '3px solid #00D4FF',
            fontSize: '14px',
          }}
        >
          <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>{r[0]}</p>
          {r.slice(1).map((c, j) => (
            <p key={j} style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>{head[j + 1]}: </span>
              {c}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Mail({ to }: { to: string }) {
  return (
    <a href={`mailto:${to}`} style={LINK}>
      {to}
    </a>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  if (!href.startsWith('http')) {
    return (
      <Link href={href} style={LINK}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} style={LINK} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
