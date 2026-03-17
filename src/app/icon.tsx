import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #00D4FF, #00FFB2, #FF3CAC)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 900,
          color: '#0A0A1A',
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        Z4
      </div>
    ),
    { ...size }
  );
}
