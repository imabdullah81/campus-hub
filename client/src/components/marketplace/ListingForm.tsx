"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import {
  Upload,
  X,
  Info,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";

interface Image {
  url: string;
  public_id: string;
}

interface ListingFormData {
  title: string;
  description: string;
  price: string | number;
  category: string;
  condition: string;
  location: string;
  images: Image[];
}

interface ListingFormProps {
  initialData?: ListingFormData;
  onSubmit: (data: any) => Promise<void>;
  submitButtonText?: string;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ListingForm({
  initialData,
  onSubmit,
  submitButtonText = "Publish Listing",
  onCancel,
  isLoading: externalLoading = false
}: ListingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>(initialData?.images || []);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "Others",
    condition: initialData?.condition || "Used",
    location: initialData?.location || "",
  });

  const categories = ["Books", "Laptops", "Accessories", "Hostel Items", "Furniture", "Others"];
  const conditions = ["New", "Like New", "Used"];

  // Update form data if initialData changes (for Edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        condition: initialData.condition,
        location: initialData.location,
      });
      setImages(initialData.images);
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const { data: signData } = await axios.get("/upload/sign");

      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("api_key", signData.apiKey);
        uploadData.append("timestamp", signData.timestamp.toString());
        uploadData.append("signature", signData.signature);
        uploadData.append("folder", "listings");

        const cloudName = signData.cloudName;
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: uploadData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const cloudRes = await res.json();
        return {
          url: cloudRes.secure_url,
          public_id: cloudRes.public_id,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
    } catch (err) {
      setError("Failed to upload images. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    
    setError(null);
    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        images,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const combinedLoading = loading || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-fade-in">
      <DashboardCard className="p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">What are you selling?</label>
              <div className="bg-white/5 border border-outline-variant rounded-md focus-within:border-primary/50 transition-all">
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical Engineering Textbooks"
                  className="w-full p-4 bg-transparent border-none outline-none text-white text-base placeholder:text-on-surface-muted/30"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Description</label>
              <div className="bg-white/5 border border-outline-variant rounded-md focus-within:border-primary/50 transition-all">
                <textarea
                  required
                  placeholder="Tell buyers about the condition, age, and features..."
                  rows={6}
                  className="w-full p-4 bg-transparent border-none outline-none text-white text-base resize-none placeholder:text-on-surface-muted/30"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Category</label>
                <select
                  className="h-14 bg-surface-bright/50 border border-outline-variant rounded-md px-4 text-white text-base outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Condition</label>
                <select
                  className="h-14 bg-surface-bright/50 border border-outline-variant rounded-md px-4 text-white text-base outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  {conditions.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Price</label>
                <div className="flex items-center gap-3 bg-white/5 border border-outline-variant rounded-md px-4 focus-within:border-primary/50 transition-all">
                  <DollarSign size={18} className="text-on-surface-muted" />
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full py-4 bg-transparent border-none outline-none text-white text-base placeholder:text-on-surface-muted/30"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Pickup Location</label>
                <div className="flex items-center gap-3 bg-white/5 border border-outline-variant rounded-md px-4 focus-within:border-primary/50 transition-all">
                  <MapPin size={18} className="text-on-surface-muted" />
                  <input
                    type="text"
                    placeholder="e.g. Hall 3 Lounge"
                    className="w-full py-4 bg-transparent border-none outline-none text-white text-base placeholder:text-on-surface-muted/30"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Media */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Item Media</label>
              <div className="flex flex-col gap-4">
                <div className="relative group min-h-[200px] border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-4 transition-all hover:border-primary hover:bg-primary/5">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleImageUpload}
                    disabled={combinedLoading}
                  />
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white mb-1">Click to upload images</p>
                    <p className="text-xs text-on-surface-muted">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-md overflow-hidden relative group border border-outline-variant">
                      <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
                        onClick={() => handleRemoveImage(i)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {loading && (
                    <div className="aspect-square rounded-md bg-white/5 border border-outline-variant flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {images.length === 0 && !loading && (
                  <div className="flex items-center gap-3 p-4 rounded-md bg-primary/5 text-primary text-[12px] font-bold border border-primary/10">
                    <Info size={14} className="shrink-0" />
                    <span>Upload at least one clear photo of your item.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto p-6 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">Campus Verified</p>
                <p className="text-xs text-on-surface-muted leading-relaxed">Your listing will only be visible to verified students.</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 rounded-md bg-error/10 border border-error/20 text-error flex items-center gap-3 text-sm font-bold animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-outline-variant flex justify-end gap-4">
          <DashboardButton type="button" variant="ghost" onClick={onCancel} disabled={combinedLoading}>
            Cancel
          </DashboardButton>
          <DashboardButton type="submit" variant="gradient" isLoading={combinedLoading} className="px-10">
            {submitButtonText}
          </DashboardButton>
        </div>
      </DashboardCard>
    </form>
  );
}
