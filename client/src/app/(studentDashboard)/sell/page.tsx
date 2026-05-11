"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/marketplace/sell");
  }, [router]);
  return null;
}
