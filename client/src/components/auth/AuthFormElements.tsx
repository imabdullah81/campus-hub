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
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className={`field-input-wrap gradient-border ${error ? "field-error-wrap" : ""}`}>
        <input id={id} className="field-input" aria-describedby={error ? `${id}-error` : undefined} {...props} />
      </div>
      {error && (
        <p id={`${id}-error`} className="field-error-msg" role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .field-wrapper { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface-variant);
          letter-spacing: 0.01em;
        }
        .field-input-wrap {
          position: relative;
        }
        .field-error-wrap::before { opacity: 1; background: var(--error) !important; }
        .field-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--outline-variant);
          border-radius: var(--radius-md);
          color: var(--on-surface);
          font-size: 15px;
          font-family: var(--font-sans);
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .field-input::placeholder { color: var(--outline); }
        .field-input:focus {
          border-color: var(--primary-accent);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
        }
        .field-error-wrap .field-input {
          border-color: var(--error);
        }
        .field-error-msg {
          font-size: 12px;
          color: var(--error);
          font-weight: 500;
        }
      `}</style>
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
    <button disabled={isLoading || disabled} className="primary-btn" {...props}>
      {isLoading ? (
        <span className="primary-btn-spinner" aria-hidden="true" />
      ) : null}
      {children}

      <style jsx>{`
        .primary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 20px;
          background: var(--primary-accent);
          border: none;
          border-radius: var(--radius-md);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(59,130,246,0.3);
        }
        .primary-btn:hover:not(:disabled) {
          background: #2563eb;
          box-shadow: 0 6px 20px rgba(59,130,246,0.4);
          transform: translateY(-1px);
        }
        .primary-btn:active:not(:disabled) { transform: translateY(0); }
        .primary-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .primary-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="divider">
      <span className="divider-line" />
      <span className="divider-label">{label}</span>
      <span className="divider-line" />

      <style jsx>{`
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--outline-variant);
        }
        .divider-label {
          font-size: 13px;
          color: var(--outline);
          font-weight: 500;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────

interface AlertBannerProps {
  type: "error" | "success" | "info";
  message: string;
}

const alertColors = {
  error:   { bg: "rgba(147,0,10,0.18)",   border: "rgba(255,180,171,0.3)", text: "#ffb4ab" },
  success: { bg: "rgba(30,150,80,0.18)",  border: "rgba(100,220,140,0.3)", text: "#86efac" },
  info:    { bg: "rgba(59,130,246,0.15)", border: "rgba(173,198,255,0.3)", text: "#adc6ff" },
};

export function AlertBanner({ type, message }: AlertBannerProps) {
  const c = alertColors[type];
  return (
    <div
      role="alert"
      className="alert-banner"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      {message}

      <style jsx>{`
        .alert-banner {
          padding: 12px 16px;
          border: 1px solid;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
