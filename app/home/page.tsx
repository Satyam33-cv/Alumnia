import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = {
  title: "Home | AlumniConnect",
  description: "Welcome to the alumni network platform",
  openGraph: {
    title: "Home - AlumniConnect",
    description: "Welcome to the alumni network platform",
    images: ["https://alumni-connect.example.com/og-home.png"],
  },
  twitter: {
    title: "Home - AlumniConnect",
    description: "Welcome to the alumni network platform",
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return <RoleShell><HomeContent /></RoleShell>;
}
