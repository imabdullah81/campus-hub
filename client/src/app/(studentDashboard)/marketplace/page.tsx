"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { 
  MapPin, 
  Eye, 
  Tag, 
  Layers, 
  ArrowRight,
  Package
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

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ListingCard } from "@/components/dashboard/ListingCard";

import { FilterSidebar } from "@/components/dashboard/FilterSidebar";

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
      <DashboardHeader 
        title="Campus" 
        gradientTitle="Marketplace"
        logoUrl="/logo.png"
        subtitle="Discover and buy items from your fellow students."
      >
        <Link href="/marketplace/my-listings">
          <DashboardButton variant="outline" size="md" icon={Package}>My Listings</DashboardButton>
        </Link>
      </DashboardHeader>

      <div className="flex gap-8 max-xl:flex-col">
        {/* ── Filters Sidebar ── */}
        <FilterSidebar 
          search={filters.search}
          onSearchChange={(val) => setFilters({...filters, search: val})}
          category={filters.category}
          onCategoryChange={(val) => setFilters({...filters, category: val})}
          categories={categories}
          condition={filters.condition}
          onConditionChange={(val) => setFilters({...filters, condition: val})}
          conditions={conditions}
          minPrice={filters.minPrice}
          onMinPriceChange={(val) => setFilters({...filters, minPrice: val})}
          maxPrice={filters.maxPrice}
          onMaxPriceChange={(val) => setFilters({...filters, maxPrice: val})}
          onReset={resetFilters}
        />

        {/* ── Results Area ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center gap-4">
              <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
              <p className="text-on-surface-muted font-medium">Scanning the campus for listings...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} {...listing} />
              ))}
            </div>
          ) : (
            <DashboardCard padding="lg" className="text-center flex flex-col items-center gap-4 py-20">
              <Layers size={64} className="mb-4 opacity-10 text-on-surface-muted" />
              <h2 className="text-xl font-extrabold text-white">No listings found</h2>
              <p className="text-on-surface-muted text-sm max-w-xs mx-auto">
                Try adjusting your filters or search keywords to find what you're looking for.
              </p>
              <DashboardButton variant="outline" size="md" onClick={resetFilters} className="mt-4">
                Clear all filters
              </DashboardButton>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}
