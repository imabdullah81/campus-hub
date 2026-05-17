"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ServiceForm } from "@/components/services/ServiceForm";
import axios from "@/lib/axios";

export default function CreateServicePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await axios.post("/services", data);
    router.push("/services/my-services");
  };

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      <DashboardHeader 
        title="Post a" 
        gradientTitle="Service"
        subtitle="Offer your skills to the campus community and start earning."
      />

      <div className="max-w-5xl">
        <ServiceForm 
          onSubmit={handleSubmit}
          onCancel={() => router.push("/services")}
          submitButtonText="Publish Service"
        />
      </div>
    </div>
  );
}
