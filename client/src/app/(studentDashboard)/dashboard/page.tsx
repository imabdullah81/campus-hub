"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  DollarSign
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";

export default function StudentDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-success", glow: "shadow-success/10" },
    { label: "Active Listings", value: "0", icon: ShoppingBag, color: "text-primary", glow: "shadow-primary/10" },
    { label: "Unread Messages", value: "0", icon: MessageSquare, color: "text-secondary", glow: "shadow-secondary/10" },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-[1200px] animate-fade-in pb-12">
      <DashboardHeader 
        title="Hello," 
        gradientTitle={user?.fullName?.split(" ")[0] || "Student"}
        logoUrl="/logo.png"
        subtitle="Your campus central is ready. What's on the agenda today?"
      >
        <Sparkles className="text-secondary hidden md:block animate-pulse" size={32} />
      </DashboardHeader>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <DashboardCard key={i} hoverEffect padding="none" className="flex items-center gap-6 p-6 lg:p-8">
            <div className={`w-14 h-14 rounded-lg bg-white/3 flex items-center justify-center border border-white/5 ${stat.color} ${stat.glow} shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-muted">
                {stat.label}
              </span>
              <span className="text-2xl md:text-3xl font-black text-white">
                {stat.value}
              </span>
            </div>
          </DashboardCard>
        ))}
      </section>

      <section className="flex flex-col gap-16">
        {/* Quick Actions */}
        <div className="flex flex-col">
          <DashboardHeader 
            title="Quick Actions" 
            subtitle="Jump straight into the most common tasks."
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/marketplace/sell" className="group no-underline">
              <DashboardCard hoverEffect className="flex items-center gap-6 p-8 h-full">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 gradient-brand shadow-lg shadow-primary/20">
                  <Plus size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold mb-1.5 text-white group-hover:text-primary transition-colors">Post an Item</h3>
                  <p className="text-sm text-on-surface-muted leading-relaxed">Convert your unused items into cash today.</p>
                </div>
                <ArrowRight className="text-on-surface-muted transition-all duration-300 group-hover:text-primary group-hover:translate-x-2 shrink-0" size={20} />
              </DashboardCard>
            </Link>

            <Link href="/marketplace" className="group no-underline">
              <DashboardCard hoverEffect className="flex items-center gap-6 p-8 h-full">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border border-white/10 glass-panel">
                  <Search size={24} className="text-on-surface-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold mb-1.5 text-white group-hover:text-primary transition-colors">Browse Market</h3>
                  <p className="text-sm text-on-surface-muted leading-relaxed">Find textbooks, electronics, and more.</p>
                </div>
                <ArrowRight className="text-on-surface-muted transition-all duration-300 group-hover:text-primary group-hover:translate-x-2 shrink-0" size={20} />
              </DashboardCard>
            </Link>

            <Link href="/services" className="group no-underline">
              <DashboardCard hoverEffect className="flex items-center gap-6 p-8 h-full">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border border-white/10 glass-panel">
                  <Zap size={24} className="text-on-surface-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold mb-1.5 text-white group-hover:text-primary transition-colors">Campus Services</h3>
                  <p className="text-sm text-on-surface-muted leading-relaxed">Discover tutoring, laundry, and help.</p>
                </div>
                <ArrowRight className="text-on-surface-muted transition-all duration-300 group-hover:text-primary group-hover:translate-x-2 shrink-0" size={20} />
              </DashboardCard>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col">
          <DashboardHeader 
            title="Recent Activity" 
            subtitle="Personalized updates from your campus network."
            className="mb-8"
          >
            <Link href="/marketplace">
              <DashboardButton variant="ghost" size="sm" icon={ArrowRight}>View All</DashboardButton>
            </Link>
          </DashboardHeader>

          <DashboardCard padding="lg" className="text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/3 flex items-center justify-center mb-4 text-primary shadow-2xl border border-white/5">
              <TrendingUp size={40} className="opacity-40" />
            </div>
            <h3 className="text-xl font-extrabold text-white">No recent activity yet</h3>
            <p className="text-on-surface-muted max-w-[400px] mx-auto mb-4">
              Start exploring the marketplace to see personalized updates here.
            </p>
            <Link href="/marketplace">
              <DashboardButton variant="gradient" size="lg">Explore Marketplace</DashboardButton>
            </Link>
          </DashboardCard>
        </div>
      </section>
    </div>
  );
}
