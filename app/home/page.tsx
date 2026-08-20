import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Home | AlumniConnect" };

export default function HomePage() {
  return <RoleShell><HomeContent /></RoleShell>;
}
