import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createServiceClient } from '@/lib/supabase-server';
import { ARCHETYPE_LABELS, ARCHETYPE_VISUAL_PROFILE, DEFAULT_ARCHETYPE_PROFILE, RARITY_THRESHOLDS, toRarity } from '@/lib/cosmicCard';

export const runtime = 'nodejs';
export const alt = 'Music DNA on Zik4U';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function fitLine(title: string, artist: string): string {
  const LINE_MAX = 38;
  const sep = ' — ';
  const a = artist.length > 20 ? artist.slice(0, 19).trimEnd() + '…' : artist;
  const budget = LINE_MAX - sep.length - a.length;
  const t = title.length > budget ? title.slice(0, Math.max(6, budget - 1)).trimEnd() + '…' : title;
  return `${t}${sep}${a}`;
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const handle = username.replace(/^@/, '');
  const sc = createServiceClient();
  const inter400 = readFileSync(join(process.cwd(), 'src/fonts/inter-400.ttf'));
  const inter700 = readFileSync(join(process.cwd(), 'src/fonts/inter-700.ttf'));
  const fonts = [
    { name: 'Inter', data: inter400, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: inter700, weight: 700 as const, style: 'normal' as const },
  ];

  const { data: profile } = await sc.from('users').select('id, username, display_name').eq('username', handle).single();
  if (!profile) {
    return new ImageResponse(
      (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A1A', color: '#fff', fontFamily: 'Inter', fontSize: 48, fontWeight: 700, letterSpacing: 6 }}>ZIK4U</div>),
      { ...size, fonts }
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: archetypeRow }, { data: distRaw }, { data: lastRaw }, { data: recentRaw }] = await Promise.all([
    sc.from('listener_archetypes').select('archetype').eq('user_id', profile.id).maybeSingle(),
    sc.rpc('get_archetype_distribution'),
    sc.from('scrobbles').select('track_title, artist_name').eq('user_id', profile.id).eq('is_private', false).order('played_at', { ascending: false }).limit(1),
    sc.from('scrobbles').select('track_title, artist_name').eq('user_id', profile.id).eq('is_private', false).neq('source', 'youtube').gte('played_at', sevenDaysAgo).order('played_at', { ascending: false }).limit(200),
  ]);

  const archetype = (archetypeRow as { archetype: string } | null)?.archetype ?? null;
  const vp = archetype && ARCHETYPE_VISUAL_PROFILE[archetype] ? ARCHETYPE_VISUAL_PROFILE[archetype] : DEFAULT_ARCHETYPE_PROFILE;
  const primary = vp.primary, secondary = vp.secondary;
  const archetypeLabel = (archetype && ARCHETYPE_LABELS[archetype]) || 'Emerging';
  const distribution = (distRaw as { archetype: string; percentage: number }[] | null) ?? [];
  const rarityPct = distribution.find((d) => d.archetype === archetype)?.percentage ?? 100;
  const rarity = toRarity(rarityPct);
  const showBadge = rarity !== 'common';
  const last = (lastRaw as { track_title: string; artist_name: string }[] | null)?.[0] ?? null;

  const counts = new Map<string, { title: string; artist: string; n: number }>();
  for (const s of (recentRaw as { track_title: string; artist_name: string }[] | null) ?? []) {
    const key = `${s.track_title.toLowerCase().trim()}|||${s.artist_name.toLowerCase().trim()}`;
    const e = counts.get(key);
    if (e) { e.n++; } else { counts.set(key, { title: s.track_title, artist: s.artist_name, n: 1 }); }
  }
  const onRepeat = [...counts.values()].sort((a, b) => b.n - a.n)[0] ?? null;

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '1200px', height: '630px', position: 'relative', background: 'radial-gradient(ellipse at 70% 28%, #211546 0%, #0d0a22 55%, #060410 100%)', fontFamily: 'Inter', overflow: 'hidden' }}>
        <div style={{ display: 'flex', position: 'absolute', top: 36, left: 48, fontSize: 24, fontWeight: 700, letterSpacing: 5, color: '#8a8ab0' }}>ZIK4U</div>
        {showBadge && (
          <div style={{ display: 'flex', position: 'absolute', top: 34, right: 44, fontSize: 18, fontWeight: 700, color: RARITY_THRESHOLDS[rarity].color, border: `2px solid ${hexToRgba(RARITY_THRESHOLDS[rarity].color, 0.5)}`, background: hexToRgba(RARITY_THRESHOLDS[rarity].color, 0.1), padding: '8px 20px', borderRadius: 999 }}>{`Top ${rarityPct.toFixed(1)}% · ${RARITY_THRESHOLDS[rarity].label}`}</div>
        )}
        <div style={{ display: 'flex', position: 'absolute', left: 690, top: 99, width: 520, height: 520, borderRadius: 9999, background: `radial-gradient(circle, ${hexToRgba(primary, 0.45)} 0%, transparent 60%)` }} />
        <div style={{ display: 'flex', position: 'absolute', left: 820, top: 229, width: 260, height: 260, borderRadius: 9999, background: `radial-gradient(circle at 42% 36%, #ffffff 0%, ${primary} 52%, #1a0a12 100%)` }} />
        {onRepeat && (
          <div style={{ display: 'flex', position: 'absolute', left: 930, top: 50, width: 236, height: 236, borderRadius: 9999, background: `radial-gradient(circle, ${hexToRgba(secondary, 0.4)} 0%, transparent 60%)` }} />
        )}
        {onRepeat && (
          <div style={{ display: 'flex', position: 'absolute', left: 1000, top: 120, width: 96, height: 96, borderRadius: 9999, background: `radial-gradient(circle at 42% 36%, #ffffff 0%, ${secondary} 60%, #120a26 100%)` }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 80, top: 200, width: 560 }}>
          <div style={{ display: 'flex', fontSize: 74, fontWeight: 700, letterSpacing: -1, lineHeight: 1, background: `linear-gradient(90deg, ${primary}, ${secondary})`, backgroundClip: 'text', color: 'transparent' }}>{archetypeLabel}</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#c3c3de', marginTop: 16 }}>{`@${profile.username}`}</div>
          {last && (<div style={{ display: 'flex', fontSize: 18, color: '#8585a6', letterSpacing: 2, marginTop: 38 }}>LAST PLAYED</div>)}
          {last && (<div style={{ display: 'flex', fontSize: 26, color: '#f0f0fa', fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap' }}>{fitLine(last.track_title, last.artist_name)}</div>)}
          {onRepeat && (<div style={{ display: 'flex', fontSize: 18, color: '#8585a6', letterSpacing: 2, marginTop: 18 }}>ON REPEAT</div>)}
          {onRepeat && (<div style={{ display: 'flex', fontSize: 26, color: '#f0f0fa', fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap' }}>{fitLine(onRepeat.title, onRepeat.artist)}</div>)}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
