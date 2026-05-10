"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type {
  AuthContextState,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/lib/auth.types";

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextState | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until initial check

  // ── Fetch current session on mount ────────────────────────────────────────
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get<{ success: boolean; user: User }>("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    const { data } = await api.post<{ success: boolean; user: User }>(
      "/auth/register",
      payload
    );
    setUser(data.user);
    router.push("/dashboard");
  }, [router]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (payload: LoginPayload) => {
    const { data } = await api.post<{ success: boolean; user: User }>(
      "/auth/login",
      payload
    );
    setUser(data.user);

    // Role-based redirect
    if (data.user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const googleAuth = useCallback(async (credential: string) => {
    const { data } = await api.post<{ success: boolean; user: User }>(
      "/auth/google",
      { credential }
    );
    setUser(data.user);

    if (data.user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
    router.push("/login");
  }, [router]);

  // ── Forgot Password ───────────────────────────────────────────────────────
  const forgotPassword = useCallback(async (email: string): Promise<string> => {
    const { data } = await api.post<{ success: boolean; message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return data.message;
  }, []);

  // ── Reset Password ────────────────────────────────────────────────────────
  const resetPassword = useCallback(async (token: string, password: string) => {
    const { data } = await api.post<{ success: boolean; user: User }>(
      "/auth/reset-password",
      { token, password }
    );
    setUser(data.user);
    router.push("/dashboard");
  }, [router]);

  // ── Context value (memoised) ──────────────────────────────────────────────
  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      googleAuth,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [user, isLoading, login, register, googleAuth, logout, forgotPassword, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
