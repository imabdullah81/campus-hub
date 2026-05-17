"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ServiceForm } from "@/components/services/ServiceForm";
import axios from "@/lib/axios";

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/services/${id}`);
        setInitialData(data.data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
        router.push("/services/my-services");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    await axios.put(`/services/${id}`, data);
    router.push("/services/my-services");
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-3 border-outline-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-muted font-medium">Fetching service details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      <DashboardHeader 
        title="Edit Your" 
        gradientTitle="Service"
        subtitle="Keep your skills and pricing up to date."
      />

      <div className="max-w-5xl">
        <ServiceForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/services/my-services")}
          submitButtonText="Update Service"
        />
      </div>
    </div>
  );
}
