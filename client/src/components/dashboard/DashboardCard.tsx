"use client";

import React from "react";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function DashboardCard({
  children,
  className = "",
  hoverEffect = false,
  glass = true,
  padding = "md",
}: DashboardCardProps) {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-12",
  };

  return (
    <div
      className={`
        rounded-xl transition-all duration-400 border border-outline-variant
        ${glass ? "glass-panel" : "bg-surface-bright/50"}
        ${hoverEffect ? "hover:bg-white/5 hover:-translate-y-1 hover:border-primary/50 group" : ""}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
