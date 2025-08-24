import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Configuration
  const pathname = req.nextUrl.pathname;
  const accessToken = req.cookies.get('access_token')?.value;
  const userRole = req.cookies.get('user_role')?.value || '';

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

  const mk = (res: NextResponse) => {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    res.headers.set('Vary', 'Cookie');
    return res;
  };

  const redirect = (path: string) =>
    mk(NextResponse.redirect(new URL(path, req.url)));

  // Validation logic
  const isRestrictedWhenLoggedIn = restrictedWhenLoggedIn.includes(pathname);
  const isProtectedRoute = isRouteMatch(protectedRoutes);
  const isStaffPage = isRouteMatch(staffOnlyRoutes);
  const isBuyerPage = isRouteMatch(buyerOnlyRoutes);
  const userIsStaff = userRole === 'ground_staff';
  const userIsAdmin = userRole === 'admin';

  // Redirect logged-in users from auth pages
  if (accessToken && isRestrictedWhenLoggedIn) {
    return redirect(userIsStaff ? '/ticket/scanner' : '/');
  }

  // Redirect unauthenticated users from protected routes
  if (!accessToken && isProtectedRoute) {
    return redirect('/login');
  }

  // Redirect non-staff from staff pages
  if (!userIsStaff && !userIsAdmin && isStaffPage) {
    return redirect('/ticket/auth');
  }

  // Redirect staff from buyer pages
  if (userIsStaff && isBuyerPage) {
    return redirect('/ticket/scanner');
  }

  // Add authorization header if authenticated
  const res = mk(NextResponse.next());
  if (accessToken) res.headers.set('Authorization', `Bearer ${accessToken}`);
  return res;
}
