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
      <div className="flex flex-col gap-6 text-center animate-fade-in">
        <AlertBanner
          type="error"
          message="This reset link is invalid or has expired. Please request a new one."
        />
        <Link href="/forgot-password" className="inline-block text-[14px] text-primary font-bold hover:underline">
          Request new reset link
        </Link>
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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 animate-fade-in">
      {serverError && <AlertBanner type="error" message={serverError} />}

      <div className="relative">
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
          className="absolute right-4 top-[38px] text-[12px] font-extrabold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>

        {form.password && (
          <div className="flex items-center gap-3 mt-3 px-1">
            <div className="flex gap-1.5 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: i <= strength ? strengthColor : "var(--outline-variant)" }}
                />
              ))}
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest min-w-[50px] text-right transition-colors duration-300" style={{ color: strengthColor }}>
              {strengthLabel}
            </span>
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

      <Link href="/login" className="text-center text-[14px] text-on-surface-variant font-medium hover:text-primary transition-colors">
        ← Back to Sign In
      </Link>
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
