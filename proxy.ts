import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';
import { parse } from 'cookie';

export async function proxy(request: NextRequest) {
  let token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivatePage = pathname.startsWith('/profile') || pathname.startsWith('/notes');

  let response = NextResponse.next();

  if (!token && refreshToken) {
    try {
      const sessionRes = await checkSession({ Cookie: `refreshToken=${refreshToken}` });
      const setCookie = sessionRes.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          if (parsed.accessToken) {
            token = parsed.accessToken;
            response.cookies.set('accessToken', parsed.accessToken, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
            });
          }
          if (parsed.refreshToken) {
            response.cookies.set('refreshToken', parsed.refreshToken, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
            });
          }
        }
      }
    } catch (err) {
      // Refresh failed
    }
  }

  if (isPrivatePage && !token) {
    const redirectRes = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c));
    return redirectRes;
  }

  if (isAuthPage && token) {
    const redirectRes = NextResponse.redirect(new URL('/', request.url));
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c));
    return redirectRes;
  }

  return response;
}

export function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
