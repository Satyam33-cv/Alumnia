"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Activity,
  BriefcaseBusiness,
  Clock,
  CalendarDays,
  ShieldCheck,
  FileUp,
  Inbox,
  Target,
  Timer,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useApi } from "@/lib/hooks/useApi";
import { stories } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui";

type MetricCard = {
  label: string;
  value: string | number;
  icon: typeof Users;
};

type FunnelBar = {
  label: string;
  count: number;
  color: string;
};

type VerificationAlumni = {
  name: string;
  email: string;
  batch: string;
};

type AnalyticsStat = {
  label: string;
  value: string;
  icon: typeof Users;
};

type AdminApiData = {
  metrics: import("@/lib/api/types").AdminMetrics;
  requests: import("@/lib/api/types").ReferralRequest[];
  upcomingEvents: import("@/lib/api/types").EventItem[];
};

const pendingStories = stories.filter((s) => s.status === "pending");

export function AdminContent() {
  const [verification, setVerification] = useState<Record<number, "approved" | "rejected">>({});
  const [storyModeration, setStoryModeration] = useState<Record<string, "approved" | "rejected">>({});
  const { data: apiData, error, isLoading, refresh } = useApi("admin:metrics", async () => {
    const [
      metrics,
      requests,
      upcomingEvents,
    ] = await Promise.all([
      apiClient.admin.metrics(),
      apiClient.requests.list(),
      apiClient.events.list(),
    ]);
    return { metrics, requests, upcomingEvents } as AdminApiData;
  });

  const statCards: MetricCard[] = apiData
    ? [
        { label: "Total Members", value: apiData.metrics.members, icon: Users },
        { label: "Active Members", value: apiData.metrics.activeMembers, icon: Activity },
        { label: "Open Jobs", value: apiData.metrics.openJobs, icon: BriefcaseBusiness },
        { label: "Pending Requests", value: apiData.metrics.pendingRequests, icon: Clock },
        { label: "Upcoming Events", value: apiData.metrics.upcomingEvents, icon: CalendarDays },
        { label: "Verified Alumni", value: apiData.metrics.verifiedAlumni ?? 0, icon: ShieldCheck },
      ]
    : [
        { label: "Total Members", value: 1247, icon: Users },
        { label: "Active Members", value: 892, icon: Activity },
        { label: "Open Jobs", value: 24, icon: BriefcaseBusiness },
        { label: "Pending Requests", value: 18, icon: Clock },
        { label: "Upcoming Events", value: 6, icon: CalendarDays },
        { label: "Verified Alumni", value: 456, icon: ShieldCheck },
      ];

  const funnelBars: FunnelBar[] = apiData
    ? [
        { label: "Pending", count: apiData.metrics.pendingRequests, color: "bg-brass-500" },
        { label: "Active", count: apiData.metrics.activeMembers, color: "bg-sage-500" },
        { label: "Open Jobs", count: apiData.metrics.openJobs, color: "bg-primary" },
        { label: "Hired", count: apiData.metrics.hiredThroughReferrals ?? 0, color: "bg-tertiaryOnContainer" },
      ]
    : [
        { label: "Pending", count: 45, color: "bg-brass-500" },
        { label: "Accepted", count: 67, color: "bg-sage-500" },
        { label: "Rejected", count: 12, color: "bg-clay-500" },
        { label: "Referred", count: 34, color: "bg-primaryContainer" },
        { label: "Hired", count: 18, color: "bg-tertiaryOnContainer" },
      ];

  const maxFunnel = Math.max(...funnelBars.map((b) => b.count));

  const verificationQueue: VerificationAlumni[] = apiData
    ? [
        { name: "Olivia Chen", email: "olivia.chen@alumni.edu", batch: "2021" },
        { name: "James Wright", email: "j.wright@alumni.edu", batch: "2020" },
        { name: "Sophia Patel", email: "sophia.p@alumni.edu", batch: "2022" },
      ]
    : [
        { name: "Olivia Chen", email: "olivia.chen@alumni.edu", batch: "2021" },
        { name: "James Wright", email: "j.wright@alumni.edu", batch: "2020" },
        { name: "Sophia Patel", email: "sophia.p@alumni.edu", batch: "2022" },
      ];

  const csvErrors = [
    { name: "Row 14 — Marcus Lee", error: "Invalid email format" },
    { name: "Row 27 — Ana Ruiz", error: "Missing graduation year" },
    { name: "Row 31 — Tom NG", error: "Duplicate entry" },
  ];

  const analyticsStats = [
    { label: "Response Time", value: "2.4h avg", icon: Timer },
    { label: "Match Engagement", value: "78% relevance", icon: Target },
    { label: "Admin Turnaround", value: "4.2h avg", icon: Clock },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
    }),
  };

  if (isLoading) {
    return <div className="space-y-12" aria-busy="true" aria-label="Loading admin"><div className="grid grid-cols-2 gap-4 md:grid-cols-3"><Skeleton className="p-5" /><Skeleton className="p-5" /><Skeleton className="p-5" /><Skeleton className="p-5" /><Skeleton className="p-5" /><Skeleton className="p-5" /></div></div>;
  }

  if (error) {
    return <p className="text-red-500">Error loading admin data: {error.message}</p>;
  }

  return (
    <div className="space-y-12">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">
          Command Center
        </p>
        <h1 className="mt-2 font-display text-5xl">Admin Overview</h1>
        <p className="mt-3 text-sm text-ink-900/55">
          Manage your alumni network
        </p>
      </div>

      <section>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="rounded-lg border border-ink-900/10 bg-white/70 p-5"
            >
              <stat.icon size={20} className="text-brass-500" />
              <p className="mt-4 font-display text-4xl tracking-tight">
                {stat.value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-ink-900/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-lg border border-ink-900/10 bg-white/70 p-6"
        >
          <h2 className="font-display text-2xl">Referral Funnel</h2>
          <div className="mt-6 space-y-3">
            {funnelBars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-ink-900/60">
                  {bar.label}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-ink-900/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(bar.count / maxFunnel) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    className={`h-full rounded min-w-[20px] ${bar.color}`}
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs text-ink-900/70">
                  {bar.count}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-lg border border-ink-900/10 bg-white/70 p-6"
        >
          <h2 className="font-display text-2xl">Verification Queue</h2>
          <div className="mt-5 divide-y divide-ink-900/5">
            {verificationQueue.map((alumni, i) => (
              <div key={alumni.email} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900/5 text-xs font-medium text-ink-900/70">
                  {alumni.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{alumni.name}</p>
                  <p className="truncate text-xs text-ink-900/45">
                    {alumni.email} · {alumni.batch}
                  </p>
                </div>
                <AnimatePresence mode="wait">
                  {verification[i] ? (
                    <motion.span
                      key={verification[i]}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        verification[i] === "approved"
                          ? "bg-sage-500/10 text-sage-500"
                          : "bg-clay-500/10 text-clay-500"
                      }`}
                    >
                      {verification[i] === "approved" ? (
                        <>
                          <CheckCircle2 size={12} /> Approved ✓
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Rejected
                        </>
                      )}
                    </motion.span>
                  ) : (
                    <motion.div
                      key="buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2"
                    >
                      <button
                        onClick={() =>
                          setVerification((prev) => ({ ...prev, [i]: "approved" }))
                        }
                        className="rounded-full bg-sage-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-sage-500/80"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setVerification((prev) => ({ ...prev, [i]: "rejected" }))
                        }
                        className="rounded-full border border-clay-500 px-3 py-1 text-xs font-medium text-clay-500 transition-colors hover:bg-clay-500/5"
                      >
                        Reject
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="rounded-lg border border-ink-900/10 bg-white/70 p-6"
      >
        <h2 className="font-display text-2xl">Bulk Import</h2>
        <div className="mt-5 rounded-lg border-2 border-dashed border-ink-900/20 p-8 text-center">
          <FileUp size={32} className="mx-auto text-ink-900/30" />
          <p className="mt-3 text-sm text-ink-900/60">
            Drop CSV file here or{" "}
            <span className="cursor-pointer text-brass-500 underline">
              browse
            </span>
          </p>
          <p className="mt-1 text-xs text-ink-900/35">
            Supports .csv files with alumni data
          </p>
        </div>
        <button className="mt-5 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-brass-500/80">
          Upload roster
        </button>
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-900/45">
            Error Report
          </p>
          <div className="mt-3 overflow-hidden rounded-lg border border-ink-900/10">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-900/10 bg-ink-900/5">
                  <th className="px-4 py-2 font-medium text-ink-900/60">Name</th>
                  <th className="px-4 py-2 font-medium text-ink-900/60">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {csvErrors.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-2.5 text-ink-900/70">{row.name}</td>
                    <td className="px-4 py-2.5 text-clay-500">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="rounded-lg border border-ink-900/10 bg-white/70 p-6"
      >
        <h2 className="font-display text-2xl">Story Moderation</h2>
        <div className="mt-5 space-y-4">
          {pendingStories.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <Inbox size={32} className="text-ink-900/20" />
              <p className="mt-2 text-sm text-ink-900/40">
                No stories pending review
              </p>
            </div>
          )}
          {pendingStories.map((story) => (
            <div
              key={story.id}
              className="rounded-lg border border-ink-900/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{story.title}</p>
                  <p className="mt-0.5 text-xs text-ink-900/45">
                    {story.author} · {story.batch} · {story.company}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-900/55">
                    {story.excerpt}
                  </p>
                </div>
                <AnimatePresence mode="wait">
                  {storyModeration[story.id] ? (
                    <motion.span
                      key={storyModeration[story.id]}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        storyModeration[story.id] === "approved"
                          ? "bg-sage-500/10 text-sage-500"
                          : "bg-clay-500/10 text-clay-500"
                      }`}
                    >
                      {storyModeration[story.id] === "approved" ? (
                        <>
                          <CheckCircle2 size={12} /> Approved ✓
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Rejected
                        </>
                      )}
                    </motion.span>
                  ) : (
                    <motion.div
                      key="mod-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex shrink-0 gap-2"
                    >
                      <button
                        onClick={() =>
                          setStoryModeration((prev) => ({
                            ...prev,
                            [story.id]: "approved",
                          }))
                        }
                        className="rounded-full bg-sage-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-sage-500/80"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setStoryModeration((prev) => ({
                            ...prev,
                            [story.id]: "rejected",
                          }))
                        }
                        className="rounded-full border border-clay-500 px-3 py-1 text-xs font-medium text-clay-500 transition-colors hover:bg-clay-500/5"
                      >
                        Reject
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {analyticsStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.07, duration: 0.4 }}
            className="rounded-lg border border-ink-900/10 bg-white/70 p-5"
          >
            <stat.icon size={18} className="text-brass-500" />
            <p className="mt-3 font-display text-2xl tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-ink-900/50">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
