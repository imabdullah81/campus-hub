"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * CampusHub Landing Page
 * A premium, glassmorphic design that introduces the platform.
 */
export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Background Ambient Glows */}
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">CH</div>
            <span className="logo-text">CampusHub</span>
          </div>
          <div className="nav-links">
            <Link href="/login" className="nav-btn secondary">Sign In</Link>
            <Link href="/signup" className="nav-btn primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="badge">Trustworthy Student Commerce</div>
          <h1 className="hero-title">
            Elevate Your <span className="text-gradient">Campus Life</span>
          </h1>
          <p className="hero-subtitle">
            The all-in-one marketplace built exclusively for students. Buy, sell, and connect 
            within your university ecosystem with verified trust and security.
          </p>
          
          <div className="hero-actions">
            <Link href="/signup" className="cta-btn primary">
              Join the Hub
            </Link>
            <Link href="/login" className="cta-btn secondary">
              Browse Listings
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">10k+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">50k+</span>
              <span className="stat-label">Listings</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">100+</span>
              <span className="stat-label">Universities</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card main-card">
            <div className="card-header">
              <div className="dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="url-bar">campushub.com/marketplace</div>
            </div>
            <div className="card-body">
              <div className="skeleton-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-item">
                    <div className="skeleton-image" />
                    <div className="skeleton-text short" />
                    <div className="skeleton-text long" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-card small-card float-1">
            <div className="floating-stat">
              <div className="icon">📈</div>
              <div>
                <div className="val">$1,240</div>
                <div className="lbl">Earned this month</div>
              </div>
            </div>
          </div>

          <div className="glass-card small-card float-2">
            <div className="floating-stat">
              <div className="icon">🔔</div>
              <div>
                <div className="val">New Message</div>
                <div className="lbl">Is the book still available?</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: var(--surface);
          color: var(--on-surface);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Ambient Glows */
        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 { top: -200px; right: -100px; background: var(--primary-accent); }
        .glow-2 { bottom: -200px; left: -100px; background: #6366f1; }

        /* Navbar */
        .navbar {
          height: 80px;
          display: flex;
          align-items: center;
          padding: 0 40px;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid var(--outline-subtle);
          background: rgba(10, 14, 23, 0.5);
          backdrop-filter: blur(10px);
        }
        .nav-content {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--primary-accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          font-size: 14px;
        }
        .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
        .nav-links { display: flex; gap: 16px; }
        .nav-btn {
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .nav-btn.primary { background: var(--primary-accent); color: white; }
        .nav-btn.primary:hover { background: #2563eb; transform: translateY(-1px); }
        .nav-btn.secondary { color: var(--on-surface-variant); }
        .nav-btn.secondary:hover { color: var(--on-surface); background: rgba(255,255,255,0.05); }

        /* Hero Section */
        .hero {
          flex: 1;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 80px 40px;
          gap: 60px;
          position: relative;
          z-index: 1;
        }

        .badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 100px;
          color: var(--primary-accent);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 72px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .text-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 19px;
          color: var(--on-surface-variant);
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 40px;
        }
        .hero-actions { display: flex; gap: 20px; margin-bottom: 60px; }
        .cta-btn {
          padding: 16px 32px;
          border-radius: var(--radius-lg);
          font-size: 16px;
          font-weight: 700;
          transition: all 0.2s;
        }
        .cta-btn.primary { background: var(--primary-accent); color: white; box-shadow: 0 8px 30px rgba(59,130,246,0.3); }
        .cta-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(59,130,246,0.4); }
        .cta-btn.secondary { border: 1px solid var(--outline-subtle); background: rgba(255,255,255,0.03); }
        .cta-btn.secondary:hover { background: rgba(255,255,255,0.08); }

        .hero-stats { display: flex; gap: 30px; align-items: center; }
        .stat-item { display: flex; flex-direction: column; }
        .stat-value { font-size: 24px; font-weight: 800; color: var(--on-surface); }
        .stat-label { font-size: 13px; color: var(--on-surface-variant); font-weight: 500; }
        .stat-divider { width: 1px; height: 30px; background: var(--outline-subtle); }

        /* Hero Visual */
        .hero-visual { position: relative; width: 100%; height: 500px; }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .main-card { width: 100%; height: 400px; overflow: hidden; }
        .card-header {
          height: 44px;
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
        }
        .dots { display: flex; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ff5f57; }
        .dot.yellow { background: #febc2e; }
        .dot.green { background: #28c840; }
        .url-bar {
          flex: 1;
          height: 24px;
          background: rgba(0,0,0,0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        .card-body { padding: 24px; }
        .skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .skeleton-item { display: flex; flex-direction: column; gap: 10px; }
        .skeleton-image { width: 100%; height: 80px; background: rgba(255,255,255,0.05); border-radius: 8px; }
        .skeleton-text { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; }
        .skeleton-text.short { width: 40%; }
        .skeleton-text.long { width: 80%; }

        .small-card {
          position: absolute;
          padding: 16px;
          z-index: 2;
        }
        .float-1 { bottom: 20px; left: -40px; min-width: 200px; animation: float 6s ease-in-out infinite; }
        .float-2 { top: 40px; right: -30px; min-width: 240px; animation: float 6s ease-in-out infinite reverse; }

        .floating-stat { display: flex; align-items: center; gap: 12px; }
        .floating-stat .icon { font-size: 24px; }
        .floating-stat .val { font-size: 16px; font-weight: 700; color: white; }
        .floating-stat .lbl { font-size: 12px; color: var(--on-surface-variant); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; text-align: center; padding: 40px 20px; }
          .hero-subtitle { margin: 0 auto 40px; }
          .hero-actions { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-visual { display: none; }
          .hero-title { font-size: 56px; }
        }
      `}</style>
    </div>
  );
}
