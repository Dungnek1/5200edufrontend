"use client";

import { createContext, useContext, useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type LoginRequest } from "@/services/apis";
import { logger } from "@/lib/logger";
import axios from "axios";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatar: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getRole: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUser() {
  const res = await axios.get("/api/auth/user", { withCredentials: true });
  return res.data.sessionData?.user || null;
}

function hasCookie() {
  return document.cookie.split("; ").some((row) => row.startsWith("5200logged"));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      if (!hasCookie()) {
        setUserData(null);
        setStatus("unauthenticated");
        setAuthChecked(true);
        return;
      }
      setUserLoading(true);
      try {
        const user = await fetchUser();
        setUserData(user);
        setStatus(user ? "authenticated" : "unauthenticated");
      } catch {
        setUserData(null);
        setStatus("unauthenticated");
      } finally {
        setUserLoading(false);
        setAuthChecked(true);
      }
    })();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const res = await axios.post("/api/auth/login", credentials, { withCredentials: true });
    setTimeout(async () => {
      try {
        const user = await fetchUser();
        setUserData(user);
        setStatus(user ? "authenticated" : "unauthenticated");
      } catch (err) {
        logger.error("Error loading user after login:", err);
      }
    }, 100);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      setUserData(null);
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setStatus("unauthenticated");
    } catch {
      // silent
    } finally {
      router.push("/");
    }
  }, [router]);

  const refreshSession = useCallback(async () => {
    try {
      setUserLoading(true);
      // Sync Redis session with fresh user data from backend DB
      const syncRes = await axios.post("/api/auth/sync-session", {}, { withCredentials: true });
      const freshUser = syncRes.data.sessionData?.user || null;
      if (freshUser) {
        setUserData(freshUser);
        return;
      }
      // Fallback: read existing session
      const user = await fetchUser();
      setUserData(user);
    } catch {
      // silent
    } finally {
      setUserLoading(false);
    }
  }, []);

  const user = useMemo<AuthUser | null>(
    () => {
      if (!userData) return null;
      const rawAvatar = userData.avatarUrl || userData.avatar || "";
      const cacheBuster = userData.updatedAt
        ? `?v=${new Date(userData.updatedAt).getTime()}`
        : "";
      return {
        id: userData.id || "",
        email: userData.email || "",
        fullName: userData.fullName || userData.name || "",
        role: userData.role || "STUDENT",
        avatar: rawAvatar ? rawAvatar + cacheBuster : "",
      };
    },
    [userData]
  );

  const getRole = useCallback(() => user?.role || null, [user]);

  const isAuth = status === "authenticated" && !!userData && authChecked;
  const loading = status === "loading" || userLoading || !authChecked;

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: isAuth, isLoading: loading, login, logout, refreshSession, getRole }),
    [user, isAuth, loading, login, logout, refreshSession, getRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
