import type { Metadata } from "next";
import { StoriesContent } from "@/components/StoriesContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Stories | AlumniConnect" };

export default function StoriesPage() {
  return <RoleShell><StoriesContent /></RoleShell>;
}
