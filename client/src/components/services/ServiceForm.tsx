"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import {
  Upload,
  X,
  Info,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";

interface Image {
  url: string;
  public_id: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string | number;
  category: string;
  pricingType: string;
  skills: string[];
  availability: string;
  images: Image[];
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  onSubmit: (data: any) => Promise<void>;
  submitButtonText?: string;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServiceForm({
  initialData,
  onSubmit,
  submitButtonText = "Publish Service",
  onCancel,
  isLoading: externalLoading = false
}: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>(initialData?.images || []);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "Tutoring",
    pricingType: initialData?.pricingType || "fixed",
    availability: initialData?.availability || "",
  });

  const categories = ["Tutoring", "Design", "Programming", "Writing", "Marketing", "Others"];
  const pricingTypes = [
    { label: "Fixed Price", value: "fixed" },
    { label: "Hourly Rate", value: "hourly" }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        pricingType: initialData.pricingType,
        availability: initialData.availability,
      });
      setImages(initialData.images);
      setSkills(initialData.skills);
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const { data: signData } = await axios.get("/upload/sign?folder=services");

      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("api_key", signData.apiKey);
        uploadData.append("timestamp", signData.timestamp.toString());
        uploadData.append("signature", signData.signature);
        uploadData.append("folder", "services");

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

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
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
        skills,
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
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Service Title</label>
              <div className="bg-white/5 border border-outline-variant rounded-md focus-within:border-primary/50 transition-all">
                <input
                  type="text"
                  required
                  placeholder="e.g. Professional UI/UX Design for Projects"
                  className="w-full p-4 bg-transparent border-none outline-none text-white text-base placeholder:text-on-surface-muted/30"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Service Description</label>
              <div className="bg-white/5 border border-outline-variant rounded-md focus-within:border-primary/50 transition-all">
                <textarea
                  required
                  placeholder="Describe what you offer, your experience, and what the buyer gets..."
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
                <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Pricing Model</label>
                <select
                  className="h-14 bg-surface-bright/50 border border-outline-variant rounded-md px-4 text-white text-base outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all"
                  value={formData.pricingType}
                  onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                >
                  {pricingTypes.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
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
                  {formData.pricingType === "hourly" && <span className="text-on-surface-muted text-sm pr-2">/hr</span>}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Availability</label>
                <div className="flex items-center gap-3 bg-white/5 border border-outline-variant rounded-md px-4 focus-within:border-primary/50 transition-all">
                  <Clock size={18} className="text-on-surface-muted" />
                  <input
                    type="text"
                    placeholder="e.g. Weekends, 6pm - 10pm"
                    className="w-full py-4 bg-transparent border-none outline-none text-white text-base placeholder:text-on-surface-muted/30"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Skills & Tools (Tags)</label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 border border-outline-variant rounded-md focus-within:border-primary/50 transition-all">
                    <input
                      type="text"
                      placeholder="Press Enter or Click + to add"
                      className="w-full p-4 bg-transparent border-none outline-none text-white text-base placeholder:text-on-surface-muted/30"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="w-14 h-14 rounded-md bg-primary text-surface flex items-center justify-center hover:bg-primary-hover transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <div key={skill} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-bright border border-outline-subtle text-sm font-semibold text-white">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-on-surface-muted hover:text-error transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Media */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-extrabold uppercase tracking-widest text-on-surface-muted ml-1">Service Images</label>
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
                    <p className="text-xs text-on-surface-muted">Showcase your portfolio or workspace</p>
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
                    <span>Adding images increases your chances of getting hired.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto p-6 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary shrink-0">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">Professional Profile</p>
                <p className="text-xs text-on-surface-muted leading-relaxed">Your service will be showcased to the entire campus community.</p>
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
