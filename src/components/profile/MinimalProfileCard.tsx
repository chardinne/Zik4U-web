import type { Metadata } from 'next';
import type { PublicProfile } from '@/lib/publicProfile';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';

// WEB-PRIV1 — minimal public profile (D3): display name, avatar, bio. Nothing else.
// Listening data, archetype, signature and tiers are intentionally absent.

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export function profileMetadata(profile: PublicProfile | null): Metadata {
  if (!profile) {
    return { title: 'Profile not found', robots: { index: false, follow: false } };
  }
  const title = `${profile.displayName} (@${profile.username})`;
  const description = `@${profile.username} on Zik4U, the social network built on real listens.`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/card/${encodeURIComponent(profile.username)}` },
    robots: profile.isPrivate ? { index: false, follow: false } : undefined,
    openGraph: { title, description, type: 'profile' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function MinimalProfileCard({ profile }: { profile: PublicProfile }) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A1A', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 48px' }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '2px', color: '#A78BFA', fontWeight: 600 }}>ZIK4U</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 28, textAlign: 'center' }}>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              width={96}
              height={96}
              style={{ borderRadius: '50%', border: '2px solid rgba(0,212,255,0.4)', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #FF3CAC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
              🎵
            </div>
          )}
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 34, color: '#fff', letterSpacing: '0.05em', lineHeight: 1, margin: 0 }}>
            {profile.displayName}
          </h1>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#00D4FF', fontWeight: 600 }}>@{profile.username}</span>
        </div>

        {profile.bio && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', color: '#8888BB' }}>BIO</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{profile.bio}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
            Listen to what {profile.displayName} hears
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Real music. Real identity. For real.
          </p>
          {/* SITE1-5 (Decision 183 = A): the waitlist instead of store buttons until the store listings exist. */}
          <WaitlistForm defaultRole="listener" />
        </div>
      </div>
    </main>
  );
}
