"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatusChipProps {
  label: string;
  type?: "primary" | "secondary" | "success" | "error" | "info" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function StatusChip({
  label,
  type = "neutral",
  icon: Icon,
  className = "",
}: StatusChipProps) {
  const styles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-success/10 text-success border-success/20",
    error: "bg-error/10 text-error border-error/20",
    info: "bg-primary/5 text-on-surface-variant border-outline-variant",
    neutral: "bg-white/5 text-on-surface-muted border-outline-subtle",
  };

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border transition-all
      ${styles[type]}
      ${className}
    `}>
      {Icon && <Icon size={12} />}
      <span>{label}</span>
    </div>
  );
}
