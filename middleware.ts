// middleware.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // Check if the user is authenticated
  const isLoggedIn = !!req.auth;

  // If the user is not logged in and is trying to access a protected route
  if (!isLoggedIn) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

// This config specifies which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};