import type { Metadata } from "next";
import { GivingContent } from "@/components/GivingContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Giving | AlumniConnect" };

export default function GivingPage() {
  return <RoleShell><GivingContent /></RoleShell>;
}
