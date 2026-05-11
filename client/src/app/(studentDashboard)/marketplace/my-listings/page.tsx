"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Package, 
  Search,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";

interface Listing {
  _id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  images: { url: string; public_id: string }[];
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const { data } = await axios.get("/listings/user/me");
      setListings(data.data);
    } catch (error) {
      console.error("Failed to fetch my listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    try {
      await axios.delete(`/listings/${id}`);
      setListings(listings.filter(l => l._id !== id));
    } catch (error) {
      alert("Failed to delete listing");
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  return (
    <div className="manage-listings-view animate-fade-in">
      {/* ── Navigation Header ── */}
      <div className="nav-header">
        <Link href="/marketplace" className="back-link glass-panel">
          <ArrowLeft size={18} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <header className="page-header">
        <div className="title-area">
          <h1 className="text-3xl font-bold mb-2">My Shop</h1>
          <p className="text-muted">You have {listings.length} active listings on campus.</p>
        </div>
        <Link href="/marketplace/sell" className="add-listing-btn gradient-btn">
          <Plus size={18} />
          <span>Post New Item</span>
        </Link>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loader" />
          <p>Gathering your items...</p>
        </div>
      ) : listings.length > 0 ? (
        <div className="listings-stack">
          {listings.map(listing => (
            <div key={listing._id} className="listing-row glass-panel">
              <div className="item-main">
                <div className="thumb-container glass-panel">
                  {listing.images[0] ? (
                    <img src={listing.images[0].url} alt="" />
                  ) : (
                    <Package size={24} className="opacity-20" />
                  )}
                </div>
                <div className="item-info">
                  <h3 className="item-title">{listing.title}</h3>
                  <p className="item-price">${listing.price}</p>
                </div>
              </div>

              <div className="item-stats">
                <div className={`status-pill ${listing.status}`}>
                  {listing.status === 'available' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  <span>{listing.status}</span>
                </div>
                <div className="view-pill">
                  <Eye size={12} />
                  <span>{listing.views} views</span>
                </div>
              </div>

              <div className="item-actions">
                <Link href={`/marketplace/${listing._id}`} className="action-icon glass-panel" title="View details">
                  <ExternalLink size={18} />
                </Link>
                <button className="action-icon glass-panel" title="Edit listing">
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(listing._id)} 
                  className="action-icon glass-panel delete" 
                  title="Delete listing"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-shop glass-panel">
          <div className="empty-icon-wrap">
            <Package size={48} />
          </div>
          <h2 className="text-xl font-bold mb-2">Your shop is empty</h2>
          <p className="text-muted mb-8">Ready to clear some space and make some cash?</p>
          <Link href="/marketplace/sell" className="btn-start gradient-btn">
            List Your First Item
          </Link>
        </div>
      )}

      <style jsx>{`
        .manage-listings-view {
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .nav-header { display: flex; }

        .back-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          text-decoration: none;
          color: var(--on-surface-muted);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .back-link:hover {
          color: var(--primary);
          background: rgba(59, 130, 246, 0.05);
          border-color: var(--primary-glow);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .text-muted { color: var(--on-surface-muted); }

        .add-listing-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: var(--radius-full);
          text-decoration: none;
        }

        .listings-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .listing-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.2s;
        }

        .listing-row:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: scale(1.01);
        }

        .item-main {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .thumb-container {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-container-high);
        }

        .thumb-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-title {
          font-size: 17px;
          font-weight: 700;
          color: white;
        }

        .item-price {
          font-size: 15px;
          font-weight: 600;
          color: var(--secondary);
        }

        .item-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 0 40px;
        }

        .status-pill, .view-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .status-pill.available {
          background: rgba(52, 211, 153, 0.1);
          color: var(--success);
          border: 1px solid rgba(52, 211, 153, 0.2);
        }

        .view-pill {
          background: rgba(255, 255, 255, 0.05);
          color: var(--on-surface-muted);
        }

        .item-actions {
          display: flex;
          gap: 12px;
        }

        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--on-surface-muted);
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--outline-subtle);
        }

        .action-icon:hover {
          color: white;
          background: var(--surface-container-highest);
          border-color: var(--outline-variant);
        }

        .action-icon.delete:hover {
          color: var(--error);
          background: rgba(255, 180, 171, 0.1);
          border-color: rgba(255, 180, 171, 0.3);
        }

        .loading-container {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--on-surface-muted);
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid var(--outline-subtle);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .empty-shop {
          padding: 80px 40px;
          text-align: center;
          border-radius: var(--radius-xl);
          background: rgba(22, 29, 47, 0.4);
        }

        .empty-icon-wrap {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--surface-container-high);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
          color: var(--on-surface-muted);
          opacity: 0.5;
        }

        .btn-start {
          display: inline-flex;
          padding: 14px 40px;
          border-radius: var(--radius-full);
          text-decoration: none;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .listing-row { flex-direction: column; gap: 20px; align-items: flex-start; }
          .item-stats { padding: 0; }
          .item-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
}
