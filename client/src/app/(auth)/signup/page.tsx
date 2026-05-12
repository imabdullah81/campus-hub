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

export default function SignupPage() {
  const { register, googleAuth } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setIsLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password });
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Registration failed.");
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

  // ── Password strength indicator ───────────────────────────────────────────
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

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of students on CampusHub."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {serverError && <AlertBanner type="error" message={serverError} />}

        <GoogleLoginButton onCredential={handleGoogle} label="Sign up with Google" />
        <AuthDivider label="or sign up with email" />

        <InputField
          id="signup-fullname"
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          error={errors.fullName}
        />

        <InputField
          id="signup-email"
          label="University email"
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />

        <div className="relative">
          <InputField
            id="signup-password"
            label="Password"
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

          {/* Password strength meter */}
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
          id="signup-confirm"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <PrimaryButton type="submit" isLoading={isLoading}>
          Create Account
        </PrimaryButton>

        <p className="text-center text-[14px] text-on-surface-variant font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-[12px] text-on-surface-muted leading-relaxed opacity-60">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary font-bold hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
