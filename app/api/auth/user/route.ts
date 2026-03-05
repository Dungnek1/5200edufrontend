import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/redis';

export async function GET() {
    try {

        const cookieStore = await cookies();
        const sessionId = cookieStore.get('5200key')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { message: 'Unauthenticated' },
                { status: 401 }
            );
        }


        const sessionData = await getSession(sessionId);

        if (!sessionData) {
            return NextResponse.json(
                { message: 'Session expired' },
                { status: 401 }
            );
        }


        return NextResponse.json({
            sessionData
        });
    } catch (error) {

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
