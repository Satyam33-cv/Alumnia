"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Send,
  Briefcase,
  ChevronRight,
  Check,
  Sparkles,
  Search,
  ArrowUpDown,
  X,
  Building2,
  Calendar,
  Filter,
} from "lucide-react";

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

type SortOption = "date-desc" | "date-asc" | "company-asc" | "company-desc" | "name-asc";

const statusConfig: Record<ReferralStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60", icon: Clock },
  accepted: { label: "Accepted", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60", icon: CheckCircle2 },
  referred: { label: "Referred", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60", icon: Send },
  hired: { label: "Hired", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60", icon: Briefcase },
};

const steps: { key: ReferralStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "referred", label: "Referred" },
  { key: "hired", label: "Hired" },
];

const initialReferrals: Referral[] = [
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
  {
    id: "6",
    alumniName: "Marcus Chen",
    alumniInitials: "MC",
    company: "Stripe",
    role: "Staff Infrastructure Engineer",
    status: "referred",
    date: "Aug 21, 2026",
    note: "Marcus submitted my referral via Stripe's internal talent portal for the Core Payments team.",
  },
  {
    id: "7",
    alumniName: "Elena Rostova",
    alumniInitials: "ER",
    company: "Apple",
    role: "Machine Learning Specialist",
    status: "accepted",
    date: "Aug 14, 2026",
    note: "Elena reviewed my portfolio and endorsed me for the Siri Natural Language processing team.",
  },
  {
    id: "8",
    alumniName: "David Kalu",
    alumniInitials: "DK",
    company: "Uber",
    role: "Backend Engineer II",
    status: "hired",
    date: "Jun 28, 2026",
    note: "Accepted the offer for Rider Logistics team after David provided mock interview mentorship.",
  },
  {
    id: "9",
    alumniName: "Sarah Jenkins",
    alumniInitials: "SJ",
    company: "Airbnb",
    role: "Senior Product Designer",
    status: "pending",
    date: "Aug 22, 2026",
    note: "Shared my case studies and requested a referral for Host Experience.",
  },
];

function StatusBadge({ status }: { status: ReferralStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <motion.span
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.color}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </motion.span>
  );
}

function StepIndicator({
  current,
  onSelectStep,
}: {
  current: ReferralStatus;
  onSelectStep?: (status: ReferralStatus) => void;
}) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-0 w-full max-w-lg">
      {steps.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const isPast = i < currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step Node */}
            <div className="flex flex-col items-center relative group">
              <button
                type="button"
                onClick={() => onSelectStep?.(step.key)}
                className={`relative flex items-center justify-center rounded-full focus:outline-none transition-transform active:scale-95 ${
                  onSelectStep ? "cursor-pointer" : "cursor-default"
                }`}
                title={`Click to set status to ${step.label}`}
                aria-label={`Step ${i + 1}: ${step.label} (${isCurrent ? "Current step" : isPast ? "Completed" : "Upcoming"})`}
              >
                {/* Active Pulsing Halo */}
                {isCurrent && (
                  <motion.div
                    layoutId={`pulse-ring-${step.key}`}
                    className="absolute -inset-1.5 rounded-full bg-indigo-500/25 dark:bg-indigo-400/30"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.75, 0.15, 0.75],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Step Circle */}
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCurrent
                      ? "#4f46e5"
                      : isPast
                      ? "#10b981"
                      : "#e2e8f0",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 26,
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm relative z-10 transition-shadow ${
                    isCurrent
                      ? "shadow-md shadow-indigo-500/30 ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                      : ""
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isPast ? (
                      <motion.span
                        key="completed-check"
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 45, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        className="flex items-center justify-center"
                      >
                        <Check className="size-4 stroke-[2.5]" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key={`step-num-${i}-${isCurrent}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={isCompleted ? "text-white" : "text-slate-500 dark:text-slate-400"}
                      >
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>

              {/* Step Label */}
              <motion.span
                layout
                animate={{
                  color: isCurrent
                    ? "#4f46e5"
                    : isPast
                    ? "#059669"
                    : "#94a3b8",
                  fontWeight: isCurrent ? 700 : 500,
                  y: isCurrent ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="mt-1.5 text-[11px] font-medium tracking-tight text-center whitespace-nowrap"
              >
                {step.label}
              </motion.span>
            </div>

            {/* Connecting Progress Bar */}
            {i < steps.length - 1 && (
              <div className="relative mx-1.5 sm:mx-2.5 h-1 flex-1 -mt-5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden min-w-[24px] sm:min-w-[44px]">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-full"
                  initial={false}
                  animate={{
                    width: i < currentIndex ? "100%" : "0%",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 26,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [filter, setFilter] = useState<ReferralStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const handleUpdateStatus = (id: string, newStatus: ReferralStatus) => {
    setReferrals((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, status: newStatus } : ref))
    );
  };

  const handleAdvanceStatus = (id: string, currentStatus: ReferralStatus) => {
    const currentIndex = steps.findIndex((s) => s.key === currentStatus);
    if (currentIndex < steps.length - 1) {
      handleUpdateStatus(id, steps[currentIndex + 1].key);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = referrals;

    // 1. Status Filter
    if (filter !== "all") {
      result = result.filter((r) => r.status === filter);
    }

    // 2. Search Query (Matches Alumni Name, Company, Role, Note)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.alumniName.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    return [...result].sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "company-asc") {
        return a.company.localeCompare(b.company);
      }
      if (sortBy === "company-desc") {
        return b.company.localeCompare(a.company);
      }
      if (sortBy === "name-asc") {
        return a.alumniName.localeCompare(b.alumniName);
      }
      return 0;
    });
  }, [referrals, filter, searchQuery, sortBy]);

  const hasActiveFilters = filter !== "all" || searchQuery.trim() !== "" || sortBy !== "date-desc";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight">
                  My Referrals
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="size-3" /> Live State Tracking
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Track referral requests from submission to hire with real-time status progression.
              </p>
            </div>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              Find Alumni
              <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Search, Sort & Filter Bar */}
          <div className="mt-6 space-y-4">
            {/* Search Input & Sort Dropdown Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by alumni, company, role, or keywords..."
                  className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative flex items-center">
                  <ArrowUpDown className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort referrals"
                    className="appearance-none pl-9 pr-8 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="date-desc">Newest Date</option>
                    <option value="date-asc">Oldest Date</option>
                    <option value="company-asc">Company (A-Z)</option>
                    <option value="company-desc">Company (Z-A)</option>
                    <option value="name-asc">Alumni Name (A-Z)</option>
                  </select>
                  <ChevronRight className="absolute right-2.5 size-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                      setSortBy("date-desc");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                    title="Reset all filters"
                  >
                    <X className="size-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter Tabs & Results Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setFilter("all")}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filter === "all"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
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
                      className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        filter === step.key
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {step.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <span>
                  Showing <strong className="text-slate-700 dark:text-slate-200">{filteredAndSorted.length}</strong> of {referrals.length} referrals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {filteredAndSorted.map((referral, index) => {
              const currentIndex = steps.findIndex((s) => s.key === referral.status);
              const canAdvance = currentIndex < steps.length - 1;

              return (
                <motion.div
                  key={referral.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{
                    opacity: { duration: 0.22, ease: "easeOut" },
                    scale: { type: "spring", stiffness: 380, damping: 28 },
                    y: { type: "spring", stiffness: 380, damping: 28 },
                    layout: { type: "spring", stiffness: 350, damping: 30 },
                  }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-indigo-500/20">
                      {referral.alumniInitials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-outfit text-lg font-bold text-slate-900 dark:text-slate-100">
                            {referral.alumniName}
                          </h3>
                          <StatusBadge status={referral.status} />
                        </div>

                        {/* Quick Status Advance / Switcher */}
                        <div className="flex items-center gap-2">
                          {canAdvance && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(referral.id, referral.status)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                              Advance to {steps[currentIndex + 1].label}
                              <ChevronRight className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>{referral.role}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1">
                          <Building2 className="size-3.5 text-slate-400" />
                          {referral.company}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono flex items-center gap-1">
                        <Calendar className="size-3" /> {referral.date}
                      </p>

                      {/* Step Indicator with Framer Motion transitions */}
                      <div className="mt-5 py-2.5 px-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Referral Progression Flow
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Click any step to update status
                          </span>
                        </div>
                        <StepIndicator
                          current={referral.status}
                          onSelectStep={(newStatus) => handleUpdateStatus(referral.id, newStatus)}
                        />
                      </div>

                      {/* Note */}
                      <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60">
                        {referral.note}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
              <Search className="size-7 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No referrals found</p>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results match "${searchQuery}"${filter !== "all" ? ` with status "${filter}"` : ""}. Try adjusting your keywords or clearing filters.`
                : filter !== "all"
                ? `No referrals currently in the "${filter}" stage.`
                : "Start by finding alumni to request a referral."}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  onClick={() => {
                    setFilter("all");
                    setSearchQuery("");
                    setSortBy("date-desc");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-sm"
                >
                  <X className="size-4" />
                  Clear Search & Filters
                </button>
              ) : (
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
                >
                  Browse Alumni Directory
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

