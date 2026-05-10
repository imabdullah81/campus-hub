"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  InputField,
  PrimaryButton,
  AlertBanner,
} from "@/components/auth/AuthFormElements";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage("");
    setIsSuccess(false);

    if (!email) { setEmailError("Email is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Enter a valid email."); return; }
    setEmailError("");

    setIsLoading(true);
    try {
      const msg = await forgotPassword(email);
      setServerMessage(msg);
      setIsSuccess(true);
    } catch (err: unknown) {
      setServerMessage(err instanceof Error ? err.message : "Something went wrong.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="A password reset link has been sent."
      >
        <div className="success-state">
          <div className="success-icon" aria-hidden="true">📬</div>
          <AlertBanner type="success" message={serverMessage} />
          <p className="success-note">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              className="resend-btn"
              onClick={() => { setIsSuccess(false); setServerMessage(""); }}
            >
              try again
            </button>
            .
          </p>
          <Link href="/login" className="back-link">← Back to Sign In</Link>
        </div>

        <style jsx>{`
          .success-state { display: flex; flex-direction: column; gap: 20px; }
          .success-icon { font-size: 40px; text-align: center; }
          .success-note { font-size: 14px; color: var(--on-surface-variant); text-align: center; }
          .resend-btn {
            background: none; border: none; color: var(--primary-accent);
            font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--font-sans); padding: 0;
          }
          .resend-btn:hover { text-decoration: underline; }
          .back-link {
            display: block; text-align: center; font-size: 14px;
            color: var(--on-surface-variant); text-decoration: none; font-weight: 500;
          }
          .back-link:hover { color: var(--primary-accent); }
        `}</style>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a secure reset link."
    >
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {serverMessage && !isSuccess && (
          <AlertBanner type="error" message={serverMessage} />
        )}

        <InputField
          id="forgot-email"
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />

        <PrimaryButton type="submit" isLoading={isLoading}>
          Send Reset Link
        </PrimaryButton>

        <Link href="/login" className="back-link">
          ← Back to Sign In
        </Link>
      </form>

      <style jsx>{`
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .back-link {
          display: block; text-align: center; font-size: 14px;
          color: var(--on-surface-variant); text-decoration: none; font-weight: 500;
        }
        .back-link:hover { color: var(--primary-accent); }
      `}</style>
    </AuthLayout>
  );
}
