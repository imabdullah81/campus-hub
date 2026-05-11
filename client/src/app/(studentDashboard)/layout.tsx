"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, 
  ShoppingBag, 
  Briefcase, 
  MessageSquare, 
  Heart, 
  User, 
  LogOut, 
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  History
} from "lucide-react";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="dashboard-root">
      <div className="ambient-glow glow-blue" />
      <div className="ambient-glow glow-purple" />

      {/* ── Top Navigation ── */}
      <header className="top-nav-bar glass-panel">
        <div className="nav-container">
          <div className="left-section">
            <button 
              className="menu-toggle glass-panel"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link href="/dashboard" className="brand">
              <div className="brand-logo">🎓</div>
              <span className="brand-text gradient-text">CampusHub</span>
            </Link>
          </div>

          <div className="search-pill glass-panel desktop-only">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search campus..." className="search-input" />
          </div>
          
          <div className="actions">
            <Link href="/marketplace/sell" className="sell-button gradient-btn desktop-only">
              <PlusCircle size={18} />
              <span>Sell Item</span>
            </Link>
            
            <button className="icon-action-btn glass-panel">
              <Bell size={20} />
              <div className="notif-badge" />
            </button>

            <div className="profile-group">
              <div className="user-details desktop-only">
                <span className="name">{user?.fullName || "Student"}</span>
                <button onClick={logout} className="logout-btn">
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
              <div className="profile-avatar glass-panel">
                {user?.fullName?.charAt(0) || "S"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* ── Modern Sidebar ── */}
        <aside className={`main-sidebar glass-panel ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-inner">
            <div className="sidebar-header mobile-only">
              <span className="gradient-text font-bold text-xl">Campus Menu</span>
              <button onClick={() => setIsSidebarOpen(false)} className="close-btn glass-panel">
                <X size={20} />
              </button>
            </div>

            <div className="sidebar-sections">
              <div className="nav-group">
                <p className="group-label">Navigation</p>
                <nav className="sidebar-nav">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    
                    return (
                      <Link 
                        key={item.href}
                        href={item.href}
                        className={`nav-link ${isActive ? "active" : ""}`}
                      >
                        <div className="icon-box">
                          <Icon size={20} />
                        </div>
                        <span className="label">{item.name}</span>
                        {isActive ? (
                          <div className="active-indicator" />
                        ) : (
                          <ChevronRight size={14} className="arrow-icon" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="nav-group">
                <p className="group-label">Discover</p>
                <nav className="sidebar-nav">
                  <Link href="/marketplace?trending=true" className="nav-link">
                    <div className="icon-box"><TrendingUp size={20} /></div>
                    <span className="label">Trending</span>
                  </Link>
                  <Link href="/marketplace?new=true" className="nav-link">
                    <div className="icon-box"><Sparkles size={20} /></div>
                    <span className="label">Recently Added</span>
                  </Link>
                </nav>
              </div>
            </div>

            <div className="sidebar-footer">
              <div className="storage-card glass-panel">
                <div className="card-header">
                  <span className="title">Campus Storage</span>
                  <span className="percent">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="fill" style={{ width: "85%" }} />
                </div>
                <button className="upgrade-btn">Upgrade Account</button>
              </div>
              <p className="footer-copyright">© 2026 CampusHub Inc.</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* ── Main View ── */}
        <main className="main-view animate-fade-in">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-root {
          min-height: 100vh;
          background: var(--surface);
          position: relative;
          color: var(--on-surface);
        }

        .top-nav-bar {
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 72px;
          border-bottom: 1px solid var(--outline-variant);
          padding: 0 40px;
          display: flex;
          align-items: center;
          background: rgba(11, 15, 25, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
        }

        .nav-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-toggle {
          display: none;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--on-surface);
          background: rgba(255, 255, 255, 0.03);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-logo {
          font-size: 28px;
        }

        .brand-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .search-pill {
          flex: 1;
          max-width: 500px;
          height: 44px;
          border-radius: var(--radius-full);
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--outline-subtle);
        }

        .search-input {
          background: none;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 14px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sell-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .icon-action-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--on-surface-variant);
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          position: relative;
        }

        .notif-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          border: 2px solid var(--surface);
        }

        .profile-group {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-left: 20px;
          border-left: 1px solid var(--outline-subtle);
        }

        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .name {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--on-surface-muted);
          font-size: 12px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .logout-btn:hover { color: var(--error); }

        .profile-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .dashboard-content {
          display: flex;
          max-width: 1600px;
          margin: 0 auto;
          padding: 32px 40px;
          gap: 40px;
          min-height: calc(100vh - 72px);
        }

        .main-sidebar {
          width: 280px;
          height: calc(100vh - 136px);
          position: sticky;
          top: 104px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 500;
        }

        .sidebar-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 32px 16px;
          background: rgba(22, 29, 47, 0.6);
          backdrop-filter: blur(12px);
          border-radius: var(--radius-xl);
          border: 1px solid var(--outline-variant);
        }

        .sidebar-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
          flex: 1;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .group-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--on-surface-muted);
          padding-left: 20px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          color: var(--on-surface-variant);
          text-decoration: none;
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transform: translateX(4px);
        }

        .nav-link.active {
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          border-color: rgba(59, 130, 246, 0.2);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08);
        }

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .label {
          font-size: 15px;
          font-weight: 600;
          flex: 1;
        }

        .arrow-icon {
          opacity: 0;
          transition: all 0.2s;
          color: var(--on-surface-muted);
        }

        .nav-link:hover .arrow-icon {
          opacity: 1;
          transform: translateX(4px);
        }

        .active-indicator {
          width: 4px;
          height: 18px;
          background: var(--primary);
          border-radius: var(--radius-full);
          box-shadow: 0 0 12px var(--primary-glow);
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .storage-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--outline-subtle);
        }

        .footer-copyright {
          font-size: 11px;
          color: var(--on-surface-muted);
          text-align: center;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 450;
          animation: fadeInOverlay 0.3s ease;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .main-view {
          flex: 1;
          width: 100%;
          min-width: 0;
        }

        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 1024px) {
          .top-nav-bar { padding: 0 24px; }
          .menu-toggle { display: flex; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex; }

          .main-sidebar {
            position: fixed;
            left: -320px;
            top: 0;
            bottom: 0;
            height: 100vh;
            width: 300px;
            z-index: 1100;
          }

          .sidebar-inner {
            border-radius: 0 24px 24px 0;
            border-left: none;
          }

          .main-sidebar.open {
            left: 0;
            box-shadow: 20px 0 60px rgba(0, 0, 0, 0.7);
          }

          .dashboard-content {
            padding: 24px;
          }
          
          .nav-container { gap: 16px; }
          .profile-group { padding-left: 16px; }
        }

        @media (max-width: 480px) {
          .brand-text { display: none; }
          .dashboard-content { padding: 16px; }
          .top-nav-bar { height: 64px; }
        }
      `}</style>
    </div>
  );
}
