"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ListingForm } from "@/components/marketplace/ListingForm";

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios.post("/listings", data);
      router.push("/marketplace");
      router.refresh();
    } catch (err) {
      throw err; // Let ListingForm handle the error display
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12 max-w-[1100px] mx-auto">
      {/* ── Navigation Header ── */}
      <div className="flex">
        <Link href="/marketplace" className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full no-underline text-on-surface-muted text-[13px] font-bold transition-all glass-panel hover:text-primary hover:bg-primary/5 hover:border-primary/40">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <DashboardHeader
        title="Post a New"
        gradientTitle="Listing"
        subtitle="Turn your unused items into cash. Reach thousands of students on campus."
      />

      <ListingForm 
        onSubmit={handleSubmit} 
        onCancel={() => router.back()} 
        isLoading={loading}
      />
    </div>
  );
}
