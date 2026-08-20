import type { Metadata } from "next";
import { DirectoryContent } from "@/components/DirectoryContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Network | AlumniConnect" };

export default function NetworkPage() {
  return <RoleShell><DirectoryContent /></RoleShell>;
}
