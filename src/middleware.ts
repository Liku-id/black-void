import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Initial
  const pathname = req.nextUrl.pathname;
  const accessToken = req.cookies.get('access_token')?.value;
  const user_role = req.cookies.get('user_role')?.value;

  // Routes restricted when logged in
  const notAllowWhenLogin = [
    '/login',
    '/change-password',
    '/reset-password',
    '/register',
  ];

  // Routes restricted when not logged in
  const guardWhenNotLogin = ['/my-tickets'];

  // Routes restricted when role is not authorized
  const guardWhenNotAuthorized = ['/ticket/scanner'];

  // Validation
  const isRestrictedWhenLoggedIn = notAllowWhenLogin.includes(pathname);
  const isRestrictedWhenNotLoggedIn = guardWhenNotLogin.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect logged-in users away from login-related pages
  if (accessToken && isRestrictedWhenLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect non-logged-in users away from protected pages
  if (!accessToken && isRestrictedWhenNotLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect users with unauthorized roles away from specific pages
  if( accessToken && user_role !== 'scanner' && guardWhenNotAuthorized.includes(pathname)) {
    return NextResponse.redirect(new URL('/ticket/auth', req.url));
  }

  if (accessToken) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}
