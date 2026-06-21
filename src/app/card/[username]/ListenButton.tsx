'use client';

import { useState } from 'react';

interface Props {
  artist: string;
  title?: string;
  variant: 'sun' | 'row';
  children?: React.ReactNode;
}

function buildUrls(artist: string, title?: string) {
  const q = encodeURIComponent(title ? `${artist} ${title}`.trim() : artist);
  return {
    spotify: `https://open.spotify.com/search/${q}`,
    appleMusic: `https://music.apple.com/search?term=${q}`,
    youtubeMusic: `https://music.youtube.com/search?q=${q}`,
  };
}

const PILL: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.8)',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 999,
  padding: '6px 14px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

export function ListenButton({ artist, title, variant, children }: Props) {
  const [open, setOpen] = useState(false);
  const urls = buildUrls(artist, title);

  const pills = (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: variant === 'sun' ? 'center' : 'flex-end' }}>
      <a href={urls.spotify} target="_blank" rel="noopener noreferrer" style={PILL}>Spotify</a>
      <a href={urls.appleMusic} target="_blank" rel="noopener noreferrer" style={PILL}>Apple Music</a>
      <a href={urls.youtubeMusic} target="_blank" rel="noopener noreferrer" style={PILL}>YT Music</a>
    </div>
  );

  if (variant === 'sun') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close listen options' : 'Listen on a platform'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}
        >
          {children}
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8888BB', letterSpacing: '1px' }}>
            {open ? '▲ close' : '▶ LISTEN'}
          </span>
        </button>
        {open && pills}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close listen options' : 'Listen on a platform'}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)',
          background: open ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)',
          color: open ? '#00D4FF' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          flexShrink: 0,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        ▶
      </button>
      {open && pills}
    </div>
  );
}
