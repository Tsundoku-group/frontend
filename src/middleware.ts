import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/services/auth/session';

export default async function middleware(req: NextRequest) {
    const STATIC_PROTECTED_ROUTES = new Set([
        '/',
        '/home',
        '/friends',
        '/conversations',
        '/archives',
        '/accountSettings',
        '/profileSettings',
        '/accessibilitySettings',
        '/appearanceSettings',
        '/notificationSettings',
        '/profile',
        '/challenges',
        '/articles',
        '/clubs'
    ]);

    const DYNAMIC_PROTECTED_PATTERNS = [
        /^\/conversations(\/.*)?$/,
        /^\/profile\/\d+$/,
        /^\/clubs\/[a-zA-Z0-9-_]+$/,
        /^\/articles\/\d+$/,
    ];

    function isProtectedRoute(path: string): boolean {
        return STATIC_PROTECTED_ROUTES.has(path) || DYNAMIC_PROTECTED_PATTERNS.some(pattern => pattern.test(path));
    }

    const currentPath = req.nextUrl.pathname;
    const isProtected = isProtectedRoute(currentPath);

    const cookie = req.cookies.get('session');

    if (isProtected) {
        const cookieValue = cookie?.value;
        if (!cookieValue) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const session = await decrypt(cookieValue);

        if (!session?.userId) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    if (currentPath === '/login' && cookie?.value) {
        const session = await decrypt(cookie.value);
        if (session?.userId) {
            return NextResponse.redirect(new URL('/home', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.ico$).*)'],
};