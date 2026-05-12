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

export default function StudentDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-success" },
    { label: "Active Listings", value: "0", icon: ShoppingBag, color: "text-primary" },
    { label: "Unread Messages", value: "0", icon: MessageSquare, color: "text-secondary" },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-[1200px] animate-fade-in pb-12">
      <header className="relative">
        <div className="flex flex-col">
          <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight mb-3 flex items-center gap-4">
            Hello, <span className="gradient-text">{user?.fullName?.split(" ")[0] || "Student"}</span>! 
            <Sparkles className="text-secondary" size={32} />
          </h1>
          <p className="text-base md:text-lg font-medium text-on-surface-muted">
            Your campus central is ready. What's on the agenda today?
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-6 p-6 lg:p-8 rounded-xl glass-panel transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 hover:border-primary/50 group">
            <div className={`w-14 h-14 rounded-lg bg-white/3 flex items-center justify-center border border-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold uppercase tracking-wider text-on-surface-muted">
                {stat.label}
              </span>
              <span className="text-[28px] font-extrabold text-white">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-16">
        {/* Quick Actions */}
        <div className="flex flex-col">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold mb-2 text-white">Quick Actions</h2>
              <p className="text-on-surface-muted text-[15px]">Jump straight into the most common tasks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/marketplace/sell" className="group flex items-center gap-6 p-8 rounded-xl no-underline text-white transition-all duration-300 relative overflow-hidden glass-panel hover:bg-white/5 hover:scale-[1.02] hover:border-primary">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 gradient-brand">
                <Plus size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[19px] font-extrabold mb-1.5 whitespace-nowrap">Post an Item</h3>
                <p className="text-sm text-on-surface-muted leading-relaxed">Convert your unused items into cash today.</p>
              </div>
              <ArrowRight className="text-on-surface-muted transition-all duration-300 group-hover:text-primary group-hover:translate-x-2 shrink-0" size={20} />
            </Link>

            <Link href="/marketplace" className="group flex items-center gap-6 p-8 rounded-xl no-underline text-white transition-all duration-300 relative overflow-hidden glass-panel hover:bg-white/5 hover:scale-[1.02] hover:border-primary">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border border-white/10 glass-panel">
                <Search size={24} className="text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[19px] font-extrabold mb-1.5 whitespace-nowrap">Browse Market</h3>
                <p className="text-sm text-on-surface-muted leading-relaxed">Find textbooks, electronics, and more.</p>
              </div>
              <ArrowRight className="text-on-surface-muted transition-all duration-300 group-hover:text-primary group-hover:translate-x-2 shrink-0" size={20} />
            </Link>

            <Link href="/services" className="group flex items-center gap-6 p-8 rounded-xl no-underline text-white transition-all duration-300 relative overflow-hidden glass-panel hover:bg-white/5 hover:scale-[1.02] hover:border-primary">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border border-white/10 glass-panel">
                <Zap size={24} className="text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[19px] font-extrabold mb-1.5 whitespace-nowrap">Campus Services</h3>
                <p className="text-sm text-on-surface-muted leading-relaxed">Discover tutoring, laundry, and help.</p>
              </div>
              <ArrowRight className="text-on-surface-muted transition-all duration-300 group-hover:text-primary group-hover:translate-x-2 shrink-0" size={20} />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold mb-2 text-white">Recent Activity</h2>
              <p className="text-on-surface-muted text-[15px]">Personalized updates from your campus network.</p>
            </div>
            <Link href="/marketplace" className="flex items-center gap-2 text-primary font-bold text-sm no-underline hover:opacity-80 transition-opacity">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="py-20 px-10 text-center rounded-xl flex flex-col items-center gap-4 bg-surface-bright/40 glass-panel">
            <div className="w-20 h-20 rounded-full bg-surface-bright flex items-center justify-center mb-4 text-primary shadow-lg shadow-primary/10">
              <TrendingUp size={40} className="opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-white">No recent activity yet</h3>
            <p className="text-on-surface-muted max-w-[400px] mx-auto mb-4">
              Start exploring the marketplace to see personalized updates here.
            </p>
            <Link href="/marketplace" className="px-10 py-3.5 rounded-full no-underline text-[15px] font-bold gradient-btn transition-transform hover:scale-105 active:scale-95">
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
