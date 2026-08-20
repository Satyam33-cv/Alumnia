"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Send, Briefcase, ChevronRight } from "lucide-react";

type ReferralStatus = "pending" | "accepted" | "referred" | "hired";

type Referral = {
  id: string;
  alumniName: string;
  alumniInitials: string;
  company: string;
  role: string;
  status: ReferralStatus;
  date: string;
  note: string;
};

const statusConfig: Record<ReferralStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Clock },
  accepted: { label: "Accepted", color: "text-indigo", bg: "bg-indigo/5 border-indigo/20", icon: CheckCircle2 },
  referred: { label: "Referred", color: "text-cyan", bg: "bg-cyan/5 border-cyan/20", icon: Send },
  hired: { label: "Hired", color: "text-success", bg: "bg-success/5 border-success/20", icon: Briefcase },
};

const steps: { key: ReferralStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "referred", label: "Referred" },
  { key: "hired", label: "Hired" },
];

const referrals: Referral[] = [
  {
    id: "1",
    alumniName: "Priya Sharma",
    alumniInitials: "PS",
    company: "Google",
    role: "Software Engineer",
    status: "referred",
    date: "Aug 15, 2026",
    note: "Applied for L4 SWE position. Priya forwarded my resume to the hiring manager.",
  },
  {
    id: "2",
    alumniName: "Arjun Mehta",
    alumniInitials: "AM",
    company: "Microsoft",
    role: "Product Manager",
    status: "accepted",
    date: "Aug 18, 2026",
    note: "Arjun agreed to refer me for the PM role. Waiting for him to submit the internal referral.",
  },
  {
    id: "3",
    alumniName: "Sneha Reddy",
    alumniInitials: "SR",
    company: "Amazon",
    role: "Data Scientist",
    status: "pending",
    date: "Aug 20, 2026",
    note: "Request sent to Sneha for the DS role in AWS AI team.",
  },
  {
    id: "4",
    alumniName: "Vikram Patel",
    alumniInitials: "VP",
    company: "Netflix",
    role: "DevOps Engineer",
    status: "hired",
    date: "Jul 10, 2026",
    note: "Vikram referred me, cleared 5 rounds, and got the offer! Starting next month.",
  },
  {
    id: "5",
    alumniName: "Ananya Singh",
    alumniInitials: "AS",
    company: "Figma",
    role: "UX Designer",
    status: "pending",
    date: "Aug 19, 2026",
    note: "Sent referral request for the Design Systems role at Figma.",
  },
];

function StatusBadge({ status }: { status: ReferralStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.color}`}>
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

function StepIndicator({ current }: { current: ReferralStatus }) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCompleted
                    ? isCurrent
                      ? "bg-indigo text-white shadow-md shadow-indigo/25"
                      : "bg-success text-white"
                    : "bg-slate-900/5 text-slate-900/30"
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-medium ${
                  isCurrent ? "text-indigo" : isCompleted ? "text-success" : "text-slate-900/30"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 w-8 sm:w-12 -mt-4 rounded-full ${
                  i < currentIndex ? "bg-success" : "bg-slate-900/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ReferralsPage() {
  const [filter, setFilter] = useState<ReferralStatus | "all">("all");

  const filtered = filter === "all" ? referrals : referrals.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-slate-900/10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm text-slate-900/50 hover:text-indigo transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-slate-900">
                My Referrals
              </h1>
              <p className="text-sm text-slate-900/50 mt-1">
                Track your referral requests from submission to hire.
              </p>
            </div>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Find Alumni
              <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
            <button
              onClick={() => setFilter("all")}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-900/5 text-slate-900/60 hover:bg-slate-900/10"
              }`}
            >
              All ({referrals.length})
            </button>
            {steps.map((step) => {
              const count = referrals.filter((r) => r.status === step.key).length;
              return (
                <button
                  key={step.key}
                  onClick={() => setFilter(step.key)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filter === step.key
                      ? "bg-slate-900 text-white"
                      : "bg-slate-900/5 text-slate-900/60 hover:bg-slate-900/10"
                  }`}
                >
                  {step.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Referral List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-4">
          {filtered.map((referral) => (
            <div
              key={referral.id}
              className="rounded-2xl border border-slate-900/10 bg-white p-6 shadow-card hover:shadow-cardHover transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo to-cyan text-sm font-bold text-white">
                  {referral.alumniInitials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="font-outfit text-lg font-semibold text-slate-900">
                      {referral.alumniName}
                    </h3>
                    <StatusBadge status={referral.status} />
                  </div>
                  <p className="text-sm text-slate-900/60">
                    {referral.role} at {referral.company}
                  </p>
                  <p className="text-xs text-slate-900/40 mt-1 font-mono">{referral.date}</p>

                  {/* Step Indicator */}
                  <div className="mt-4">
                    <StepIndicator current={referral.status} />
                  </div>

                  {/* Note */}
                  <p className="mt-4 text-sm text-slate-900/70 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-900/5">
                    {referral.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/5 mx-auto mb-4">
              <Send className="size-7 text-slate-900/20" />
            </div>
            <p className="text-lg font-medium text-slate-900/60">No referrals found</p>
            <p className="text-sm text-slate-900/40 mt-1">
              {filter === "all"
                ? "Start by finding alumni to request a referral."
                : `No referrals with status "${filter}".`}
            </p>
            <Link
              href="/directory"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Browse Alumni Directory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}