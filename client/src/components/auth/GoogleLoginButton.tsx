"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => Promise<void>;
  label?: string;
}

/**
 * GoogleLoginButton
 * Uses the One-Tap / popup flow to obtain the user's ID token,
 * then calls onCredential so the parent can POST it to our backend.
 */
export function GoogleLoginButton({
  onCredential,
  label = "Continue with Google",
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      // With implicit flow we get an access_token, not an id_token credential.
      // We exchange it for user info then pass the access_token to our backend.
      setIsLoading(true);
      try {
        await onCredential(tokenResponse.access_token);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  return (
    <button
      type="button"
      onClick={() => {
        setIsLoading(true);
        googleLogin();
      }}
      disabled={isLoading}
      className="google-btn"
      aria-label={label}
    >
      {isLoading ? (
        <span className="google-btn-spinner" aria-hidden="true" />
      ) : (
        <GoogleIcon />
      )}
      <span>{isLoading ? "Connecting…" : label}</span>

      <style jsx>{`
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--outline-subtle);
          border-radius: var(--radius-md);
          color: var(--on-surface);
          font-size: 15px;
          font-weight: 500;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .google-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .google-btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--primary-accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}

// ── Inline Google "G" logo SVG ────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.638-.058-1.252-.166-1.84H9v3.479h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.613z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.182l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.708c-.18-.54-.282-1.117-.282-1.708s.102-1.168.282-1.708V4.96H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.04l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
