"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Tag, Eye, ArrowRight, Package } from "lucide-react";
import { StatusChip } from "./StatusChip";

interface ListingCardProps {
  _id: string;
  title: string;
  price: number;
  category: string;
  condition?: string;
  images: { url: string; public_id: string }[];
  location?: string;
  views?: number;
  href?: string;
  className?: string;
}

export function ListingCard({
  _id,
  title,
  price,
  category,
  condition = "Used",
  images,
  location,
  views = 0,
  href,
  className = "",
}: ListingCardProps) {
  const finalHref = href || `/marketplace/${_id}`;

  return (
    <div className={`
      group flex flex-col overflow-hidden transition-all duration-400 glass-card 
      hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-black/40
      ${className}
    `}>
      <div className="h-[220px] relative bg-surface-bright/50 overflow-hidden">
        {images[0] ? (
          <img 
            src={images[0].url} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-bright text-on-surface-muted/20">
            <Package size={60} />
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <StatusChip label={category} type="primary" className="backdrop-blur-md bg-surface/60" />
        </div>
        
        {/* Hover overlay glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg font-extrabold text-white leading-tight flex-1 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="text-xl font-black text-secondary">
            ${price}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[13px] text-on-surface-muted font-medium">
            <MapPin size={14} className="text-primary/60" />
            <span className="truncate max-w-[120px]">{location || "Main Campus"}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-on-surface-muted font-medium">
            <Tag size={14} className="text-secondary/60" />
            <span>{condition}</span>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-subtle">
          <div className="flex items-center gap-2 text-[12px] text-on-surface-muted font-semibold">
            <Eye size={14} className="opacity-60" />
            <span>{views || 0} views</span>
          </div>
          <Link href={finalHref} className="flex items-center gap-2 text-sm font-extrabold text-primary no-underline transition-all hover:translate-x-1">
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
