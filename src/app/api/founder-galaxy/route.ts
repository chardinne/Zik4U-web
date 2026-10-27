import { getFounderGalaxy } from '@/lib/founderGalaxy';

// SITE1-2 — fresh copy of the founder's galaxy for a visitor who landed on an older page
// (Decision 174 = A: the founder's own account only; null when the switch is off or on error).
export const dynamic = 'force-dynamic';

export async function GET() {
  const galaxy = await getFounderGalaxy();
  return Response.json(galaxy, {
    status: galaxy ? 200 : 404,
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' },
  });
}
