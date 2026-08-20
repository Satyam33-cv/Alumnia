import type { Metadata } from "next";
import { ProfileContent } from "@/components/ProfileContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = { title: "Profile | AlumniConnect" };

export default function ProfilePage() {
  return <RoleShell><ProfileContent /></RoleShell>;
}
