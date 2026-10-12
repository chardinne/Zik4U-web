import type { PublicProfile } from '@/lib/publicProfile';

// WEB-PRIV1 — link-preview image of the minimal card (D3): name and @handle only.
// No listening data, archetype or rarity. Rendered by /card/[username]/preview for every
// link without a valid share key (unchanged from the former opengraph-image.tsx).

export function fit(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
}

export function MinimalPreview({ profile }: { profile: PublicProfile | null }) {
  return (
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
  );
}
