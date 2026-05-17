"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";

interface ServiceFilterSidebarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  pricingType: string;
  onPricingTypeChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
}

export function ServiceFilterSidebar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  pricingType,
  onPricingTypeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  onReset,
}: ServiceFilterSidebarProps) {
  const pricingTypes = [
    { label: "Any Type", value: "" },
    { label: "Fixed Price", value: "fixed" },
    { label: "Hourly Rate", value: "hourly" }
  ];

  return (
    <aside className="w-full xl:w-[300px] h-fit xl:sticky xl:top-24 z-10">
      <DashboardCard padding="sm" className="flex flex-col gap-6">
        <div className="flex items-center gap-2.5 text-base font-extrabold text-white pb-3 border-b border-outline-subtle">
          <Filter size={16} className="text-primary" />
          <span>Refine Services</span>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-muted">Keyword</label>
          <div className="h-12 rounded-md flex items-center px-4 gap-3 bg-white/5 border border-outline-subtle focus-within:border-primary/50 transition-all">
            <Search size={14} className="text-on-surface-muted" />
            <input 
              type="text" 
              placeholder="Search title, skills..."
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-on-surface-muted/40" 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-muted">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isActive = category === cat;
              return (
                <button 
                  key={cat}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold cursor-pointer transition-all border
                    ${isActive 
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                      : "bg-white/5 border-outline-subtle text-on-surface-variant hover:bg-white/10 hover:border-outline-variant hover:text-white"}`}
                  onClick={() => onCategoryChange(isActive ? "" : cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Type */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-muted">Pricing Model</label>
          <select
            className="h-12 bg-white/5 border border-outline-subtle rounded-md px-4 text-white text-sm outline-none w-full appearance-none cursor-pointer focus:border-primary/50 transition-all"
            value={pricingType}
            onChange={(e) => onPricingTypeChange(e.target.value)}
          >
            {pricingTypes.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-muted">Price Range ($)</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min"
              className="h-12 bg-white/5 border border-outline-subtle rounded-md px-4 text-white text-sm outline-none w-full placeholder:text-on-surface-muted/40 focus:border-primary/50 transition-all"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
            />
            <span className="text-on-surface-muted font-bold">—</span>
            <input
              type="number"
              placeholder="Max"
              className="h-12 bg-white/5 border border-outline-subtle rounded-md px-4 text-white text-sm outline-none w-full placeholder:text-on-surface-muted/40 focus:border-primary/50 transition-all"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </div>
        </div>

        <DashboardButton variant="ghost" size="sm" icon={RotateCcw} onClick={onReset} className="mt-2 text-error hover:bg-error/5 hover:text-error hover:border-error/20">
          Reset Filters
        </DashboardButton>
      </DashboardCard>
    </aside>
  );
}
