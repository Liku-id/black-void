import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  const accessToken = req.cookies.get('access_token')?.value;
  const userRole = req.cookies.get('user_role')?.value || '';

  // Routes configuration
  const restrictedWhenLoggedIn = [
    '/ticket/auth',
    '/login',
    '/change-password',
    '/reset-password',
    '/register',
  ];

  const protectedRoutes = ['/my-tickets'];
  const staffOnlyRoutes = ['/ticket/scanner'];
  const buyerOnlyRoutes = [
    '/event',
    '/transaction',
    '/cookie-policy',
    '/privacy-policy',
    '/term-and-condition',
  ];

  // Helper functions
  const isRouteMatch = (routes: string[]) =>
    routes.some((route) => pathname.startsWith(route));

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, req.url));

  // Special handling for /reset-password
  if (pathname === '/reset-password') {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      const response = NextResponse.redirect(
        new URL('/reset-password', req.url)
      );

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60,
        sameSite: 'lax' as const,
      };

      response.cookies.set('reset_token', token, options);
      response.cookies.set('reset_email', email, options);
      return response;
    }

    const cookieToken = req.cookies.get('reset_token')?.value;
    const cookieEmail = req.cookies.get('reset_email')?.value;

    if (cookieToken && cookieEmail) {
      return NextResponse.next();
    }

    return redirect('/login');
  }

  // Redirect logged-in users from auth pages
  const isRestrictedWhenLoggedIn = restrictedWhenLoggedIn.includes(pathname);
  const isProtectedRoute = isRouteMatch(protectedRoutes);
  const isStaffPage = isRouteMatch(staffOnlyRoutes);
  const isBuyerPage = isRouteMatch(buyerOnlyRoutes);
  const userIsStaff = userRole === 'ground_staff';
  const userIsAdmin = userRole === 'admin';

  if (accessToken && isRestrictedWhenLoggedIn) {
    return redirect(userIsStaff ? '/ticket/scanner' : '/');
  }

  if (!accessToken && isProtectedRoute) {
    return redirect('/login');
  }

  if (!userIsStaff && !userIsAdmin && isStaffPage) {
    return redirect('/ticket/auth');
  }

  if (userIsStaff && isBuyerPage) {
    return redirect('/ticket/scanner');
  }

  // Add Authorization header if authenticated
  if (accessToken) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

// Apply to all routes except static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
