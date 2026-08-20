import type { Metadata } from "next";
import { JobListContent } from "@/components/JobListContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Jobs | AlumniConnect", description: "Explore roles shared by your alumni network." };

export default function JobsPage() {
	return <RoleShell><JobListContent /></RoleShell>;
}