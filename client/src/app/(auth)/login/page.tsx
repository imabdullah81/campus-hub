"use client";

import type { Metadata } from "next";
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
      <form onSubmit={handleSubmit} noValidate className="auth-form">
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

        <div className="password-field-wrap">
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
            className="show-pw-btn"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="form-meta">
          <Link href="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        <PrimaryButton type="submit" isLoading={isLoading}>
          Sign In
        </PrimaryButton>

        <AuthDivider label="or continue with" />

        <GoogleLoginButton onCredential={handleGoogle} />

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="auth-link">
            Sign up for free
          </Link>
        </p>
      </form>

      <style jsx>{`
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .password-field-wrap { position: relative; }
        .show-pw-btn {
          position: absolute;
          right: 14px;
          top: 40px;
          background: none;
          border: none;
          color: var(--on-surface-variant);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: var(--font-sans);
          padding: 0;
        }
        .show-pw-btn:hover { color: var(--primary-accent); }
        .form-meta { display: flex; justify-content: flex-end; margin-top: -8px; }
        .forgot-link {
          font-size: 13px;
          color: var(--primary-accent);
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }
        .auth-switch {
          text-align: center;
          font-size: 14px;
          color: var(--on-surface-variant);
        }
        .auth-link {
          color: var(--primary-accent);
          font-weight: 600;
          text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </AuthLayout>
  );
}
