import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/redis';
import { http } from '@/services/http';

export async function POST() {
    try {

        const cookieStore = await cookies();
        const sessionId = cookieStore.get('5200key')?.value;

        if (sessionId) {

            await deleteSession(sessionId);
            await http.post('/auth/logout', { sessionId });
        }


        cookieStore.delete('5200key');
        cookieStore.delete('5200logged');

        return NextResponse.json({
            status: 'success',
            message: 'Đăng xuất thành công',
        });
    } catch (error) {

        return NextResponse.json(
            {
                status: 'error',
                message: 'Logout failed',
            },
            { status: 500 }
        );
    }
}
