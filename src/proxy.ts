import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './lib/i18n/request';

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true
});

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  const accessToken = req.cookies.get('access_token')?.value;
  const userRole = req.cookies.get('user_role')?.value || '';

  // Extract locale and clean pathname for routing checks
  const localeMatch = pathname.match(/^\/(id|en)(\/|$)/);
  const currentLocale = localeMatch ? localeMatch[1] : 'en';
  const cleanPathname = pathname.replace(/^\/(id|en)(\/|$)/, '/');

  // Routes configuration
  const restrictedWhenLoggedIn = [
    '/ticket/auth',
    '/login',
    '/change-password',
    '/reset-password',
    '/register',
  ];

  const protectedRoutes = ['/tickets'];
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
    routes.some(route => cleanPathname.startsWith(route));

  const redirect = (path: string) => {
    const localizedPath = path.startsWith('/id') || path.startsWith('/en')
      ? path
      : `/${currentLocale}${path}`;
    return NextResponse.redirect(new URL(localizedPath, req.url));
  };

  // Special handling for /reset-password
  if (cleanPathname === '/reset-password') {
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

  // Special handling for /event/[slug] - save preview_token to cookie and remove from URL
  if (cleanPathname.startsWith('/event/') && cleanPathname !== '/event') {
    const previewToken = searchParams.get('preview_token');

    if (previewToken) {
      // Remove preview_token from URL
      const newUrl = new URL(req.url);
      newUrl.searchParams.delete('preview_token');
      const response = NextResponse.redirect(newUrl);

      // Save preview_token to httpOnly cookie
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 5, // 5 minutes
        sameSite: 'lax' as const,
      };

      response.cookies.set('preview_token', previewToken, options);
      return response;
    }
  }

  // Redirect logged-in users from auth pages
  const isRestrictedWhenLoggedIn = restrictedWhenLoggedIn.includes(cleanPathname);
  const isProtectedRoute = isRouteMatch(protectedRoutes);
  const isStaffPage = isRouteMatch(staffOnlyRoutes);
  const isBuyerPage = isRouteMatch(buyerOnlyRoutes);
  const userIsStaff = userRole === 'ground_staff' || userRole === 'event_organizer_pic';
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

  // Handle i18n and Auth headers
  if (accessToken) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    const modifiedReq = new NextRequest(req, { headers: requestHeaders });
    return intlMiddleware(modifiedReq);
  }

  return intlMiddleware(req);
}

// Apply to all routes except static assets
export const config = {
  matcher: [
    '/((?!api|ingest|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    '/',
    '/(id|en)/:path*',
  ],
};
