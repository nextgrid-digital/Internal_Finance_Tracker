import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, deriveToken, getAppPassword } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/api/login', '/api/logout'];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const password = getAppPassword();
  // Fail open when no password is configured so a misconfigured deploy never
  // locks everyone out. Set APP_PASSWORD to actually enforce the gate.
  if (!password) {
    return NextResponse.next();
  }

  const expected = await deriveToken(password);
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token && token === expected) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = pathname && pathname !== '/' ? `?from=${encodeURIComponent(pathname)}` : '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
