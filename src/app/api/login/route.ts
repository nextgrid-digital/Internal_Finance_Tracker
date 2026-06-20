import { NextResponse } from 'next/server';
import { AUTH_COOKIE, deriveToken, getAppPassword } from '@/lib/auth';

function safePath(value: FormDataEntryValue | null): string {
  const path = typeof value === 'string' ? value : '';
  return path.startsWith('/') && !path.startsWith('//') ? path : '/dashboard/finance';
}

export async function POST(req: Request) {
  const form = await req.formData();
  const submitted =
    typeof form.get('password') === 'string' ? (form.get('password') as string) : '';
  const from = safePath(form.get('from'));
  const password = getAppPassword();

  if (!password || submitted !== password) {
    const url = new URL('/login', req.url);
    url.searchParams.set('error', '1');
    if (from !== '/dashboard/finance') url.searchParams.set('from', from);
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await deriveToken(password);
  const res = NextResponse.redirect(new URL(from, req.url), { status: 303 });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}
