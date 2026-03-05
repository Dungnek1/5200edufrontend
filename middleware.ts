import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/lib/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/.well-known/')) {
        return new NextResponse(null, { status: 404 });
    }

    // Redirect / → /vi
    if (pathname === '/' || pathname === '') {
        return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, req.url));
    }

    if (pathname === '/lander' || pathname === '/lander/') {
        return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, req.url));
    }

    const isProtected = /^\/([^/]+\/)?(student|teacher)(\/|$)/.test(pathname);

    if (isProtected) {
        const hasSession = req.cookies.has('5200key');
        if (!hasSession) {
            const loginUrl = new URL(`/${req.nextUrl.locale || routing.defaultLocale}/login`, req.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};