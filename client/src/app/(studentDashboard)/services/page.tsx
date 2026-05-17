"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { 
  Briefcase,
  Layers,
  Search
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilterSidebar } from "@/components/services/ServiceFilterSidebar";

interface Service {
  _id: string;
  title: string;
  price: number;
  category: string;
  pricingType: string;
  images: { url: string; public_id: string }[];
  skills: string[];
  views: number;
  providerId: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    pricingType: "",
    minPrice: "",
    maxPrice: "",
  });

  const categories = ["Tutoring", "Design", "Programming", "Writing", "Marketing", "Others"];

  const fetchServices = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.search) query.append("search", filters.search);
      if (filters.category) query.append("category", filters.category);
      if (filters.pricingType) query.append("pricingType", filters.pricingType);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

      const response = await axios.get(`/services?${query.toString()}`);
      setServices(response.data.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const resetFilters = () => {
    setFilters({ search: "", category: "", pricingType: "", minPrice: "", maxPrice: "" });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      <DashboardHeader 
        title="Skill" 
        gradientTitle="Hub"
        logoUrl="/logo.png"
        subtitle="Monetize your skills or find students to help with your projects."
      >
        <div className="flex gap-3">
          <Link href="/services/my-services">
            <DashboardButton variant="outline" size="md" icon={Briefcase}>My Services</DashboardButton>
          </Link>
          <Link href="/services/create">
            <DashboardButton variant="gradient" size="md">Post a Service</DashboardButton>
          </Link>
        </div>
      </DashboardHeader>

      <div className="flex gap-8 max-xl:flex-col">
        {/* ── Filters Sidebar ── */}
        <ServiceFilterSidebar 
          search={filters.search}
          onSearchChange={(val) => setFilters({...filters, search: val})}
          category={filters.category}
          onCategoryChange={(val) => setFilters({...filters, category: val})}
          categories={categories}
          pricingType={filters.pricingType}
          onPricingTypeChange={(val) => setFilters({...filters, pricingType: val})}
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
              <p className="text-on-surface-muted font-medium">Finding skilled students for you...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} {...service} />
              ))}
            </div>
          ) : (
            <DashboardCard padding="lg" className="text-center flex flex-col items-center gap-4 py-20">
              <Layers size={64} className="mb-4 opacity-10 text-on-surface-muted" />
              <h2 className="text-xl font-extrabold text-white">No services found</h2>
              <p className="text-on-surface-muted text-sm max-w-xs mx-auto">
                Try adjusting your filters or search keywords to find the talent you need.
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
