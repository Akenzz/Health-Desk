import { NextResponse } from 'next/server';
import { auth } from './app/lib/auth';

const protectedRoutes = ['/dashboard', '/profile', '/consultation', '/records', '/Medical-assistant'];
const authRoutes = ['/login', '/signup'];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedRoute && token) {
    const data = await auth();
    const safeUserName = encodeURIComponent(data.userName || '');

    if (!data.userName || data.userName.trim() === '') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);

      response.cookies.delete('token');
      response.cookies.delete('userName');
      response.cookies.delete('email');
      response.cookies.delete('phone');
      response.cookies.delete('role');

      return response;
    }

    if (pathname.startsWith('/dashboard/')) {
      const pathParts = pathname.split('/');
      const requestedRole = pathParts[2];
      const requestedIdRaw = pathParts[3];
      const requestedId = requestedIdRaw ? decodeURIComponent(requestedIdRaw) : requestedIdRaw;
      const currentUserName = data.userName ? decodeURIComponent(data.userName) : data.userName;

      if (requestedRole && requestedRole !== data.role) {
        return NextResponse.redirect(new URL(`/dashboard/${data.role}/${safeUserName}`, request.url));
      }

      if (requestedId && requestedId !== currentUserName) {
        return NextResponse.redirect(new URL(`/dashboard/${data.role}/${safeUserName}`, request.url));
      }
    }
  }

  if (isAuthRoute && token) {
    const data = await auth();
    const safeUserName = encodeURIComponent(data.userName || '');
    return NextResponse.redirect(new URL(`/dashboard/${data.role}/${safeUserName}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)',
  ],
};