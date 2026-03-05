import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession, setSession, calculateTTL } from '@/lib/redis';
import { http } from '@/services/http';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('5200key')?.value;


        if (!sessionId) {
            return NextResponse.json({ status: 'error', message: 'No session' }, { status: 401 });
        }

        const session = await getSession(sessionId);
        if (!session?.refreshToken) {
            return NextResponse.json({ status: 'error', message: 'No refresh token' }, { status: 401 });
        }


        const beResponse = await http.post('/auth/refresh',
            {
                refreshToken: session.refreshToken,
            }, {
            headers: {

                Cookie: `5200key=${sessionId}`,
            },
        });

        if (beResponse.data?.status === 'success') {

            const newRefreshToken = beResponse.data?.data?.refreshToken;
            if (newRefreshToken && newRefreshToken !== session.refreshToken) {
                const ttlSeconds = 24 * 60 * 60;
                const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
                await setSession(sessionId, {
                    ...session,
                    refreshToken: newRefreshToken,
                }, calculateTTL(expiresAt, ttlSeconds));
            }

            return NextResponse.json({ status: 'success', message: 'Token refreshed' });
        }

        return NextResponse.json({ status: 'error', message: 'Refresh failed' }, { status: 401 });

    } catch (error: any) {
        console.error('Refresh token error:', error?.response?.data || error.message);
        return NextResponse.json(
            { status: 'error', message: 'Refresh failed' },
            { status: 401 }
        );
    }
}
