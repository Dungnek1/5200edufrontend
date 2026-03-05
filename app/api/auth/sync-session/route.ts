import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession, setSession, calculateTTL } from '@/lib/redis';
import { http } from '@/services/http';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('5200key')?.value;

        if (!sessionId) {
            return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
        }

        const session = await getSession(sessionId);
        if (!session) {
            return NextResponse.json({ message: 'Session expired' }, { status: 401 });
        }

        const beResponse = await http.get('/users/me', {
            headers: { Cookie: `5200key=${sessionId}` },
        });

        const freshUser = beResponse.data?.data || beResponse.data;
        if (!freshUser?.id) {
            return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
        }

        // Merge only profile fields; keep role, refreshToken, etc. from existing session
        const updatedSession = {
            ...session,
            user: {
                ...session.user,
                fullName: freshUser.fullName ?? session.user.fullName,
                phone: freshUser.phone ?? session.user.phone,
                avatarUrl: freshUser.avatarUrl ?? session.user.avatarUrl,
                updatedAt: freshUser.updatedAt ?? session.user.updatedAt,
            },
        };
        const ttl = 24 * 60 * 60;
        await setSession(sessionId, updatedSession, calculateTTL(new Date(Date.now() + ttl * 1000).toISOString(), ttl));

        return NextResponse.json({ sessionData: updatedSession });
    } catch (error: any) {
        return NextResponse.json({ message: 'Sync failed' }, { status: 500 });
    }
}
