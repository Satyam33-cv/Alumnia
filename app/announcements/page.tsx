"use client";

import { RoleShell } from "@/components/RoleShell";
import { Card } from "@/components/ui";
import { Megaphone, Calendar, User } from "lucide-react";
import { announcements } from "@/lib/mock-data";

export default function AnnouncementsPage() {
  return (
    <RoleShell>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Megaphone size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus & Alumni Announcements</h1>
            <p className="text-sm text-slate-500">Stay updated on university news, programs, and opportunities</p>
          </div>
        </div>

        <div className="grid gap-4">
          {announcements.map((ann) => (
            <Card key={ann.id} padding="lg" className="border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {ann.category || "General"}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">{ann.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{ann.body || ann.content}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <User size={14} /> {ann.author?.name || ann.author || "Alumni Relations"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {ann.date || (ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : "Recent")}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </RoleShell>
  );
}
