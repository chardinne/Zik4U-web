import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getPublicProfile } from '@/lib/publicProfile';

// WEB-PRIV1 — link-preview image of the minimal card (D3): name and @handle only.
// No listening data, archetype or rarity. The full shared card arrives with SHARE-KEY1.

export const runtime = 'nodejs';
export const alt = 'Zik4U profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function fit(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const inter400 = readFileSync(join(process.cwd(), 'src/fonts/inter-400.ttf'));
  const inter700 = readFileSync(join(process.cwd(), 'src/fonts/inter-700.ttf'));
  const fonts = [
    { name: 'Inter', data: inter400, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: inter700, weight: 700 as const, style: 'normal' as const },
  ];

  const profile = await getPublicProfile(username);

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '1200px', height: '630px', position: 'relative', padding: '0 80px', background: 'radial-gradient(ellipse at 70% 28%, #211546 0%, #0d0a22 55%, #060410 100%)', fontFamily: 'Inter' }}>
        <div style={{ display: 'flex', position: 'absolute', top: 36, left: 48, fontSize: 24, fontWeight: 700, letterSpacing: 5, color: '#8a8ab0' }}>ZIK4U</div>
        {profile ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 74, fontWeight: 700, letterSpacing: -1, lineHeight: 1, color: '#f0f0fa' }}>{fit(profile.displayName, 24)}</div>
            <div style={{ display: 'flex', fontSize: 30, color: '#c3c3de', marginTop: 16 }}>{`@${fit(profile.username, 30)}`}</div>
            <div style={{ display: 'flex', fontSize: 22, color: '#8585a6', marginTop: 38 }}>The social network built on real listens.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: 6 }}>ZIK4U</div>
        )}
      </div>
    ),
    { ...size, fonts }
  );
}
