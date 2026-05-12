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
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex justify-center">
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
          shape="rectangular"
          width="480"
          text="continue_with"
        />
      </div>
      {error && <p className="text-[12px] text-error font-bold">{error}</p>}
    </div>
  );
}
