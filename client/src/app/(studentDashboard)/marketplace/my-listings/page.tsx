"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Eye,
  Trash2,
  Package,
  Edit2
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ListingCard } from "@/components/dashboard/ListingCard";

interface Listing {
  _id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  images: { url: string; public_id: string }[];
  category: string;
  location?: string;
  condition?: string;
}

export default function MyListings() {
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
    <div className="flex flex-col gap-10 animate-fade-in pb-12">
      {/* ── Navigation Header ── */}
      <div className="flex justify-between items-center">
        <Link href="/marketplace" className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full no-underline text-on-surface-muted text-[13px] font-bold transition-all glass-panel hover:text-primary hover:bg-primary/5 hover:border-primary/40">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </Link>
        <Link href="/marketplace/sell">
          <DashboardButton variant="gradient" size="md" icon={Plus}>Post New Item</DashboardButton>
        </Link>
      </div>

      <DashboardHeader 
        title="Manage Your" 
        gradientTitle="Listings"
        logoUrl="/logo.png"
        subtitle="Track your active items and manage your campus sales."
      />

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
            <p className="text-on-surface-muted font-medium">Gathering your inventory...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="relative group">
                <ListingCard {...listing} />
                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all scale-100 lg:scale-95 lg:group-hover:scale-100">
                  <Link href={`/marketplace/edit/${listing._id}`}>
                    <button className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-xl">
                      <Edit2 size={16} />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(listing._id)}
                    className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-error hover:border-error transition-all shadow-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardCard padding="lg" className="text-center flex flex-col items-center gap-4 py-20">
            <div className="w-20 h-20 rounded-full bg-white/3 flex items-center justify-center mb-4 text-on-surface-muted/30 shadow-inner">
              <Package size={40} />
            </div>
            <h2 className="text-xl font-extrabold text-white">Your shop is empty</h2>
            <p className="text-on-surface-muted text-sm max-w-xs mx-auto mb-6">Ready to clear some space and make some cash?</p>
            <Link href="/marketplace/sell">
              <DashboardButton variant="gradient" size="lg" icon={Plus}>List Your First Item</DashboardButton>
            </Link>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
