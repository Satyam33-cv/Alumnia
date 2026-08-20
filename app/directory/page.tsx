import type { Metadata } from "next";
import { DirectoryContent } from "@/components/DirectoryContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Directory | AlumniConnect", description: "Find alumni by experience, company, role, and location." };

export default function DirectoryPage() {
	return <RoleShell><DirectoryContent /></RoleShell>;
}