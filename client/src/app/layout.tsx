import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CampusHub — Elevating Student Commerce",
    template: "%s | CampusHub",
  },
  description:
    "Join thousands of students buying, selling, and connecting in a trusted ecosystem built specifically for university life.",
  keywords: ["campus", "student marketplace", "university", "buy sell"],
  authors: [{ name: "CampusHub" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
