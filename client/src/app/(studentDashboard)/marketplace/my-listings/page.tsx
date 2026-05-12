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
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto animate-fade-in pb-12">
      {/* ── Navigation Header ── */}
      <div className="flex">
        <Link href="/marketplace" className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full no-underline text-on-surface-muted text-[13px] font-bold transition-all glass-panel hover:text-primary hover:bg-primary/5 hover:border-primary/40">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <header className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold mb-2 text-white">My Shop</h1>
          <p className="text-on-surface-muted font-medium text-sm">You have {listings.length} active listings on campus.</p>
        </div>
        <Link href="/marketplace/sell" className="flex items-center gap-2 px-6 py-3 rounded-full no-underline font-bold gradient-btn transition-transform hover:scale-105 active:scale-95 whitespace-nowrap">
          <Plus size={18} />
          <span>Post New Item</span>
        </Link>
      </header>

      {loading ? (
        <div className="h-[300px] flex flex-col items-center justify-center gap-4 text-on-surface-muted">
          <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
          <p className="font-medium">Gathering your items...</p>
        </div>
      ) : listings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {listings.map(listing => (
            <div key={listing._id} className="flex items-center justify-between p-4 px-6 rounded-lg bg-white/2 transition-all duration-200 glass-panel hover:bg-white/4 hover:scale-[1.01] max-md:flex-col max-md:gap-5 max-md:items-start">
              <div className="flex items-center gap-5 flex-1 w-full">
                <div className="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center bg-surface-bright glass-panel shrink-0">
                  {listing.images[0] ? (
                    <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="opacity-20" />
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-[17px] font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
                  <p className="text-[15px] font-semibold text-secondary">${listing.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 px-10 max-md:px-0 max-md:w-full max-md:justify-start">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold capitalize border
                  ${listing.status === 'available' ? 'bg-success/10 text-success border-success/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                  {listing.status === 'available' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  <span>{listing.status}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/5 text-on-surface-muted border border-white/5">
                  <Eye size={12} className="opacity-60" />
                  <span>{listing.views} views</span>
                </div>
              </div>

              <div className="flex gap-3 max-md:w-full max-md:justify-end">
                <Link href={`/marketplace/${listing._id}`} className="w-10 h-10 rounded-md flex items-center justify-center text-on-surface-muted bg-white/2 cursor-pointer transition-all border border-outline-subtle hover:text-white hover:bg-surface-bright hover:border-outline-variant" title="View details">
                  <ExternalLink size={18} />
                </Link>
                <button className="w-10 h-10 rounded-md flex items-center justify-center text-on-surface-muted bg-white/2 cursor-pointer transition-all border border-outline-subtle hover:text-white hover:bg-surface-bright hover:border-outline-variant" title="Edit listing">
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="w-10 h-10 rounded-md flex items-center justify-center text-on-surface-muted bg-white/2 cursor-pointer transition-all border border-outline-subtle hover:text-error hover:bg-error/10 hover:border-error/30"
                  title="Delete listing"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 px-10 text-center rounded-xl bg-surface-bright/40 glass-panel flex flex-col items-center gap-4">
          <div className="w-[100px] h-[100px] rounded-full bg-surface-bright flex items-center justify-center mx-auto mb-4 text-on-surface-muted opacity-50 shadow-lg">
            <Package size={48} />
          </div>
          <h2 className="text-xl font-extrabold text-white">Your shop is empty</h2>
          <p className="text-on-surface-muted text-sm max-w-xs mx-auto mb-6">Ready to clear some space and make some cash?</p>
          <Link href="/marketplace/sell" className="inline-flex px-10 py-3.5 rounded-full no-underline font-bold gradient-btn transition-transform hover:scale-105 active:scale-95">
            List Your First Item
          </Link>
        </div>
      )}
    </div>
  );
}
