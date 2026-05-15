"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ListingForm } from "@/components/marketplace/ListingForm";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/listings/${id}`);
        setListing(data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setUpdating(true);
    try {
      await axios.put(`/listings/${id}`, data);
      router.push("/marketplace/my-listings");
      router.refresh();
    } catch (err) {
      throw err; // Let ListingForm handle the error display
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-muted font-medium">Loading listing details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="text-error font-bold text-lg">{error || "Listing not found"}</div>
        <Link href="/marketplace/my-listings" className="text-primary hover:underline">
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12 max-w-[1100px] mx-auto">
      {/* ── Navigation Header ── */}
      <div className="flex">
        <Link href="/marketplace/my-listings" className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full no-underline text-on-surface-muted text-[13px] font-bold transition-all glass-panel hover:text-primary hover:bg-primary/5 hover:border-primary/40">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Listings</span>
        </Link>
      </div>

      <DashboardHeader
        title="Edit Your"
        gradientTitle="Listing"
        subtitle="Update your item details to attract more buyers."
      />

      <ListingForm 
        initialData={listing}
        onSubmit={handleSubmit} 
        onCancel={() => router.back()} 
        isLoading={updating}
        submitButtonText="Update Listing"
      />
    </div>
  );
}
