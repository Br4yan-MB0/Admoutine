import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'chroutine_secret_key';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rotas públicas
  const publicRoutes = ['/', '/login', '/register'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Sem token → login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 🔐 Rotas exclusivas de admin
    if (pathname.startsWith('/dashboard') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/home/:path*',
    '/dashboard/:path*',
    '/tasks/:path*',
    '/settings/:path*',
  ],
};
