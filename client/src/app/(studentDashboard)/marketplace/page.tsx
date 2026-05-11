"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  Tag, 
  Layers, 
  ArrowRight,
  Package,
  RotateCcw
} from "lucide-react";

interface Listing {
  _id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  images: { url: string; public_id: string }[];
  location: string;
  views: number;
  createdAt: string;
}

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
  });

  const categories = ["Books", "Laptops", "Accessories", "Hostel Items", "Furniture", "Others"];
  const conditions = ["New", "Like New", "Used"];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.search) query.append("search", filters.search);
      if (filters.category) query.append("category", filters.category);
      if (filters.condition) query.append("condition", filters.condition);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

      const response = await axios.get(`/listings?${query.toString()}`);
      setListings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const resetFilters = () => {
    setFilters({ search: "", category: "", condition: "", minPrice: "", maxPrice: "" });
  };

  return (
    <div className="marketplace-view animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="title-area">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted text-sm">Discover and buy items from your fellow students.</p>
        </div>
        <div className="header-actions">
          <Link href="/marketplace/my-listings" className="action-btn glass-panel">
            <Package size={18} />
            <span>My Listings</span>
          </Link>
        </div>
      </div>

      <div className="marketplace-layout">
        {/* ── Filters Sidebar ── */}
        <aside className="filters-aside glass-panel">
          <div className="section-title">
            <Filter size={16} />
            <span>Refine Search</span>
          </div>

          <div className="filter-block">
            <label>Keyword</label>
            <div className="input-with-icon glass-panel">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          <div className="filter-block">
            <label>Category</label>
            <div className="chip-grid">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`chip ${filters.category === cat ? "active" : ""}`}
                  onClick={() => setFilters({ ...filters, category: filters.category === cat ? "" : cat })}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <label>Condition</label>
            <select
              className="glass-select"
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
            >
              <option value="">Any Condition</option>
              {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>

          <div className="filter-block">
            <label>Price Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="glass-input"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <span className="divider">—</span>
              <input
                type="number"
                placeholder="Max"
                className="glass-input"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </aside>

        {/* ── Results Area ── */}
        <div className="results-area">
          {loading ? (
            <div className="status-message">
              <div className="spinner" />
              <p>Scanning the campus for listings...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div key={listing._id} className="listing-card-v2 glass-card">
                  <div className="card-thumb">
                    {listing.images[0] ? (
                      <img src={listing.images[0].url} alt={listing.title} />
                    ) : (
                      <div className="no-image"><Package size={40} /></div>
                    )}
                    <div className="card-badge">{listing.category}</div>
                  </div>
                  
                  <div className="card-body">
                    <div className="card-top">
                      <h3 className="card-title">{listing.title}</h3>
                      <div className="card-price">${listing.price}</div>
                    </div>
                    
                    <div className="card-meta">
                      <div className="meta-item">
                        <MapPin size={12} />
                        <span>{listing.location || "Main Campus"}</span>
                      </div>
                      <div className="meta-item">
                        <Tag size={12} />
                        <span>{listing.condition}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <div className="views-count">
                        <Eye size={12} />
                        <span>{listing.views} views</span>
                      </div>
                      <Link href={`/marketplace/${listing._id}`} className="view-link">
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="status-message">
              <Layers size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No listings found</p>
              <p className="text-muted text-sm">Try adjusting your filters or search keywords.</p>
              <button className="mt-4 text-primary text-sm font-semibold" onClick={resetFilters}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .marketplace-view {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .text-muted { color: var(--on-surface-muted); }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          color: var(--on-surface);
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
        }

        .marketplace-layout {
          display: flex;
          gap: 32px;
        }

        .filters-aside {
          width: 300px;
          height: fit-content;
          border-radius: var(--radius-xl);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 104px;
          z-index: 10;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 800;
          color: white;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--outline-subtle);
        }

        .filter-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-block label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--on-surface-muted);
        }

        .input-with-icon {
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .input-with-icon input {
          background: none;
          border: none;
          outline: none;
          color: white;
          font-size: 14px;
          width: 100%;
        }

        .chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--outline-subtle);
          color: var(--on-surface-variant);
          cursor: pointer;
          transition: all 0.2s;
        }

        .chip:hover { 
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--outline-variant);
        }

        .chip.active {
          background: rgba(59, 130, 246, 0.1);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
        }

        .glass-select, .glass-input {
          height: 48px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--outline-subtle);
          border-radius: var(--radius-md);
          padding: 0 16px;
          color: white;
          font-size: 14px;
          outline: none;
          width: 100%;
        }

        .range-inputs {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .divider { color: var(--on-surface-muted); font-weight: 700; }

        .reset-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: var(--radius-md);
          background: none;
          border: 1px solid var(--outline-subtle);
          color: var(--on-surface-muted);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .reset-btn:hover {
          background: rgba(255, 180, 171, 0.05);
          color: var(--error);
          border-color: rgba(255, 180, 171, 0.2);
        }

        .results-area { flex: 1; }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .listing-card-v2 {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .listing-card-v2:hover {
          transform: translateY(-8px);
          border-color: var(--primary-glow);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card-thumb {
          height: 220px;
          position: relative;
          background: var(--surface-container-highest);
          overflow: hidden;
        }

        .card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .listing-card-v2:hover .card-thumb img {
          transform: scale(1.1);
        }

        .card-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 14px;
          background: rgba(11, 15, 25, 0.8);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 800;
          color: var(--primary);
          border: 1px solid var(--primary-glow);
          z-index: 2;
        }

        .card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 800;
          color: white;
          line-height: 1.3;
          flex: 1;
        }

        .card-price {
          font-size: 20px;
          font-weight: 900;
          color: var(--secondary);
          text-shadow: 0 0 20px var(--secondary-glow);
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--on-surface-muted);
          font-weight: 500;
        }

        .card-actions {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--outline-subtle);
        }

        .views-count {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--on-surface-muted);
          font-weight: 600;
        }

        .view-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          color: var(--primary);
          text-decoration: none;
          transition: all 0.2s;
        }

        .view-link:hover { transform: translateX(4px); }

        .status-message {
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--outline-subtle);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (max-width: 1200px) {
          .marketplace-layout { flex-direction: column; }
          .filters-aside { width: 100%; position: static; }
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .header-actions { width: 100%; }
          .action-btn { justify-content: center; width: 100%; }
          .listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
