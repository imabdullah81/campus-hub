"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Info, 
  Image as ImageIcon,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; public_id: string }[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Others",
    condition: "Used",
    location: "",
  });

  const categories = ["Books", "Laptops", "Accessories", "Hostel Items", "Furniture", "Others"];
  const conditions = ["New", "Like New", "Used"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
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
        
        const cloudRes = await res.json();
        return {
          url: cloudRes.secure_url,
          public_id: cloudRes.public_id,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedImages]);
    } catch (err) {
      setError("Failed to upload images. Please check your configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await axios.post("/listings", {
        ...formData,
        price: Number(formData.price),
        images,
      });
      router.push("/marketplace");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-view animate-fade-in">
      {/* ── Navigation Header ── */}
      <div className="nav-header">
        <Link href="/marketplace" className="back-link glass-panel">
          <ArrowLeft size={18} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="page-intro">
        <h1 className="text-4xl font-bold mb-3">Post a New Listing</h1>
        <p className="text-muted">Turn your unused items into cash. Reach thousands of students on campus.</p>
      </div>

      <form onSubmit={handleSubmit} className="premium-form glass-panel">
        <div className="form-layout">
          {/* Left: Content */}
          <div className="main-fields">
            <div className="field-group">
              <label>What are you selling?</label>
              <div className="input-box glass-panel">
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Mechanical Engineering Textbooks"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Description</label>
              <div className="textarea-box glass-panel">
                <textarea 
                  required 
                  placeholder="Tell buyers about the condition, age, and features..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="field-group">
                <label>Category</label>
                <select 
                  className="glass-select"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Condition</label>
                <select 
                  className="glass-select"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="field-group">
                <label>Price</label>
                <div className="input-box glass-panel icon-left">
                  <DollarSign size={16} className="icon" />
                  <input 
                    type="number" 
                    required 
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="field-group">
                <label>Pickup Location</label>
                <div className="input-box glass-panel icon-left">
                  <MapPin size={16} className="icon" />
                  <input 
                    type="text" 
                    placeholder="e.g. Hall 3 Lounge"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Media */}
          <div className="media-fields">
            <div className="field-group">
              <label>Item Media</label>
              <div className="upload-container">
                <div className="drop-zone glass-panel">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={loading}
                  />
                  <div className="zone-content">
                    <div className="icon-circle">
                      <Upload size={24} />
                    </div>
                    <p className="primary-text">Click to upload images</p>
                    <p className="secondary-text">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <div className="preview-grid">
                  {images.map((img, i) => (
                    <div key={i} className="preview-card glass-panel">
                      <img src={img.url} alt="Preview" />
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {loading && (
                    <div className="preview-card glass-panel loading">
                      <div className="mini-spinner" />
                    </div>
                  )}
                </div>

                {images.length === 0 && !loading && (
                  <div className="empty-media-tip">
                    <Info size={14} />
                    <span>Upload at least one clear photo of your item.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="guarantee-box glass-panel">
              <div className="icon-wrap">
                <CheckCircle2 size={24} className="text-primary" />
              </div>
              <div>
                <p className="tip-title">Campus Verified</p>
                <p className="tip-text">Your listing will only be visible to verified students.</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner glass-panel">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-footer">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="btn-cancel"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-submit gradient-btn"
          >
            {loading ? "Processing..." : "Publish Listing"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .sell-view {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .nav-header {
          display: flex;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          text-decoration: none;
          color: var(--on-surface-muted);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .back-link:hover {
          color: var(--primary);
          background: rgba(59, 130, 246, 0.05);
          border-color: var(--primary-glow);
        }

        .text-muted { color: var(--on-surface-muted); }

        .premium-form {
          border-radius: var(--radius-xl);
          padding: 48px;
          background: rgba(22, 29, 47, 0.6);
        }

        .form-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 48px;
        }

        .main-fields {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .field-group label {
          font-size: 14px;
          font-weight: 700;
          color: var(--on-surface);
          margin-left: 4px;
        }

        .input-box, .textarea-box {
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          padding: 4px;
          transition: all 0.2s;
        }

        .input-box:focus-within, .textarea-box:focus-within {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .input-box input, .textarea-box textarea {
          width: 100%;
          padding: 12px 14px;
          background: none;
          border: none;
          outline: none;
          color: white;
          font-size: 15px;
        }

        .icon-left {
          display: flex;
          align-items: center;
          padding-left: 16px;
        }

        .icon-left .icon { color: var(--on-surface-muted); }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .glass-select {
          height: 52px;
          background: rgba(22, 29, 47, 0.8);
          border: 1px solid var(--outline-variant);
          border-radius: var(--radius-md);
          padding: 0 16px;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .media-fields {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .upload-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .drop-zone {
          height: 180px;
          border: 2px dashed var(--outline-variant);
          border-radius: var(--radius-lg);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .drop-zone:hover {
          border-color: var(--primary);
          background: rgba(59, 130, 246, 0.05);
        }

        .drop-zone input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .zone-content { text-align: center; }

        .icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--surface-container-high);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--primary);
        }

        .primary-text { font-weight: 700; color: white; margin-bottom: 4px; }
        .secondary-text { font-size: 12px; color: var(--on-surface-muted); }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
        }

        .preview-card {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          position: relative;
          overflow: hidden;
        }

        .preview-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-container-low);
        }

        .mini-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--outline-subtle);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-media-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--on-surface-muted);
          background: rgba(59, 130, 246, 0.05);
          padding: 10px;
          border-radius: var(--radius-sm);
        }

        .guarantee-box {
          margin-top: auto;
          padding: 20px;
          border-radius: var(--radius-lg);
          display: flex;
          gap: 16px;
          align-items: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        }

        .tip-title { font-weight: 800; font-size: 15px; color: white; }
        .tip-text { font-size: 13px; color: var(--on-surface-muted); }

        .error-banner {
          margin-top: 32px;
          padding: 16px;
          border-radius: var(--radius-md);
          background: rgba(255, 180, 171, 0.1);
          border-color: rgba(255, 180, 171, 0.2);
          color: var(--error);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .form-footer {
          margin-top: 48px;
          display: flex;
          justify-content: flex-end;
          gap: 20px;
          padding-top: 32px;
          border-top: 1px solid var(--outline-subtle);
        }

        .btn-cancel {
          padding: 14px 28px;
          background: none;
          border: none;
          color: var(--on-surface-muted);
          font-weight: 700;
          cursor: pointer;
        }

        .btn-submit {
          padding: 14px 40px;
          border-radius: var(--radius-full);
          font-weight: 800;
          font-size: 15px;
        }

        @media (max-width: 900px) {
          .form-layout { grid-template-columns: 1fr; }
          .premium-form { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
