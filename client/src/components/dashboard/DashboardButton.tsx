"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function DashboardButton({
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading,
  fullWidth,
  children,
  className = "",
  ...props
}: DashboardButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2.5 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20",
    ghost: "bg-transparent text-on-surface-muted hover:bg-white/5 hover:text-white",
    gradient: "gradient-btn text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
    outline: "bg-transparent border border-outline-variant text-on-surface hover:border-primary hover:bg-primary/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-full",
    md: "px-6 py-2.5 text-sm rounded-full",
    lg: "px-8 py-3.5 text-base rounded-full",
  };

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? "w-full" : ""} 
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : Icon && <Icon size={size === "sm" ? 14 : 18} />}
      <span>{children}</span>
    </button>
  );
}
