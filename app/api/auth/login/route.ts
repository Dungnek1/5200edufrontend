import { authService } from '@/services/apis';
import { calculateTTL, setSession } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const loginDto = await req.json();
        const nestResponse = await authService.login(loginDto);

        const sessionData = nestResponse.data.data;
        const sessionId = sessionData.sessionId;
        const user = sessionData.user;
        // Lấy refreshToken từ BE response để lưu vào FE Redis
        const refreshToken = sessionData.refreshToken;

        // Remember me: 7 ngày, không remember: 1 ngày (session-like)
        const rememberMe = loginDto.rememberMe === true;
        const ttlSeconds = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

        const headers = new Headers();

        const setCookieValues = nestResponse.headers['set-cookie'] || nestResponse.headers.get('set-cookie');

        if (setCookieValues) {
            console.log('Setting cookies from backend response:', setCookieValues);
            const cookiesArray = Array.isArray(setCookieValues) ? setCookieValues : [setCookieValues];
            cookiesArray.forEach((cookieStr: string) => {
                headers.append('Set-Cookie', cookieStr);
            });
        }

        const cookieStore = await cookies();
        const cookieOptions: any = {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        // Remember me → persistent cookie, không → session cookie (hết khi đóng browser)
        if (rememberMe) {
            cookieOptions.maxAge = ttlSeconds;
        }

        cookieStore.set('5200logged', 'true', cookieOptions);

        // Lưu user + refreshToken vào FE Redis
        await setSession(sessionId, { user, refreshToken }, calculateTTL(expiresAt, ttlSeconds));

        return NextResponse.json(nestResponse.data, { headers });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Login failed', details: error.message },
            { status: 500 }
        );
    }
}
