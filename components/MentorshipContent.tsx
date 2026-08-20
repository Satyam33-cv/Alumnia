"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { recommendedAlumni, mentorshipRequests } from "@/lib/mock-data";
import type { MentorshipRequest } from "@/lib/mock-data";
import { Card } from "@/components/ui";
import { MatchRing } from "@/components/MatchRing";
import {
  fadeIn,
  slideUp,
  staggerContainer,
} from "@/lib/motion";

const AREAS = ["All", "Career Advice", "Interview Prep", "Entrepreneurship", "Higher Studies"] as const;

const topMatch = recommendedAlumni[0];

function RequestModal({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-900/50 pt-10 sm:pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-500/15">
              <Check size={28} className="text-sage-500" />
            </div>
            <p className="font-display text-xl text-ink-900">Request sent!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink-900">
                Request Mentorship from {name}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-ink-900/40 transition-colors hover:text-ink-900"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/55">
                Area
              </span>
              <div className="relative mt-1.5">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-ink-900/15 bg-white px-3 py-2.5 pr-9 text-sm text-ink-900 outline-none transition-colors focus:border-brass-500"
                >
                  <option value="">Select an area</option>
                  <option>Career Advice</option>
                  <option>Interview Prep</option>
                  <option>Entrepreneurship</option>
                  <option>Higher Studies</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-900/40"
                />
              </div>
            </label>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/55">
                Message
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write a short note about what you'd like guidance on"
                className="mt-1.5 w-full resize-none rounded-lg border border-ink-900/15 px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-900/35 transition-colors focus:border-brass-500"
              />
            </label>

            <button
              onClick={handleSend}
              disabled={!area || !message.trim()}
              className="mt-5 w-full rounded-full bg-brass-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-secondaryContainer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send Request
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function MentorshipContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeArea, setActiveArea] = useState<string>("All");
  const [requests, setRequests] = useState<MentorshipRequest[]>(mentorshipRequests);

  const filteredRequests = useMemo(
    () =>
      activeArea === "All"
        ? requests
        : requests.filter((r) => r.area === activeArea),
    [requests, activeArea]
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r))
    );
  };

  const handleDecline = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "declined" as const } : r))
    );
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">
          Mentorship
        </p>
        <h1 className="mt-2 font-display text-5xl">Grow together.</h1>
      </div>

      <motion.div {...slideUp}>
        <Card tone="dark" padding="lg" className="max-w-2xl">
          <p className="text-sm font-semibold text-brass-500">Top Match for You</p>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brass-500 font-semibold text-ink-900">
              {topMatch.initials}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl text-paper-50">{topMatch.name}</h2>
              <p className="mt-1 text-sm text-paper-50/70">
                {topMatch.role} · {topMatch.company}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper-50/45">
                Class of {topMatch.batch}
              </p>
            </div>
            <div className="shrink-0">
              <MatchRing percentage={topMatch.match ?? 0} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {topMatch.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-paper-50/10 px-3 py-1 text-xs text-paper-50/80"
              >
                {skill}
              </span>
            ))}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-secondaryContainer"
          >
            Request Mentorship
          </button>
        </Card>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <RequestModal
            name={topMatch.name}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="rounded-lg border border-tertiaryOnContainer/20 bg-tertiaryOnContainer/10 p-6"
      >
        <h3 className="font-display text-xl text-ink-900">Share what you know</h3>
        <p className="mt-2 max-w-lg text-sm leading-6 text-ink-900/60">
          Toggle mentoring availability in your profile to get matched with students.
        </p>
        <Link
          href="/profile"
          className="mt-4 inline-block text-sm font-semibold text-tertiaryOnContainer underline transition-colors hover:text-ink-900"
        >
          Go to Profile →
        </Link>
      </motion.div>

      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl text-ink-900">Pending Requests</h2>
          {pendingCount > 0 && (
            <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-brass-500/15 px-2 text-xs font-semibold text-brass-500">
              {pendingCount}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <motion.button
              key={area}
              onClick={() => setActiveArea(area)}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeArea === area
                  ? "bg-brass-500 text-white"
                  : "border border-ink-900/20 text-ink-900/70 hover:border-brass-500"
              }`}
            >
              {area}
            </motion.button>
          ))}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-5 space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((req) => (
              <motion.div
                key={req.id}
                variants={slideUp}
                layout
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg border border-ink-900/10 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-500/15 text-sm font-semibold text-sage-500">
                      {req.studentInitials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {req.studentName}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-900/45">
                        Class of {req.batch} · {req.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 sm:text-right">
                    <p className="text-sm leading-5 text-ink-900/70">{req.message}</p>
                    <span className="mt-2 inline-block rounded-full bg-brass-500/10 px-2.5 py-0.5 text-[11px] font-medium text-brass-500">
                      {req.area}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {req.status === "accepted" ? (
                      <motion.span
                        key="accepted"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-full bg-sage-500 px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        <Check size={12} /> Accepted
                      </motion.span>
                    ) : req.status === "declined" ? (
                      <motion.span
                        key="declined"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-full border border-clay-500/30 bg-clay-500/10 px-4 py-1.5 text-xs font-semibold text-clay-500"
                      >
                        Declined
                      </motion.span>
                    ) : (
                      <motion.div
                        key="actions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                      >
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="rounded-full bg-sage-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sage-500/90"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="rounded-full border border-ink-900/20 px-4 py-1.5 text-xs font-semibold text-ink-900/70 transition-colors hover:border-ink-900/40"
                        >
                          Decline
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredRequests.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-900/45">
              No requests in this area.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
