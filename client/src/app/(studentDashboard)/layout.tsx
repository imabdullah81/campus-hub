"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Briefcase,
  MessageSquare,
  Heart,
  User,
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Plus,
  Bell
} from "lucide-react";

import { DashboardButton } from "@/components/dashboard/DashboardButton";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Auth Guard ──
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-surface relative text-on-surface font-sans">
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-5 pointer-events-none -z-10 bg-primary" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-5 pointer-events-none -z-10 bg-secondary" />

      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-1000 h-[72px] border-b border-outline-variant px-4 lg:px-10 flex items-center bg-surface/80 backdrop-blur-2xl glass-panel">
        <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center gap-4 lg:gap-10">
          <div className="flex items-center gap-3 md:gap-5">
            <button
              className="lg:hidden w-10 h-10 rounded-md flex items-center justify-center cursor-pointer text-on-surface bg-white/5 border border-outline-subtle glass-panel"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/dashboard" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg border border-white/10">
                <img src="/logo.png" alt="CampusHub" className="w-full h-full object-cover" />
              </div>
              <span className="text-[18px] md:text-[24px] font-black tracking-tighter gradient-text block">CampusHub</span>
            </Link>
          </div>

          <div className="hidden xl:flex flex-1 max-w-[400px] h-10 rounded-full px-4 items-center gap-3 bg-white/5 border border-outline-subtle glass-panel focus-within:border-primary/50 transition-all">
            <Search className="text-on-surface-muted" size={16} />
            <input
              type="text"
              placeholder="Search items, services..."
              className="bg-transparent border-none text-white w-full outline-none text-xs placeholder:text-on-surface-muted/50"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/marketplace/sell">
              <DashboardButton variant="gradient" size="sm" icon={Plus} className="px-3 md:px-5">
                <span className="hidden sm:inline">Sell Item</span>
              </DashboardButton>
            </Link>

            <button className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-on-surface-variant cursor-pointer transition-all shrink-0 relative glass-panel hover:bg-white/10">
              <Bell size={18} className="md:hidden" />
              <Bell size={20} className="hidden md:block" />
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border border-surface md:w-2 md:h-2 md:top-3 md:right-3" />
            </button>

            <div className="flex items-center gap-3 md:gap-4 pl-2 md:pl-5 border-l border-outline-subtle">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-bold text-white leading-tight">{user?.fullName || "Student"}</span>
                <button onClick={logout} className="flex items-center gap-1 bg-none border-none text-on-surface-muted text-[11px] cursor-pointer transition-colors hover:text-error">
                  <LogOut size={10} />
                  <span>Logout</span>
                </button>
              </div>
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-md gradient-brand flex items-center justify-center font-extrabold text-white text-base md:text-lg shrink-0 shadow-lg shadow-primary/20 glass-panel">
                {user?.fullName?.charAt(0) || "S"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1600px] mx-auto p-6 lg:p-10 gap-10 min-h-[calc(100vh-72px)]">
        {/* ── Modern Sidebar ── */}
        <aside className={`
          fixed inset-y-0 left-0 z-1100 w-[300px] transition-all duration-400 lg:block lg:w-[280px] lg:h-[calc(100vh-120px)] lg:sticky lg:top-24 lg:z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="h-full flex flex-col p-6 rounded-r-2xl lg:rounded-2xl border border-outline-variant glass-panel overflow-hidden">
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <span className="gradient-text font-bold text-xl">Campus Menu</span>
              <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 rounded-md flex items-center justify-center glass-panel">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-8 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group flex flex-row items-center gap-4 px-5 py-3 rounded-md text-on-surface-variant no-underline relative transition-all duration-200 border border-transparent
                        hover:bg-white/5 hover:text-white hover:translate-x-1
                        ${isActive ? "bg-primary/10 text-primary border-primary/20 shadow-sm" : ""}
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                      )}
                      <div className={`flex items-center justify-center w-6 h-6 shrink-0 ${isActive ? "text-primary" : "text-on-surface-muted group-hover:text-white"}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-sm font-semibold flex-1 block ${isActive ? "text-primary" : ""}`}>{item.name}</span>
                      {!isActive && (
                        <ChevronRight size={14} className="opacity-0 transition-all duration-200 text-on-surface-muted group-hover:opacity-100 group-hover:translate-x-1" />
                      )}
                    </Link>
                  );
                })}

                <div className="h-px bg-outline-subtle my-4 mx-4 opacity-50" />

                <Link href="/marketplace?trending=true" className="group flex flex-row items-center gap-4 px-5 py-3 rounded-md text-on-surface-variant no-underline relative transition-all duration-200 hover:bg-white/5 hover:text-white hover:translate-x-1 border border-transparent">
                  <div className="flex items-center justify-center w-6 h-6 shrink-0 text-on-surface-muted group-hover:text-white"><TrendingUp size={20} /></div>
                  <span className="text-sm font-semibold flex-1">Trending</span>
                  <ChevronRight size={14} className="opacity-0 transition-all duration-200 text-on-surface-muted group-hover:opacity-100 group-hover:translate-x-1" />
                </Link>
                <Link href="/marketplace?new=true" className="group flex flex-row items-center gap-4 px-5 py-3 rounded-md text-on-surface-variant no-underline relative transition-all duration-200 hover:bg-white/5 hover:text-white hover:translate-x-1 border border-transparent">
                  <div className="flex items-center justify-center w-6 h-6 shrink-0 text-on-surface-muted group-hover:text-white"><Sparkles size={20} /></div>
                  <span className="text-sm font-semibold flex-1">Recently Added</span>
                  <ChevronRight size={14} className="opacity-0 transition-all duration-200 text-on-surface-muted group-hover:opacity-100 group-hover:translate-x-1" />
                </Link>
              </nav>
            </div>

            <div className="mt-auto pt-6 flex flex-col gap-4">
              <div className="p-5 rounded-lg bg-white/2 border border-outline-subtle glass-panel">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Campus Storage</span>
                  <span className="text-[11px] font-extrabold text-primary">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary rounded-full shadow-[0_0_8px_var(--primary-glow)]" style={{ width: "85%" }} />
                </div>
                <button className="w-full py-2 rounded-md text-[11px] font-bold bg-white/5 hover:bg-white/10 transition-colors border border-outline-subtle">
                  Upgrade Account
                </button>
              </div>
              <p className="text-[10px] text-on-surface-muted text-center">© 2026 CampusHub Inc.</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-1050 lg:hidden animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Main View ── */}
        <main className="flex-1 min-w-0 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
