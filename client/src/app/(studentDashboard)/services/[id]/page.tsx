"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Calendar,
  User,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Briefcase,
  Star,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { StatusChip } from "@/components/dashboard/StatusChip";

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  pricingType: string;
  availability: string;
  skills: string[];
  images: { url: string; public_id: string }[];
  providerId: {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  views: number;
  createdAt: string;
}

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/services/${id}`);
        setService(data.data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-muted font-medium">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-fade-in">
        <h2 className="text-2xl font-black text-white">Service Not Found</h2>
        <p className="text-on-surface-muted">The service you're looking for might have been removed.</p>
        <Link href="/services">
          <DashboardButton variant="gradient">Back to Skill Hub</DashboardButton>
        </Link>
      </div>
    );
  }

  const nextImage = () => setActiveImage((prev) => (prev + 1) % service.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + service.images.length) % service.images.length);

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
        <span className="text-[13px] font-medium text-on-surface-muted/60">{service.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* ── Left Column: Media ── */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden glass-card border-white/5 shadow-2xl group">
            {service.images.length > 0 ? (
              <img
                src={service.images[activeImage].url}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-bright text-on-surface-muted/20">
                <Briefcase size={80} />
              </div>
            )}

            {service.images.length > 1 && (
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
                  {service.images.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImage ? "w-8 bg-primary" : "w-2 bg-white/40"}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-6 left-6 flex gap-3">
              <StatusChip label={service.pricingType === "hourly" ? "Hourly Rate" : "Fixed Price"} type="secondary" className="backdrop-blur-xl bg-secondary/20 border-secondary/30" />
              <StatusChip label={service.category} type="primary" className="backdrop-blur-xl bg-primary/20 border-primary/30" />
            </div>
          </div>

          {/* Thumbnails */}
          {service.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {service.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary scale-95 shadow-lg shadow-primary/20" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <DashboardCard padding="lg" className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary/80">About this Service</h3>
              <p className="text-on-surface-muted leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {service.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-secondary/80">Skills & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {service.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-xl bg-surface-bright border border-outline-variant text-white font-bold text-sm shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-muted">Availability</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Clock size={16} className="text-primary" />
                  <span>{service.availability || "Flexible"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-muted">Posted On</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calendar size={16} className="text-secondary" />
                  <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-muted">Student Views</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Eye size={16} className="text-on-surface-muted" />
                  <span>{service.views} views</span>
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
                {service.title}
              </h1>
              <div className="flex flex-col mt-4">
                 <div className="text-4xl font-black text-secondary flex items-baseline gap-1">
                  <span className="text-2xl opacity-60">$</span>
                  {service.price}
                  <span className="text-sm text-on-surface-muted ml-2 font-bold lowercase tracking-normal">
                    {service.pricingType === "hourly" ? "per hour" : "fixed price"}
                  </span>
                </div>
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
                    <span className="text-[11px] font-black uppercase tracking-tighter text-on-surface-muted">Provider</span>
                    <span className="font-extrabold text-white group-hover:text-primary transition-colors">{service.providerId.fullName}</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase">
                  Verified
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a href={`mailto:${service.providerId.email}`} className="no-underline">
                  <DashboardButton variant="gradient" size="lg" className="w-full h-16 text-lg font-black shadow-xl shadow-primary/20" icon={MessageCircle}>
                    Hire Student
                  </DashboardButton>
                </a>
                <DashboardButton variant="outline" size="lg" className="w-full h-14 border-white/10 hover:bg-white/5" icon={Share2}>
                  Share Service
                </DashboardButton>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-black text-white">Trust & Quality</p>
                  <p className="text-[11px] text-on-surface-muted">Review previous work or ask for a portfolio.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={18} className="text-secondary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-black text-white">Highly Rated</p>
                  <p className="text-[11px] text-on-surface-muted">Student is known for timely delivery.</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          <div className="p-6 rounded-2xl bg-linear-to-br from-primary/5 to-secondary/5 border border-white/5 flex flex-col gap-4">
             <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 size={20} />
                <h4 className="text-sm font-black uppercase tracking-widest">Why Hire on Campus?</h4>
             </div>
            <ul className="text-[12px] text-on-surface-muted leading-relaxed list-disc pl-4 flex flex-col gap-2 font-medium">
              <li>Affordable student-friendly rates</li>
              <li>Face-to-face meetings available on campus</li>
              <li>Support your fellow students' side hustles</li>
              <li>Quick turnaround for campus projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
