import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getPublicProfile } from '@/lib/publicProfile';
import { getSharedCard, isShareKey } from '@/lib/sharedCard';
import { MinimalPreview } from '@/components/profile/MinimalPreview';
import { SillonPreview } from '@/components/profile/SillonPreview';

// Link-preview image of /card/<username> (and /@<username>), 1200 × 630.
// WEB-PRIV1 (D3): without a key, or with a wrong or revoked one, the MINIMAL preview.
// DNA-SILLON decision 46 = A: with the owner's live key (?k=, checked by getSharedCard),
// the record, the archetype and the real listens. Never cached when a key is present.

export const runtime = 'nodejs';

const SIZE = { width: 1200, height: 630 };

function fonts() {
  const read = (f: string) => readFileSync(join(process.cwd(), 'src/fonts', f));
  return [
    { name: 'Inter', data: read('inter-400.ttf'), weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: read('inter-700.ttf'), weight: 700 as const, style: 'normal' as const },
    { name: 'Bebas', data: read('bebas-neue-400.ttf'), weight: 400 as const, style: 'normal' as const },
  ];
}

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const key = new URL(request.url).searchParams.get('k');

  if (isShareKey(key)) {
    const card = await getSharedCard(username, key);
    if (card && card.fingerprint) {
      return new ImageResponse(<SillonPreview card={{ ...card, fingerprint: card.fingerprint }} />, {
        ...SIZE,
        fonts: fonts(),
        headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' },
      });
    }
  }

  const profile = await getPublicProfile(username);
  return new ImageResponse(<MinimalPreview profile={profile} />, { ...SIZE, fonts: fonts() });
}
