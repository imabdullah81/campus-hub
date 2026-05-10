"use client";

import Link from "next/link";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

/**
 * AuthLayout – the shared visual shell for all auth screens.
 * Implements the CampusHub Stitch design:
 * – Dark glassmorphic card centred on a deep navy background
 * – Ambient gradient glows
 * – Branding panel on the left (desktop), card-only on mobile
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="auth-root">
      {/* ── Ambient glows ─────────────────────────────────────────────── */}
      <div
        className="auth-glow"
        style={{
          width: 500,
          height: 500,
          top: -100,
          left: -150,
          background: "#3b82f6",
        }}
      />
      <div
        className="auth-glow"
        style={{
          width: 400,
          height: 400,
          bottom: -80,
          right: -100,
          background: "#8b5cf6",
        }}
      />

      <div className="auth-container">
        {/* ── Branding panel (hidden on mobile) ─────────────────────── */}
        <aside className="auth-branding">
          <Link href="/" className="auth-logo">
            <span className="auth-logo-icon">🎓</span>
            <span className="gradient-text">CampusHub</span>
          </Link>

          <div className="auth-branding-body">
            <h1 className="auth-branding-headline">
              Elevating Student Commerce.
            </h1>
            <p className="auth-branding-sub">
              Join thousands of students across campus buying, selling, and
              connecting in a trusted ecosystem built specifically for
              university life.
            </p>

            <div className="auth-stats">
              {[
                { value: "10K+", label: "Students" },
                { value: "50+", label: "Universities" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div className="auth-stat" key={stat.label}>
                  <span className="auth-stat-value gradient-text">{stat.value}</span>
                  <span className="auth-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="auth-branding-footer">
            © {new Date().getFullYear()} CampusHub Inc. Built for Students.
          </p>
        </aside>

        {/* ── Auth card ─────────────────────────────────────────────── */}
        <main className="auth-card glass-card">
          {/* Mobile logo */}
          <Link href="/" className="auth-logo auth-logo-mobile">
            <span className="auth-logo-icon">🎓</span>
            <span className="gradient-text">CampusHub</span>
          </Link>

          <div className="auth-card-header">
            <h2 className="auth-card-title">{title}</h2>
            <p className="auth-card-subtitle">{subtitle}</p>
          </div>

          {children}
        </main>
      </div>

      <style jsx>{`
        .auth-root {
          position: relative;
          min-height: 100vh;
          background: var(--surface);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .auth-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (min-width: 900px) {
          .auth-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ── Branding ── */
        .auth-branding {
          display: none;
          flex-direction: column;
          gap: 40px;
          padding: 48px;
        }
        @media (min-width: 900px) {
          .auth-branding { display: flex; }
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-size: 22px;
          font-weight: 700;
          color: var(--on-surface);
        }
        .auth-logo-icon { font-size: 26px; }

        .auth-logo-mobile {
          display: flex;
          margin-bottom: 24px;
        }
        @media (min-width: 900px) {
          .auth-logo-mobile { display: none; }
        }

        .auth-branding-body { display: flex; flex-direction: column; gap: 20px; }

        .auth-branding-headline {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.15;
          color: var(--on-surface);
          letter-spacing: -0.02em;
        }

        .auth-branding-sub {
          font-size: 16px;
          color: var(--on-surface-variant);
          line-height: 1.65;
        }

        .auth-stats {
          display: flex;
          gap: 32px;
          margin-top: 8px;
        }
        .auth-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .auth-stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
        }
        .auth-stat-label {
          font-size: 13px;
          color: var(--on-surface-variant);
          font-weight: 500;
        }

        .auth-branding-footer {
          font-size: 13px;
          color: var(--outline);
          margin-top: auto;
        }

        /* ── Card ── */
        .auth-card {
          padding: 40px;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }
        @media (min-width: 900px) {
          .auth-card { margin: 0; }
        }

        .auth-card-header { margin-bottom: 32px; }

        .auth-card-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--on-surface);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .auth-card-subtitle {
          font-size: 15px;
          color: var(--on-surface-variant);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
