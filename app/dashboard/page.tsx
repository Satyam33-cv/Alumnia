import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Dashboard | AlumniConnect" };

export default function DashboardPage() {
  return <RoleShell><HomeContent /></RoleShell>;
}