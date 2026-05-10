"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-logo">CampusHub</div>
        <div className="nav-user">
          <span>{user?.fullName}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <header className="welcome-header">
          <h1>Welcome back, {user?.fullName?.split(" ")[0]}! 👋</h1>
          <p>Explore the latest campus deals or manage your listings.</p>
        </header>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Active Listings</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p className="stat-value">$0.00</p>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <p className="stat-value">0</p>
          </div>
        </div>

        <section className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No listings yet</h2>
          <p>Start selling your items to other students on campus.</p>
          <Link href="/sell" className="primary-btn">Create Listing</Link>
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: var(--background);
          color: var(--on-surface);
        }
        .dashboard-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background: var(--surface-container-low);
          border-bottom: 1px solid var(--outline-subtle);
        }
        .nav-logo {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary-accent);
        }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .logout-btn {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--outline-subtle);
          color: var(--on-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: var(--error-container);
          color: white;
          border-color: transparent;
        }
        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .welcome-header h1 {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .welcome-header p {
          color: var(--on-surface-variant);
          margin-bottom: 40px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
        }
        .stat-card {
          padding: 24px;
          background: var(--surface-container);
          border: 1px solid var(--outline-subtle);
          border-radius: var(--radius-lg);
        }
        .stat-card h3 {
          font-size: 14px;
          color: var(--on-surface-variant);
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
        }
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 2px dashed var(--outline-subtle);
          border-radius: var(--radius-xl);
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 24px;
        }
        .empty-state h2 {
          margin-bottom: 12px;
        }
        .empty-state p {
          color: var(--on-surface-variant);
          margin-bottom: 32px;
        }
        .primary-btn {
          display: inline-block;
          padding: 12px 32px;
          background: var(--primary-accent);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
