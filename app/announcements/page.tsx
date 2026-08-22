import type { Metadata } from "next";
import { AnnouncementsContent } from "@/components/AnnouncementsContent";
import { RoleShell } from "@/components/RoleShell";

export const metadata: Metadata = {
  title: "Announcements | PRO ALUMN",
  description: "Stay up to date with the latest announcements and updates from your alumni network",
};

export default function AnnouncementsPage() {
  return (
    <RoleShell>
      <AnnouncementsContent />
    </RoleShell>
  );
}
