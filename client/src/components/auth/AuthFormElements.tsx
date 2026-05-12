"use client";

import React from "react";

// ─── Input Field ──────────────────────────────────────────────────────────────

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export function InputField({ label, error, id, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-bold text-on-surface-variant/80 tracking-wide uppercase">
        {label}
      </label>
      <div className={`relative group transition-all`}>
        <input 
          id={id} 
          className={`
            w-full px-4 py-3.5 bg-white/5 border rounded-md text-[15px] text-white outline-none transition-all duration-200
            placeholder:text-on-surface-muted/30
            ${error 
              ? "border-error/50 bg-error/5 focus:border-error shadow-[0_0_10px_rgba(255,180,171,0.1)]" 
              : "border-outline-variant focus:border-primary focus:bg-white/8 shadow-sm focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]"}
          `} 
          aria-describedby={error ? `${id}-error` : undefined} 
          {...props} 
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[12px] text-error font-bold mt-1 ml-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function PrimaryButton({ isLoading, children, disabled, ...props }: PrimaryButtonProps) {
  return (
    <button 
      disabled={isLoading || disabled} 
      className={`
        relative flex items-center justify-center gap-3 w-full p-4 rounded-md text-[15px] font-extrabold transition-all duration-300
        ${isLoading || disabled 
          ? "opacity-50 cursor-not-allowed bg-white/10 text-on-surface-muted border border-outline-subtle" 
          : "gradient-btn text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" aria-hidden="true" />
      ) : null}
      <span className="tracking-tight">{children}</span>
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-2 opacity-50">
      <div className="flex-1 h-px bg-outline-variant" />
      <span className="text-[12px] text-on-surface-muted font-bold uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-outline-variant" />
    </div>
  );
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────

interface AlertBannerProps {
  type: "error" | "success" | "info";
  message: string;
}

export function AlertBanner({ type, message }: AlertBannerProps) {
  const styles = {
    error: "bg-error/10 border-error/20 text-error shadow-[0_4px_12px_rgba(255,180,171,0.1)]",
    success: "bg-success/10 border-success/20 text-success shadow-[0_4px_12px_rgba(52,211,153,0.1)]",
    info: "bg-primary/10 border-primary/20 text-primary shadow-[0_4px_12px_rgba(59,130,246,0.1)]",
  };

  return (
    <div
      role="alert"
      className={`p-4 border rounded-md text-[14px] font-bold leading-relaxed animate-fade-in ${styles[type]}`}
    >
      {message}
    </div>
  );
}
