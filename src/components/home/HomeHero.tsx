'use client';

// SITE1-2 — hero of the home page (M2): the founder's live galaxy, Kant, the title, the waitlist
// form, the LIVE PROFILE band. The page is rebuilt every 15 minutes (ISR); a visitor who lands on
// an older copy gets fresh data from /api/founder-galaxy (no stale "Last redrawn 3 h ago").

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FounderGalaxy } from '@/lib/founderGalaxy';
import { FOUNDER_REVALIDATE_SECONDS } from '@/lib/founderGalaxy';
import { HOME_TEXTS, artistsLabel, lastRedrawnLabel, listensNumber } from '@/lib/homeTexts';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { FounderSky } from './FounderSky';
import styles from './home.module.css';
import { useNow } from './useNow';

const STALE_MS = (FOUNDER_REVALIDATE_SECONDS + 60) * 1000;

export function HomeHero({ initial }: { initial: FounderGalaxy | null }) {
  const [galaxy, setGalaxy] = useState(initial);
  const now = useNow();

  useEffect(() => {
    if (initial && Date.now() - new Date(initial.fetchedAt).getTime() > STALE_MS) {
      fetch('/api/founder-galaxy', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((g: FounderGalaxy | null) => { if (g && g.tracks?.length) setGalaxy(g); })
        .catch(() => {});
    }
  }, [initial]);

  const liveData = galaxy && galaxy.tracks.length > 0 ? galaxy : null;

  return (
    <div className={styles.hero}>
      <FounderSky galaxy={liveData} />
      <div className={styles.copy}>
        <figure className={styles.kant}>
          <blockquote>{HOME_TEXTS.kantQuote}</blockquote>
          <figcaption>{HOME_TEXTS.kantSource}</figcaption>
        </figure>
        <h1 className={styles.title}>
          <span>{HOME_TEXTS.titleTop}</span>
          <span className={styles.cyan}>{HOME_TEXTS.titleBottom}</span>
        </h1>
        {liveData && (
          <p className={styles.sub}>
            <span className={styles.subTouch}>{HOME_TEXTS.subTouch}</span>
            <span className={styles.subPointer}>{HOME_TEXTS.subPointer}</span>
          </p>
        )}
        {!liveData && <div style={{ height: 16 }} />}
        <WaitlistForm defaultRole="listener" />
        {liveData ? (
          <>
          <div className={styles.band} data-testid="live-band">
            <div className={styles.pulse}><i />{HOME_TEXTS.bandLabel}</div>
            <p>
              <b>{HOME_TEXTS.bandLead}</b> {HOME_TEXTS.bandListensBefore}{' '}
              <strong>{listensNumber(liveData.listens)} {HOME_TEXTS.bandListensAfter}</strong>. {HOME_TEXTS.bandRest}
            </p>
            <div className={styles.meta}>
              {now !== null && <span>{lastRedrawnLabel(liveData.fetchedAt, now)}</span>}
              {liveData.artists !== null && <span>{artistsLabel(liveData.artists)}</span>}
              {liveData.archetypeLabel && <span>{liveData.archetypeLabel}</span>}
            </div>
          </div>
          {/* SITE2 (Decision 188 = V2): the founder's full page. */}
          <Link href="/bertrand" className={styles.dnaLink} data-testid="founder-page-link">
            {HOME_TEXTS.founderPageLink}<span aria-hidden="true">→</span>
          </Link>
          </>
        ) : (
          <p className={styles.caption} data-testid="fallback-caption">{HOME_TEXTS.fallbackCaption}</p>
        )}
      </div>
    </div>
  );
}
