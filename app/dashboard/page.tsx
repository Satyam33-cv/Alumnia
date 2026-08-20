import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = {
  title: "Dashboard | AlumniConnect",
  description: "Personalized greeting and at-a-glance activity",
  openGraph: {
    title: "Dashboard - AlumniConnect",
    description: "Personalized greeting and at-a-glance activity",
    images: ["https://alumni-connect.example.com/og-dashboard.png"],
  },
  twitter: {
    title: "Dashboard - AlumniConnect",
    description: "Personalized greeting and at-a-glance activity",
    card: "summary_large_image",
  },
};

export default function DashboardPage() {
  return <RoleShell><HomeContent /></RoleShell>;
}