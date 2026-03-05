'use server';

import { cookies } from 'next/headers';
import { deleteSession, getSession } from '@/lib/redis';
import { AuthResponse } from '@/services/apis';

export async function getCurrentUserFromRedis(): Promise<AuthResponse["user"] | null> {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('5200key')?.value;


        if (!sessionId) return null;

        const sessionData = await getSession(sessionId);
        //@ts-ignore
        return (sessionData) || null;
    } catch (error) {
        return null;
    }
}

export async function deleteUserSessions() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('5200key')?.value;

        if (!sessionId) return null;

        await deleteSession(sessionId);
    } catch (error) {
    }
}
