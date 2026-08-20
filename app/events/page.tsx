import type { Metadata } from "next";
import { EventListContent } from "@/components/EventListContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Events | AlumniConnect", description: "Make time for gatherings, panels, and alumni conversations." };

export default function EventsPage() {
	return <RoleShell><EventListContent /></RoleShell>;
}