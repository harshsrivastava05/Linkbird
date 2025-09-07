// middleware.ts - Fixed version
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthPage = req.nextUrl.pathname === '/login';
  
  console.log('Middleware - Path:', req.nextUrl.pathname, 'Logged in:', isLoggedIn);
  
  // Allow API routes to pass through (they handle their own auth)
  if (isApiRoute) {
    return NextResponse.next();
  }
  
  // Allow access to login page
  if (isAuthPage) {
    return NextResponse.next();
  }
  
  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    console.log('Not logged in, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};