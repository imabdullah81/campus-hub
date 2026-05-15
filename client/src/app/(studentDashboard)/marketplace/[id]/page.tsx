"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Tag,
  Eye,
  Calendar,
  User,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { StatusChip } from "@/components/dashboard/StatusChip";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: { url: string; public_id: string }[];
  sellerId: {
    _id: string;
    fullName: string;
    email: string;
  };
  views: number;
  createdAt: string;
}

export default function ListingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/listings/${id}`);
        setListing(data.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-muted font-medium font-outfit">Loading listing details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-fade-in">
        <h2 className="text-2xl font-black text-white">Listing Not Found</h2>
        <p className="text-on-surface-muted">The item you're looking for might have been sold or removed.</p>
        <Link href="/marketplace">
          <DashboardButton variant="gradient">Back to Marketplace</DashboardButton>
        </Link>
      </div>
    );
  }

  const nextImage = () => setActiveImage((prev) => (prev + 1) % listing.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20 max-w-[1200px] mx-auto">
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[13px] font-bold text-on-surface-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Go Back</span>
        </button>
        <div className="w-1 h-1 rounded-full bg-on-surface-muted/30" />
        <span className="text-[13px] font-medium text-on-surface-muted/60">{listing.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* ── Left Column: Media ── */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card border-white/5 shadow-2xl group">
            {listing.images.length > 0 ? (
              <img 
                src={listing.images[activeImage].url} 
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-bright text-on-surface-muted/20">
                <Tag size={80} />
              </div>
            )}
            
            {listing.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/80"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/80"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImage ? "w-8 bg-primary" : "w-2 bg-white/40"}`} 
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-6 left-6 flex gap-3">
              <StatusChip label={listing.condition} type="secondary" className="backdrop-blur-xl bg-secondary/20 border-secondary/30" />
              <StatusChip label={listing.category} type="primary" className="backdrop-blur-xl bg-primary/20 border-primary/30" />
            </div>
          </div>

          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {listing.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary scale-95 shadow-lg shadow-primary/20" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <DashboardCard padding="lg" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary/80">Description</h3>
              <p className="text-on-surface-muted leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {listing.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-muted">Location</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <MapPin size={16} className="text-primary" />
                  <span>{listing.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-muted">Listed On</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calendar size={16} className="text-secondary" />
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-muted">Views</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Eye size={16} className="text-on-surface-muted" />
                  <span>{listing.views} Student views</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* ── Right Column: Info & Actions ── */}
        <div className="flex flex-col gap-6 sticky top-8">
          <DashboardCard padding="lg" className="flex flex-col gap-8 border-primary/20 shadow-primary/5">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black text-white leading-tight">
                {listing.title}
              </h1>
              <div className="text-4xl font-black text-secondary mt-2 flex items-baseline gap-1">
                <span className="text-2xl opacity-60">$</span>
                {listing.price}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-outline-variant flex items-center justify-between group hover:border-primary/40 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary p-[2px]">
                    <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden">
                      <User size={24} className="text-white/60" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-tighter text-on-surface-muted">Seller</span>
                    <span className="font-extrabold text-white group-hover:text-primary transition-colors">{listing.sellerId.fullName}</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase">
                  Verified
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a href={`mailto:${listing.sellerId.email}`} className="no-underline">
                  <DashboardButton variant="gradient" size="lg" className="w-full h-16 text-lg font-black shadow-xl shadow-primary/20" icon={MessageCircle}>
                    Contact Seller
                  </DashboardButton>
                </a>
                <DashboardButton variant="outline" size="lg" className="w-full h-14 border-white/10 hover:bg-white/5" icon={Share2}>
                  Share Listing
                </DashboardButton>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-black text-white">Secure Transaction</p>
                  <p className="text-[11px] text-on-surface-muted">Meet in public campus areas for safety.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-secondary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-black text-white">Usually Responds</p>
                  <p className="text-[11px] text-on-surface-muted">Under 2 hours</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          <div className="p-6 rounded-2xl bg-linear-to-br from-primary/5 to-secondary/5 border border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-muted">Safety Tips</h4>
            <ul className="text-[12px] text-on-surface-muted leading-relaxed list-disc pl-4 flex flex-col gap-2 font-medium">
              <li>Meet during daylight hours</li>
              <li>Use campus common areas (Library, Student Union)</li>
              <li>Inspect the item before paying</li>
              <li>Use digital payments if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
