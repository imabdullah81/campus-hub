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
    { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "var(--success)" },
    { label: "Active Listings", value: "0", icon: ShoppingBag, color: "var(--primary)" },
    { label: "Unread Messages", value: "0", icon: MessageSquare, color: "var(--secondary)" },
  ];

  return (
    <div className="dashboard-home animate-fade-in">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="welcome-text">
            Hello, <span className="gradient-text">{user?.fullName?.split(" ")[0] || "Student"}</span>! <Sparkles className="inline-icon" size={32} />
          </h1>
          <p className="hero-subtitle">Your campus central is ready. What's on the agenda today?</p>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-panel">
            <div className="stat-icon-wrap" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-sections">
        <div className="section-group">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-desc">Jump straight into the most common tasks.</p>
          </div>
          
          <div className="actions-grid">
            <Link href="/marketplace/sell" className="action-card glass-panel">
              <div className="action-icon-box gradient-btn">
                <Plus size={24} />
              </div>
              <div className="action-text">
                <h3>Post an Item</h3>
                <p>Convert your unused items into cash today.</p>
              </div>
              <ArrowRight className="card-arrow" size={20} />
            </Link>

            <Link href="/marketplace" className="action-card glass-panel">
              <div className="action-icon-box glass-panel">
                <Search size={24} />
              </div>
              <div className="action-text">
                <h3>Browse Market</h3>
                <p>Find textbooks, electronics, and more.</p>
              </div>
              <ArrowRight className="card-arrow" size={20} />
            </Link>

            <Link href="/services" className="action-card glass-panel">
              <div className="action-icon-box glass-panel">
                <Zap size={24} />
              </div>
              <div className="action-text">
                <h3>Campus Services</h3>
                <p>Discover tutoring, laundry, and help.</p>
              </div>
              <ArrowRight className="card-arrow" size={20} />
            </Link>
          </div>
        </div>

        <div className="section-group">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <Link href="/marketplace" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="empty-state-wrap glass-panel">
            <div className="empty-icon-circle">
              <TrendingUp size={40} className="opacity-40" />
            </div>
            <h3>No recent activity yet</h3>
            <p>Start exploring the marketplace to see personalized updates here.</p>
            <Link href="/marketplace" className="btn-explore gradient-btn">Explore Marketplace</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard-home {
          display: flex;
          flex-direction: column;
          gap: 48px;
          max-width: 1200px;
        }

        .hero-section {
          position: relative;
        }

        .welcome-text {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--on-surface-muted);
          font-weight: 500;
        }

        .inline-icon { color: var(--secondary); }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px 32px;
          border-radius: var(--radius-xl);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-4px);
          border-color: var(--primary-glow);
        }

        .stat-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--on-surface-muted);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        .dashboard-sections {
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        .section-header {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .section-desc {
          color: var(--on-surface-muted);
          font-size: 15px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 32px;
          border-radius: var(--radius-xl);
          text-decoration: none;
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: scale(1.02);
          border-color: var(--primary);
        }

        .action-icon-box {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-text h3 {
          font-size: 19px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .action-text p {
          font-size: 14px;
          color: var(--on-surface-muted);
          line-height: 1.5;
        }

        .card-arrow {
          margin-left: auto;
          color: var(--on-surface-muted);
          transition: all 0.3s;
        }

        .action-card:hover .card-arrow {
          color: var(--primary);
          transform: translateX(8px);
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
        }

        .view-all-link:hover { opacity: 0.8; }

        .empty-state-wrap {
          padding: 80px 40px;
          text-align: center;
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: rgba(22, 29, 47, 0.4);
        }

        .empty-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--surface-container-high);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--primary);
        }

        .empty-state-wrap h3 {
          font-size: 20px;
          font-weight: 700;
        }

        .empty-state-wrap p {
          color: var(--on-surface-muted);
          max-width: 400px;
          margin: 0 auto 24px;
        }

        .btn-explore {
          padding: 14px 40px;
          border-radius: var(--radius-full);
          text-decoration: none;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .welcome-text { font-size: 32px; }
          .hero-subtitle { font-size: 16px; }
          .actions-grid { grid-template-columns: 1fr; }
          .stat-card { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
