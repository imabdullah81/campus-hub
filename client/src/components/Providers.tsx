"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

/**
 * Providers – wraps the entire app in:
 * 1. GoogleOAuthProvider (for the "Continue with Google" button)
 * 2. AuthProvider (manages JWT session state)
 *
 * This component must be a Client Component so that GoogleOAuthProvider
 * and AuthProvider context work correctly.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
