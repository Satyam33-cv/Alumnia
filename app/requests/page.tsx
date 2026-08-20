import type { Metadata } from "next";
import { RoleShell } from "@/components/RoleShell";
import { RequestsContent } from "@/components/RequestsContent";

export const metadata: Metadata = { title: "Referral Threads | AlumniConnect" };

export default function RequestsPage() {
	return <RoleShell><RequestsContent /></RoleShell>;
}