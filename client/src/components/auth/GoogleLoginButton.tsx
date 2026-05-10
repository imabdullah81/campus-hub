"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => Promise<void>;
  label?: string; // Standard button has its own labels, but we'll keep the prop for compatibility
}

/**
 * GoogleLoginButton
 * Uses the official Google Sign-In button which provides a secure ID Token (JWT).
 * This resolves the "segments" error on the backend.
 */
export function GoogleLoginButton({ onCredential }: GoogleLoginButtonProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="google-btn-container">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onCredential(credentialResponse.credential);
          }
        }}
        onError={() => {
          setError("Google sign-in failed. Please try again.");
        }}
        theme="filled_black"
        shape="pill"
        width="400"
        text="continue_with"
      />
      {error && <p className="google-error">{error}</p>}

      <style jsx>{`
        .google-btn-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .google-error {
          font-size: 12px;
          color: var(--error);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
