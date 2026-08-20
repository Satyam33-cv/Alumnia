import type { Metadata } from "next";
import { MentorshipContent } from "@/components/MentorshipContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Mentorship | AlumniConnect" };

export default function MentorshipPage() {
  return <RoleShell><MentorshipContent /></RoleShell>;
}
