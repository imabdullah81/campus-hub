"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { AuthContextState } from "@/lib/auth.types";

/**
 * useAuth – consume the AuthContext.
 * Must be used inside an <AuthProvider>.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }

  return context;
}
