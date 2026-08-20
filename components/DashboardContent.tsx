"use client";

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { AlumniCard } from "@/components/AlumniCard";
import { ReferralThread } from "@/components/ReferralThread";
import { Card, EmptyState, ErrorState, Skeleton } from "@/components/ui";
import { apiClient } from "@/lib/api/client";
import type { Alumni, ReferralRequest, User, Job } from "@/lib/api/types";
import { useApi } from "@/lib/hooks/useApi";

type DashboardData = { user: User; alumni: Alumni[]; jobs: Job[]; requests: ReferralRequest[] };

async function fetchDashboard(): Promise<DashboardData> {
  const [user, alumni, jobs, requests] = await Promise.all([
    apiClient.auth.me(),
    apiClient.alumni.list(),
    apiClient.jobs.list(),
    apiClient.requests.list(),
  ]);
  return { user, alumni, jobs, requests };
}

export function DashboardContent() {
  const { data, error, isLoading, refresh } = useApi("dashboard", fetchDashboard);

  if (isLoading) {
    return <div className="space-y-12" aria-busy="true" aria-label="Loading dashboard"><div><Skeleton className="mb-4 h-3 w-36" /><Skeleton className="h-14 max-w-xl" /><Skeleton className="mt-4 h-4 max-w-md" /></div><div className="grid gap-4 md:grid-cols-3"><Skeleton variant="card" className="h-64" /><Skeleton variant="card" className="h-64" /><Skeleton variant="card" className="h-64" /></div></div>;
  }

  if (error) {
    return <ErrorState title="Your dashboard is unavailable" body={error.message} retry={() => void refresh()} />;
  }

  if (!data) return null;

  const firstName = data.user.name.split(" ")[0] || "there";
  const activeRequest = data.requests.find((request) => request.status === "accepted" || request.status === "pending");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">Your network</p><h1 className="mt-2 font-display text-5xl tracking-tight">Good morning, {firstName}.</h1><p className="mt-3 text-sm text-ink-900/55">Here is what is moving in your network.</p></div>
        <Link href="/directory" className="group inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2.5 text-sm font-semibold hover:border-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2">Browse the directory <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
      </div>

      <section className="mt-12" aria-labelledby="people-heading">
        <div className="mb-5 flex items-baseline justify-between gap-4"><h2 id="people-heading" className="font-display text-3xl">People worth knowing</h2><span className="font-mono text-[10px] uppercase tracking-wider text-ink-900/45">Matched to your interests</span></div>
        {data.alumni.length > 0 ? <div className="grid gap-4 md:grid-cols-3">{data.alumni.slice(0, 3).map((alumni) => <AlumniCard key={alumni.id} alumni={alumni} />)}</div> : <EmptyState title="Your network is waiting" body="Browse the directory to find people matched to your interests." action={<Link href="/directory" className="font-semibold text-sage-500 underline underline-offset-4">Browse the directory</Link>} />}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div aria-labelledby="jobs-heading"><div className="mb-5 flex items-baseline justify-between"><h2 id="jobs-heading" className="font-display text-3xl">Open doors</h2><Link href="/jobs" className="text-xs font-semibold text-sage-500 underline underline-offset-4">View all</Link></div>{data.jobs.length > 0 ? <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">{data.jobs.slice(0, 4).map((job) => <Link href={`/jobs/${job.id}`} key={job.id} className="group flex items-center gap-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500"><div className="flex h-10 w-10 shrink-0 items-center justify-center bg-brass-500/15 text-brass-500"><BriefcaseBusiness size={18} /></div><div className="flex-1"><h3 className="text-sm font-semibold group-hover:text-brass-500">{job.title}</h3><p className="mt-1 text-xs text-ink-900/50">{job.company} · {job.location}</p></div><span className="hidden font-mono text-[10px] uppercase text-ink-900/40 sm:block">{job.posted}</span></Link>)}</div> : <EmptyState title="No open roles yet" body="New opportunities shared by your network will appear here." />}</div>
        <Card padding="lg"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-wider text-brass-500">Your active thread</p><h2 className="mt-2 font-display text-2xl">{activeRequest ? `${activeRequest.recipient.name}` : "Start a conversation"}</h2></div>{activeRequest ? <span className="font-mono text-[10px] text-ink-900/45">{activeRequest.status}</span> : null}</div>{activeRequest ? <><p className="mt-2 text-xs text-ink-900/55">{activeRequest.message}</p><div className="mt-8"><ReferralThread status={activeRequest.status === "accepted" ? "accepted" : "pending"} /></div></> : <p className="mt-4 text-sm leading-6 text-ink-900/60">Browse the directory to find someone who can help with your next move.</p>}</Card>
      </section>
    </>
  );
}
