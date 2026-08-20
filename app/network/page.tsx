import type { Metadata } from "next";
import { DirectoryContent } from "@/components/DirectoryContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = {
  title: "Network | AlumniConnect",
  description: "Find and connect with alumni across your network",
  openGraph: {
    title: "Network - AlumniConnect",
    description: "Find and connect with alumni across your network",
    images: ["https://alumni-connect.example.com/og-network.png"],
  },
  twitter: {
    title: "Network - AlumniConnect",
    description: "Find and connect with alumni across your network",
    card: "summary_large_image",
  },
};

export default async function NetworkPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <RoleShell><DirectoryContent initialQuery={searchParams?.q ?? ""} /></RoleShell>;
}
