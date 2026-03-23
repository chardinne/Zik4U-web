'use client';
import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('zik4u_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('zik4u_cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('zik4u_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(10,10,26,0.97)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(0,212,255,0.2)',
      padding: '20px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap' as const,
      gap: 16,
    }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <p style={{
          margin: 0,
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.5,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          🍪 We use essential cookies for authentication only. No advertising or tracking cookies.{' '}
          <a href="/legal/privacy#cookies" style={{ color: '#00D4FF', textDecoration: 'none' }}>
            Learn more
          </a>
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '8px 16px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Essential only
        </button>
        <button
          onClick={accept}
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            color: '#0A0A1A',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
