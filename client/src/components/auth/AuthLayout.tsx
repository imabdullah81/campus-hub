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
    <div className="relative min-h-screen bg-surface flex items-center justify-center p-6 lg:p-10 overflow-hidden">
      {/* ── Ambient glows ─────────────────────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none bg-primary" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none bg-secondary" />

      <div className="relative z-10 w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* ── Branding panel (hidden on mobile) ─────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-10 p-10 h-full">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="text-[32px] group-hover:scale-110 transition-transform">🎓</div>
            <span className="text-[26px] font-extrabold tracking-tight gradient-text">CampusHub</span>
          </Link>

          <div className="flex flex-col gap-6">
            <h1 className="text-[40px] font-extrabold leading-[1.1] text-white tracking-tight">
              Elevating Student Commerce.
            </h1>
            <p className="text-[17px] text-on-surface-variant leading-relaxed opacity-80">
              Join thousands of students across campus buying, selling, and
              connecting in a trusted ecosystem built specifically for
              university life.
            </p>

            <div className="flex gap-10 mt-4">
              {[
                { value: "10K+", label: "Students" },
                { value: "50+", label: "Universities" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div className="flex flex-col gap-1" key={stat.label}>
                  <span className="text-2xl font-bold gradient-text">{stat.value}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-muted opacity-60">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-on-surface-muted mt-auto pt-10 opacity-50">
            © {new Date().getFullYear()} CampusHub Inc. Built for Students.
          </p>
        </aside>

        {/* ── Auth card ─────────────────────────────────────────────── */}
        <main className="w-full max-w-[480px] mx-auto lg:mx-0 p-8 md:p-12 glass-card animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 no-underline mb-10 group justify-center">
            <div className="text-[28px] group-hover:scale-110 transition-transform">🎓</div>
            <span className="text-[22px] font-extrabold tracking-tight gradient-text">CampusHub</span>
          </Link>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
              {title}
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed opacity-80">
              {subtitle}
            </p>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
