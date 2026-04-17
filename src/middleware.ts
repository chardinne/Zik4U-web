// CCPA/CPRA — Global Privacy Control (GPC)
// https://globalprivacycontrol.org/
// PRIVACY_COMPLIANCE.md Section 4.4
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Sec-GPC: 1 signals the user has opted out of data sale/sharing
  const gpcSignal = request.headers.get('sec-gpc');
  if (gpcSignal === '1') {
    response.cookies.set('privacy_gpc_opted_out', 'true', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });
    // Inform client components / API routes
    response.headers.set('x-gpc-signal', '1');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
