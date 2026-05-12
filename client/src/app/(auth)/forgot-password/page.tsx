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
        <div className="flex flex-col gap-6 text-center animate-fade-in">
          <div className="text-[48px]" aria-hidden="true">📬</div>
          <AlertBanner type="success" message={serverMessage} />
          <p className="text-[14px] text-on-surface-variant leading-relaxed font-medium">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              className="text-primary font-bold hover:underline"
              onClick={() => { setIsSuccess(false); setServerMessage(""); }}
            >
              try again
            </button>
            .
          </p>
          <Link href="/login" className="inline-block text-[14px] text-on-surface-variant font-medium hover:text-primary transition-colors">
            ← Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a secure reset link."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 animate-fade-in">
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

        <Link href="/login" className="text-center text-[14px] text-on-surface-variant font-medium hover:text-primary transition-colors">
          ← Back to Sign In
        </Link>
      </form>
    </AuthLayout>
  );
}
