import type { Metadata } from "next";
import { AdminContent } from "@/components/AdminContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Command Center | AlumniConnect" };

export default function AdminPage() {
	return <RoleShell role="admin"><AdminContent /></RoleShell>;
}