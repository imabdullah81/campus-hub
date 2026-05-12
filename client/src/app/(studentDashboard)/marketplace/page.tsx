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
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* ── Page Header ── */}
      <div className="flex justify-between items-end gap-5 max-md:flex-col max-md:items-start">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Marketplace</h1>
          <p className="text-on-surface-muted text-sm font-medium">Discover and buy items from your fellow students.</p>
        </div>
        <div className="max-md:w-full">
          <Link href="/marketplace/my-listings" className="flex items-center gap-2.5 px-5 py-3 rounded-md font-bold text-sm no-underline text-on-surface transition-all glass-panel hover:bg-white/5 hover:border-primary max-md:justify-center">
            <Package size={18} className="text-primary" />
            <span>My Listings</span>
          </Link>
        </div>
      </div>

      <div className="flex gap-8 max-xl:flex-col">
        {/* ── Filters Sidebar ── */}
        <aside className="w-[300px] h-fit rounded-xl p-6 flex flex-col gap-6 sticky top-24 z-10 glass-panel max-xl:w-full max-xl:static">
          <div className="flex items-center gap-2.5 text-base font-extrabold text-white pb-3 border-b border-outline-subtle">
            <Filter size={16} className="text-primary" />
            <span>Refine Search</span>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-muted">Keyword</label>
            <div className="h-12 rounded-md flex items-center px-4 gap-3 bg-white/2 glass-panel group focus-within:border-primary/50 transition-colors">
              <Search size={14} className="text-on-surface-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-on-surface-muted/50" 
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-muted">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const isActive = filters.category === cat;
                return (
                  <button 
                    key={cat}
                    className={`px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer transition-all border
                      ${isActive 
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                        : "bg-white/3 border-outline-subtle text-on-surface-variant hover:bg-white/8 hover:border-outline-variant hover:text-white"}`}
                    onClick={() => setFilters({ ...filters, category: isActive ? "" : cat })}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-muted">Condition</label>
            <select
              className="h-12 bg-white/2 border border-outline-subtle rounded-md px-4 text-white text-sm outline-none w-full appearance-none cursor-pointer focus:border-primary/50 transition-colors"
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
            >
              <option value="" className="bg-surface">Any Condition</option>
              {conditions.map(cond => <option key={cond} value={cond} className="bg-surface">{cond}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-muted">Price Range</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                className="h-12 bg-white/2 border border-outline-subtle rounded-md px-4 text-white text-sm outline-none w-full placeholder:text-on-surface-muted/50 focus:border-primary/50 transition-colors"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <span className="text-on-surface-muted font-bold">—</span>
              <input
                type="number"
                placeholder="Max"
                className="h-12 bg-white/2 border border-outline-subtle rounded-md px-4 text-white text-sm outline-none w-full placeholder:text-on-surface-muted/50 focus:border-primary/50 transition-colors"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <button 
            className="flex items-center justify-center gap-2 p-3.5 rounded-md bg-transparent border border-outline-subtle text-on-surface-muted text-[13px] font-bold cursor-pointer transition-all mt-2 hover:bg-error/5 hover:text-error hover:border-error/20" 
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </aside>

        {/* ── Results Area ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center gap-4">
              <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
              <p className="text-on-surface-muted font-medium">Scanning the campus for listings...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing._id} className="group flex flex-col overflow-hidden transition-all duration-400 glass-card hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-black/40">
                  <div className="h-[220px] relative bg-surface-bright/50 overflow-hidden">
                    {listing.images[0] ? (
                      <img 
                        src={listing.images[0].url} 
                        alt={listing.title} 
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-bright text-on-surface-muted/20">
                        <Package size={60} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-surface/80 backdrop-blur-md rounded-full text-[11px] font-extrabold text-primary border border-primary/30 z-10">
                      {listing.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-lg font-extrabold text-white leading-tight flex-1 group-hover:text-primary transition-colors line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="text-xl font-black text-secondary">
                        ${listing.price}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-[13px] text-on-surface-muted font-medium">
                        <MapPin size={14} className="text-primary/60" />
                        <span>{listing.location || "Main Campus"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-on-surface-muted font-medium">
                        <Tag size={14} className="text-secondary/60" />
                        <span>{listing.condition}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-subtle">
                      <div className="flex items-center gap-2 text-[12px] text-on-surface-muted font-semibold">
                        <Eye size={14} className="opacity-60" />
                        <span>{listing.views} views</span>
                      </div>
                      <Link href={`/marketplace/${listing._id}`} className="flex items-center gap-2 text-sm font-extrabold text-primary no-underline transition-all hover:translate-x-1">
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center gap-4 py-20">
              <Layers size={64} className="mb-4 opacity-10 text-on-surface-muted" />
              <p className="text-xl font-extrabold text-white">No listings found</p>
              <p className="text-on-surface-muted text-sm max-w-xs mx-auto">
                Try adjusting your filters or search keywords to find what you're looking for.
              </p>
              <button 
                className="mt-4 px-6 py-2 rounded-full border border-primary/30 text-primary text-sm font-bold transition-all hover:bg-primary/10" 
                onClick={resetFilters}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
