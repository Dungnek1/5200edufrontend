
import { User } from '@/types/auth.types';

let redisClient: any | null = null;
let isConnecting = false;


export interface SessionData {
  userId?: string;
  refreshToken: string;
  expiresAt: string;
  role?: string;
  user: User;
}


function safeJsonParse<T>(data: string | null, defaultValue: T | null = null): T | null {
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    return defaultValue;
  }
}


export function calculateTTL(expiresAt: string | Date | null, defaultTTL: number = 30 * 24 * 60 * 60): number {
  if (!expiresAt) return defaultTTL;

  const expires = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const ttl = Math.floor((expires.getTime() - Date.now()) / 1000);

  if (ttl <= 0) {
    return defaultTTL;
  }

  return Math.min(ttl, 365 * 24 * 60 * 60);
}


async function scanKeys(pattern: string): Promise<string[]> {
  try {
    const client = await getRedisClient();
    const keys: string[] = [];
    let cursor = 0;

    do {
      try {
        const result = await client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100
        });
        cursor = result.cursor;
        keys.push(...result.keys);
      } catch (error) {
        break;
      }
    } while (cursor !== 0);

    return keys;
  } catch (error: any) {
    return [];
  }
}

export async function getRedisClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Redis client is not available on the client side');
  }

  if (redisClient) {
    try {
      await redisClient.ping();
      return redisClient;
    } catch (error) {
      redisClient = null;
    }
  }

  if (isConnecting) {
    let waitCount = 0;
    while (isConnecting && waitCount < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      waitCount++;
      if (redisClient) {
        try {
          await redisClient.ping();
          return redisClient;
        } catch {
        }
      }
    }
    if (isConnecting) {
      isConnecting = false;
    }
  }

  isConnecting = true;

  try {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    const { createClient } = await import('redis');

    redisClient = createClient({
      url,
      socket: {
        connectTimeout: 5000, // 5 seconds timeout
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            isConnecting = false;
            return false; // Stop reconnecting
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err: Error) => {
      redisClient = null; // Reset on error to force reconnection
      isConnecting = false;
    });

    redisClient.on('connect', () => {
      isConnecting = false;
    });

    redisClient.on('end', () => {
      redisClient = null;
      isConnecting = false;
    });

    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Redis connection timeout')), 5000);
    });

    await Promise.race([connectPromise, timeoutPromise]);
    isConnecting = false;
    return redisClient;
  } catch (error: any) {
    isConnecting = false;
    redisClient = null;
    throw new Error(`Redis connection failed: ${error.message}`);
  }
}


export async function getSession(sessionId: string): Promise<SessionData | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(`session:${sessionId}`);
    return safeJsonParse<SessionData>(data);
  } catch (error: any) {
    return null;
  }
}

export async function setSession(sessionId: string, data: any, ttl: number) {
  try {
    const client = await getRedisClient();
    const validTTL = ttl > 0 ? ttl : 30 * 24 * 60 * 60;

    const multi = client.multi();
    multi.setEx(`session:${sessionId}`, validTTL, JSON.stringify(data));

    if (data.userId) {
      multi.setEx(`user:${data.userId}:session`, validTTL, sessionId);
    }

    await multi.exec();
  } catch (error: any) {
  }
}

export async function deleteSession(sessionId: string) {
  const client = await getRedisClient();


  const sessionData = await getSession(sessionId);


  const multi = client.multi();
  multi.del(`session:${sessionId}`);

  if (sessionData?.userId) {
    multi.del(`user:${sessionData.userId}:session`);
  }

  await multi.exec();
}

export async function deleteUserSessions(userId: string) {
  const client = await getRedisClient();


  const keys = await scanKeys(`session:*`);
  const multi = client.multi();
  let foundSessions = 0;

  for (const key of keys) {
    const data = await client.get(key);
    if (data) {
      const session = safeJsonParse<any>(data);
      if (session?.userId === userId) {
        multi.del(key);
        foundSessions++;
      }
    }
  }


  multi.del(`user:${userId}:session`);

  if (foundSessions > 0) {
    await multi.exec();
  }
}


export async function findSessionTokenByUserId(userId: string): Promise<string | null> {
  const client = await getRedisClient();


  const sessionToken = await client.get(`user:${userId}:session`);
  if (sessionToken) {
    return sessionToken;
  }


  const keys = await scanKeys(`session:*`);
  for (const key of keys) {
    const data = await client.get(key);
    if (data) {
      const session = safeJsonParse<any>(data);
      if (session?.userId === userId) {
        const token = key.replace('session:', '');
        const ttl = await client.ttl(key);
        if (ttl > 0) {
          await client.setEx(`user:${userId}:session`, ttl, token);
        }
        return token;
      }
    }
  }

  return null;
}


export async function updateSessionAtomic(
  sessionId: string,
  updater: (data: any) => any,
  maxRetries: number = 3
): Promise<any> {
  const client = await getRedisClient();
  const key = `session:${sessionId}`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const data = await client.get(key);
      if (!data) {
        throw new Error('Session not found');
      }

      const sessionData = safeJsonParse<any>(data);
      if (!sessionData) {
        throw new Error('Invalid session data');
      }


      const updated = updater(sessionData);
      await client.watch(key);
      const multi = client.multi();


      const ttl = await client.ttl(key);
      const validTTL = ttl > 0 ? ttl : 30 * 24 * 60 * 60;

      multi.setEx(key, validTTL, JSON.stringify(updated));


      if (updated.userId && updated.userId !== sessionData.userId) {

        if (sessionData.userId) {
          multi.del(`user:${sessionData.userId}:session`);
        }

        multi.setEx(`user:${updated.userId}:session`, validTTL, sessionId);
      } else if (updated.userId) {

        multi.setEx(`user:${updated.userId}:session`, validTTL, sessionId);
      }

      const result = await multi.exec();

      if (result && result.length > 0) {
        return updated;
      } else {

        if (attempt < maxRetries - 1) {
          const backoff = Math.min(10 * Math.pow(2, attempt), 100);
          await new Promise(resolve => setTimeout(resolve, backoff));
          continue;
        }
        throw new Error('Failed to update session after retries');
      }
    } catch (error: any) {
      if (error.message === 'Session not found' || error.message === 'Invalid session data') {
        throw error;
      }


      if (attempt < maxRetries - 1) {
        const backoff = Math.min(10 * Math.pow(2, attempt), 100);
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }
      throw error;
    }
  }

  throw new Error('Failed to update session after retries');
}

export async function setUserActiveSession(userId: string, deviceType: string, sessionId: string, ttl: number) {
  const client = await getRedisClient();
  const validTTL = ttl > 0 ? ttl : 30 * 24 * 60 * 60;
  await client.setEx(`user:${userId}:active_session:${deviceType}`, validTTL, sessionId);
}

export async function getUserActiveSession(userId: string, deviceType: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    return await client.get(`user:${userId}:active_session:${deviceType}`);
  } catch (error: any) {
    return null;
  }
}

export async function deleteUserActiveSession(userId: string, deviceType: string) {
  const client = await getRedisClient();
  await client.del(`user:${userId}:active_session:${deviceType}`);
}