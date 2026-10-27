'use client';

// SITE1-1 — the single waitlist form of the site (Decisions 171, 176, 178 of 26/10/2026).
// Texts come from WAITLIST_TEXTS (validated word for word). No streaming platform is asked.

import { useState } from 'react';
import Link from 'next/link';
import { WAITLIST_ROLES, WAITLIST_TEXTS, ARTIST_NAME_MAX, type WaitlistRole } from '@/lib/waitlist';

const S = {
  night: '#0B0918',
  panel: 'rgba(18,14,36,0.78)',
  line: 'rgba(155,123,255,0.22)',
  violet: '#9B7BFF',
  text: '#F2F0FF',
  muted: 'rgba(242,240,255,0.62)',
  faint: 'rgba(242,240,255,0.38)',
} as const;

const input: React.CSSProperties = {
  flex: 1, minWidth: 0, height: 46, borderRadius: 12, background: S.night,
  border: '1px solid rgba(242,240,255,0.14)', padding: '0 14px', color: S.text,
  fontSize: 15, fontFamily: 'inherit', outline: 'none',
};

export function WaitlistForm({ defaultRole = 'listener' }: { defaultRole?: WaitlistRole }) {
  const [role, setRole] = useState<WaitlistRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [artistName, setArtistName] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const ready = email.trim() !== '' && (role !== 'creator' || artistName.trim() !== '');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, artist_name: role === 'creator' ? artistName : undefined, website }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div data-testid="waitlist-done" role="status" style={{ background: 'rgba(46,229,157,0.08)', border: '1px solid rgba(46,229,157,0.35)', borderRadius: 18, padding: 18, textAlign: 'left' }}>
        <b style={{ display: 'block', fontSize: 18, marginBottom: 6, color: S.text }}>{WAITLIST_TEXTS.successTitle}</b>
        <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.5, margin: 0 }}>{WAITLIST_TEXTS.successBody}</p>
      </div>
    );
  }

  return (
    <form id="waitlist" data-testid="waitlist-form" onSubmit={submit} style={{ background: S.panel, border: `1px solid ${S.line}`, borderRadius: 18, padding: 16, textAlign: 'left', width: '100%', maxWidth: 520 }}>
      <div role="radiogroup" style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {WAITLIST_ROLES.map((r) => (
          <button key={r} type="button" role="radio" aria-checked={role === r} onClick={() => setRole(r)}
            style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              border: `1px solid ${role === r ? S.violet : S.line}`, background: role === r ? S.violet : 'transparent', color: role === r ? '#120E24' : S.muted }}>
            {WAITLIST_TEXTS.roles[r]}
          </button>
        ))}
      </div>
      {role === 'creator' && (
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <input aria-label={WAITLIST_TEXTS.artistPlaceholder} placeholder={WAITLIST_TEXTS.artistPlaceholder} value={artistName}
            maxLength={ARTIST_NAME_MAX} onChange={(e) => setArtistName(e.target.value)} style={input} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input type="email" required aria-label={WAITLIST_TEXTS.emailPlaceholder} placeholder={WAITLIST_TEXTS.emailPlaceholder} value={email}
          onChange={(e) => setEmail(e.target.value)} style={{ ...input, minWidth: 120 }} />
        <button type="submit" disabled={!ready || state === 'sending'}
          style={{ flex: 'none', height: 46, padding: '0 14px', borderRadius: 12, border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg,#9B7BFF,#5EEBFF)', color: S.night, cursor: ready ? 'pointer' : 'not-allowed', opacity: ready ? 1 : 0.6 }}>
          {WAITLIST_TEXTS.button}
        </button>
      </div>
      {/* Honeypot: hidden from people, filled by bots only. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)}
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }} />
      {state === 'error' && (
        <p role="alert" data-testid="waitlist-error" style={{ fontSize: 13, color: '#FF8FB8', margin: '10px 0 0' }}>{WAITLIST_TEXTS.error}</p>
      )}
      <p style={{ fontSize: 11.5, color: S.faint, margin: '10px 0 0', lineHeight: 1.45 }}>
        {WAITLIST_TEXTS.fine}{' '}
        <Link href="/legal/privacy" style={{ color: S.muted, textDecoration: 'underline' }}>{WAITLIST_TEXTS.privacyLink}</Link>
      </p>
    </form>
  );
}

/** A second call to action on the same page: scrolls to the page's single form (#waitlist). */
export function WaitlistLink() {
  return (
    <a href="#waitlist" data-testid="waitlist-link"
      style={{ display: 'inline-flex', alignItems: 'center', height: 46, padding: '0 22px', borderRadius: 12, fontWeight: 700, fontSize: 15,
        textDecoration: 'none', background: 'linear-gradient(135deg,#9B7BFF,#5EEBFF)', color: S.night }}>
      {WAITLIST_TEXTS.button}
    </a>
  );
}
