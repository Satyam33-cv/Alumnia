"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Bookmark,
  BriefcaseBusiness,
  Upload,
  X,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { useAuth } from "@/lib/context/AuthContext";
import { jobs as initialJobs } from "@/lib/mock-data";
import type { Job } from "@/lib/mock-data";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  StaggerItem,
} from "@/lib/motion";

type FilterChip = "All" | "Full-time" | "Internship" | "Remote" | "Referral Available";

const chips: FilterChip[] = ["All", "Full-time", "Internship", "Remote", "Referral Available"];

type ReferralStatus = "none" | "pending" | "accepted" | "rejected";

export function JobListContent() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState<FilterChip>("All");
  const [jobsList] = useState<Job[]>(initialJobs);
  const [referralStates, setReferralStates] = useState<Record<string, ReferralStatus>>({});
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalJobId, setModalJobId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredJobs = jobsList.filter((job) => {
    const matchesQuery =
      query === "" ||
      [job.title, job.company, job.type, job.location]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

    let matchesChip = true;
    if (activeChip === "Full-time") matchesChip = job.type === "Full-time";
    else if (activeChip === "Internship") matchesChip = job.type === "Internship";
    else if (activeChip === "Remote") matchesChip = job.remote === true;
    else if (activeChip === "Referral Available") matchesChip = job.referralAvailable === true;

    return matchesQuery && matchesChip;
  });

  const openReferralModal = useCallback((jobId: string) => {
    setModalJobId(jobId);
    setNote("");
    setResumeFile(null);
    setModalOpen(true);
  }, []);

  const closeReferralModal = useCallback(() => {
    setModalOpen(false);
    setModalJobId(null);
    setNote("");
    setResumeFile(null);
    setDragOver(false);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSubmitReferral = useCallback(() => {
    if (!modalJobId) return;
    setReferralStates((prev) => ({ ...prev, [modalJobId]: "pending" }));
    closeReferralModal();
    showToast("Request sent! Status: Pending");
  }, [modalJobId, closeReferralModal, showToast]);

  const toggleBookmark = useCallback((jobId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  }, []);

  const modalJob = modalJobId ? jobsList.find((j) => j.id === modalJobId) : null;

  const isAlumniOrAdmin = user?.role === "alumni" || user?.role === "admin";

  return (
    <div className="relative">
      <motion.div initial={fadeIn.initial} animate={fadeIn.animate} transition={fadeIn.transition}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">
          Career board
        </p>
        <h1 className="mt-2 font-display text-5xl">Open doors.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-900/55">
          Roles shared by people who know where you come from.
        </p>

        {isAlumniOrAdmin && (
          <a
            href="/jobs/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-xs font-semibold text-paper-50 transition-colors hover:bg-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500"
          >
            Post a Job
          </a>
        )}
      </motion.div>

      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={slideUp.transition}
        className="mt-10 max-w-3xl"
      >
        <div className="flex items-center gap-3 rounded-full border border-ink-900/10 bg-white/70 px-4 py-3">
          <Search size={18} className="shrink-0 text-ink-900/45" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-900/35"
            placeholder="Search job titles, companies, or locations"
          />
        </div>
      </motion.div>

      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 flex flex-wrap gap-2 max-w-3xl"
      >
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              activeChip === chip
                ? "bg-sage-500 text-white"
                : "border border-ink-900/10 bg-white/70 text-ink-900/65 hover:border-ink-900/25"
            }`}
          >
            {chip}
          </button>
        ))}
      </motion.div>

      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-8 max-w-3xl space-y-4"
      >
        {filteredJobs.map((job) => {
          const status = referralStates[job.id] || "none";
          return (
            <StaggerItem key={job.id}>
              <Card padding="md" className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brass-500/15 text-brass-500">
                    <BriefcaseBusiness size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-lg leading-snug">
                          {job.title}
                        </h2>
                        <p className="mt-1 text-xs text-ink-900/50">
                          {job.company} &middot; {job.location}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className="mt-0.5 shrink-0 text-ink-900/30 transition-colors hover:text-brass-500"
                        aria-label={bookmarks.has(job.id) ? "Remove bookmark" : "Bookmark job"}
                      >
                        <Bookmark
                          size={18}
                          fill={bookmarks.has(job.id) ? "currentColor" : "none"}
                          className={bookmarks.has(job.id) ? "text-brass-500" : ""}
                        />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{job.type}</Badge>
                      {job.referralAvailable && (
                        <span className="inline-flex items-center rounded-full bg-tertiaryOnContainer/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-tertiaryOnContainer">
                          Referral Available
                        </span>
                      )}
                      {status !== "none" && (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                            status === "pending"
                              ? "bg-brass-500/15 text-brass-500"
                              : status === "accepted"
                              ? "bg-sage-500/10 text-sage-500"
                              : "bg-clay-500/10 text-clay-500"
                          }`}
                        >
                          {status}
                        </span>
                      )}
                      <span className="ml-auto font-mono text-[10px] uppercase text-ink-900/40">
                        {job.posted}
                      </span>
                    </div>

                    {user?.role === "student" && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center justify-center rounded-full bg-ink-900 px-4 py-2.5 text-xs font-semibold text-paper-50 transition-colors hover:bg-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500"
                        >
                          Apply
                        </a>
                        {job.referralAvailable && status === "none" && (
                          <button
                            onClick={() => openReferralModal(job.id)}
                            className="inline-flex items-center justify-center rounded-full border border-ink-900/10 bg-white/70 px-4 py-2.5 text-xs font-semibold text-ink-900 transition-colors hover:border-brass-500 hover:text-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500"
                          >
                            Request Referral
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}

        {filteredJobs.length === 0 && (
          <Card padding="lg">
            <div className="flex flex-col items-start gap-4 border border-dashed border-ink-900/20 bg-paper-50/60 p-8 sm:p-10">
              <BriefcaseBusiness size={22} className="text-brass-500" strokeWidth={1.6} />
              <div>
                <h3 className="font-display text-2xl">No roles match</h3>
                <p className="mt-2 max-w-prose text-sm leading-6 text-ink-900/60">
                  Try a different search or filter to find what you&apos;re looking for.
                </p>
              </div>
            </div>
          </Card>
        )}
      </motion.section>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm"
            onClick={closeReferralModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-lg border border-ink-900/10 bg-paper-50 p-6 sm:p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">
                    Referral Request
                  </p>
                  <h2 className="mt-2 font-display text-3xl">
                    {modalJob?.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-900/50">
                    {modalJob?.company}
                  </p>
                </div>
                <button
                  onClick={closeReferralModal}
                  className="shrink-0 text-ink-900/35 transition-colors hover:text-ink-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-8 space-y-6">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) setResumeFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    dragOver
                      ? "border-brass-500 bg-brass-500/5"
                      : "border-ink-900/15 bg-white/50 hover:border-ink-900/30"
                  }`}
                >
                  <Upload size={24} className="text-ink-900/35" />
                  {resumeFile ? (
                    <p className="text-sm text-ink-900/65">{resumeFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-ink-900/70">
                        Upload your resume
                      </p>
                      <p className="text-xs text-ink-900/40">
                        Accepted formats: .pdf, .doc
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setResumeFile(file);
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="referral-note"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink-900/50"
                  >
                    Write a short note to the alumni
                  </label>
                  <textarea
                    id="referral-note"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tell them why you're interested and how they can help..."
                    className="mt-3 w-full resize-none rounded-lg border border-ink-900/10 bg-white/70 px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-900/30 focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
                  />
                </div>

                <button
                  onClick={handleSubmitReferral}
                  className="w-full rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-paper-50 transition-colors hover:bg-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500"
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-[60] rounded-lg bg-ink-900 px-5 py-3 text-sm font-medium text-paper-50 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
