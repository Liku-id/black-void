import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Initial
  const pathname = req.nextUrl.pathname;
  const accessToken = req.cookies.get('access_token')?.value;
  const userRole = req.cookies.get('user_role')?.value;

  // Routes restricted when logged in
  const notAllowWhenLogin = [
    '/ticket/auth',
    '/login',
    '/change-password',
    '/reset-password',
    '/register',
  ];

  // Routes restricted when not logged in
  const guardWhenNotLogin = ['/my-tickets'];

  // Routes restricted when role is not authorized
  const staffAccess = ['/ticket/scanner'];

  const buyerAccess = [
    '/ticket/auth',
    '/login',
    '/change-password',
    '/reset-password',
    '/register',
    '/even',
    '/transaction',
  ];

  // Validation
  const isRestrictedWhenLoggedIn = notAllowWhenLogin.includes(pathname);
  const isRestrictedWhenNotLoggedIn = guardWhenNotLogin.some((route) =>
    pathname.startsWith(route)
  );
  const isStaffPage = staffAccess.some((route) => pathname.startsWith(route));
  const isBuyerPage = buyerAccess.some((route) => pathname.startsWith(route));

  // Redirect logged-in users away from login-related pages
  if (accessToken && isRestrictedWhenLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect non-logged-in users away from protected pages
  if (!accessToken && isRestrictedWhenNotLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect users with unauthorized roles away from specific pages
  if (userRole !== 'admin' && isStaffPage) {
    return NextResponse.redirect(new URL('/ticket/auth', req.url));
  }

  // Redirect users staff from buyer access
  if (userRole === 'admin' && isBuyerPage) {
    return NextResponse.redirect(new URL('/ticket/scanner', req.url));
  }

  if (accessToken) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}
