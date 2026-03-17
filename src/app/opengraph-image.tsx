import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Zik4U — Your Music. Your Identity.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A1A',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Background circles décoratifs */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{
          fontSize: 56,
          fontWeight: 900,
          letterSpacing: '0.2em',
          background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: 32,
          display: 'flex',
        }}>
          ZIK4U
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 800,
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          Your Music.
          <span style={{
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'flex',
          }}>
            Your Identity.
          </span>
        </div>

        {/* Sous-titre */}
        <div style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.45)',
          textAlign: 'center',
          display: 'flex',
        }}>
          The social network built on what you actually listen to.
        </div>

        {/* Badge */}
        <div style={{
          marginTop: 48,
          padding: '10px 28px',
          borderRadius: 999,
          border: '1px solid rgba(0,212,255,0.3)',
          background: 'rgba(0,212,255,0.08)',
          fontSize: 14,
          fontWeight: 700,
          color: '#00D4FF',
          letterSpacing: '0.1em',
          display: 'flex',
        }}>
          EARLY ACCESS — JOIN NOW
        </div>
      </div>
    ),
    { ...size }
  );
}
