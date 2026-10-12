'use client';

import { useState } from 'react';

// Listen buttons — search by name, platform-agnostic, zero third-party music API.
// DNA-SILLON site (decision 44 = A): like the app's ListenPlay, the whole line is the
// button (LAST PLAYED / ON REPEAT pill, A-side row) and the platforms open UNDER it.

interface Props {
  artist: string;
  title?: string;
  variant: 'pill' | 'row';
  children: React.ReactNode;
}

export function listenSearchUrls(artist: string, title?: string) {
  const q = encodeURIComponent(title ? `${artist} ${title}`.trim() : artist);
  return {
    spotify: `https://open.spotify.com/search/${q}`,
    appleMusic: `https://music.apple.com/search?term=${q}`,
    youtubeMusic: `https://music.youtube.com/search?q=${q}`,
  };
}

const PLATFORM: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.85)',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 999,
  padding: '6px 14px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export function ListenButton({ artist, title, variant, children }: Props) {
  const [open, setOpen] = useState(false);
  const urls = listenSearchUrls(artist, title);
  const label = `${open ? 'Close listen options for' : 'Listen to'} ${title ? `${title} by ` : ''}${artist}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: variant === 'pill' ? 12 : 8,
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
          color: '#F0F0FF',
          font: 'inherit',
          ...(variant === 'pill'
            ? { padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: `1px solid ${open ? '#9B7BFF' : 'rgba(155,123,255,0.2)'}` }
            : { padding: 0, background: 'none', border: 'none' }),
        }}
      >
        {children}
        <span
          aria-hidden="true"
          style={{
            width: variant === 'pill' ? 30 : 24,
            height: variant === 'pill' ? 30 : 24,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: variant === 'pill' ? 10 : 9,
            flexShrink: 0,
            color: open ? '#9B7BFF' : '#F0F0FF',
          }}
        >
          ▶
        </span>
      </button>
      {open && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={urls.spotify} target="_blank" rel="noopener noreferrer" style={PLATFORM}>Spotify</a>
          <a href={urls.appleMusic} target="_blank" rel="noopener noreferrer" style={PLATFORM}>Apple Music</a>
          <a href={urls.youtubeMusic} target="_blank" rel="noopener noreferrer" style={PLATFORM}>YT Music</a>
        </div>
      )}
    </div>
  );
}
