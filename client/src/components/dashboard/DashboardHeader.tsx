"use client";

import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  gradientTitle?: string;
  logoUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  gradientTitle,
  logoUrl,
  children,
  className = "",
}: DashboardHeaderProps) {
  return (
    <header className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${className}`}>
      <div className="flex items-start gap-4">
        {logoUrl && (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden glass-panel flex items-center justify-center shrink-0 shadow-xl border border-white/10">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-white leading-tight flex flex-wrap gap-x-3 items-center">
            <span className="relative z-10">{title}</span>
            {gradientTitle && <span className="gradient-text relative z-10">{gradientTitle}</span>}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base font-medium text-on-surface-muted mt-2 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-4 w-full md:w-auto">
          {children}
        </div>
      )}
    </header>
  );
}
