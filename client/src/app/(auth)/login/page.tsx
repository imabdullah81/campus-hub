"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import {
  InputField,
  PrimaryButton,
  AuthDivider,
  AlertBanner,
} from "@/components/auth/AuthFormElements";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, googleAuth } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await login(form);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google ────────────────────────────────────────────────────────────────
  const handleGoogle = async (credential: string) => {
    setServerError("");
    try {
      await googleAuth(credential);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {serverError && <AlertBanner type="error" message={serverError} />}

        <InputField
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />

        <div className="relative">
          <InputField
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <button
            type="button"
            className="absolute right-4 top-[38px] text-[12px] font-extrabold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex justify-end -mt-2">
          <Link href="/forgot-password" className="text-[13px] font-bold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <PrimaryButton type="submit" isLoading={isLoading}>
          Sign In
        </PrimaryButton>

        <AuthDivider label="or continue with" />

        <GoogleLoginButton onCredential={handleGoogle} />

        <p className="text-center text-[14px] text-on-surface-variant font-medium mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Sign up for free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
