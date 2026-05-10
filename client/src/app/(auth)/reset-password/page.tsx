"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  InputField,
  PrimaryButton,
  AlertBanner,
} from "@/components/auth/AuthFormElements";
import { useAuth } from "@/hooks/useAuth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { resetPassword } = useAuth();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Token missing guard ───────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="invalid-state">
        <AlertBanner
          type="error"
          message="This reset link is invalid or has expired. Please request a new one."
        />
        <Link href="/forgot-password" className="back-link">
          Request new reset link
        </Link>
        <style jsx>{`
          .invalid-state { display: flex; flex-direction: column; gap: 20px; }
          .back-link {
            display: block; text-align: center; font-size: 14px;
            color: var(--primary-accent); text-decoration: none; font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setIsLoading(true);
    try {
      await resetPassword(token, form.password);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Password strength ─────────────────────────────────────────────────────
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      {serverError && <AlertBanner type="error" message={serverError} />}

      <div className="password-field-wrap">
        <InputField
          id="reset-password"
          label="New password"
          type={showPassword ? "text" : "password"}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
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

        {form.password && (
          <div className="strength-meter">
            <div className="strength-bars">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="strength-bar"
                  style={{ background: i <= strength ? strengthColor : "var(--outline-variant)" }}
                />
              ))}
            </div>
            <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
          </div>
        )}
      </div>

      <InputField
        id="reset-confirm"
        label="Confirm new password"
        type={showPassword ? "text" : "password"}
        placeholder="Re-enter password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
      />

      <PrimaryButton type="submit" isLoading={isLoading}>
        Set New Password
      </PrimaryButton>

      <Link href="/login" className="back-link">← Back to Sign In</Link>

      <style jsx>{`
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .password-field-wrap { position: relative; }
        .show-pw-btn {
          position: absolute; right: 14px; top: 40px;
          background: none; border: none; color: var(--on-surface-variant);
          font-size: 13px; font-weight: 500; cursor: pointer; font-family: var(--font-sans); padding: 0;
        }
        .show-pw-btn:hover { color: var(--primary-accent); }
        .strength-meter { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
        .strength-bars { display: flex; gap: 5px; flex: 1; }
        .strength-bar { flex: 1; height: 3px; border-radius: 9999px; transition: background 0.3s; }
        .strength-label { font-size: 12px; font-weight: 600; min-width: 44px; text-align: right; }
        .back-link {
          display: block; text-align: center; font-size: 14px;
          color: var(--on-surface-variant); text-decoration: none; font-weight: 500;
        }
        .back-link:hover { color: var(--primary-accent); }
      `}</style>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password to secure your account."
    >
      {/* Suspense required because useSearchParams() is dynamic */}
      <Suspense fallback={<p style={{ color: "var(--on-surface-variant)" }}>Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
