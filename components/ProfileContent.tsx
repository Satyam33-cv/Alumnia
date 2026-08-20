"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Pencil,
  ArrowRight,
  RefreshCw,
  Loader2,
  BookOpen,
  Heart,
  BookMarked,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, Badge } from "@/components/ui";
import { fadeIn, slideUp, staggerContainer } from "@/lib/motion";

const timelineEntries = [
  {
    role: "Software Engineer",
    company: "Stripe",
    range: "2022 — Present",
  },
  {
    role: "Junior Developer",
    company: "Northstar Labs",
    range: "2020 — 2022",
  },
  {
    role: "Intern",
    company: "Fieldwork",
    range: "2019 — 2020",
  },
  {
    role: "B.S. Computer Science",
    company: "State University",
    range: "2016 — 2020",
  },
];

const achievements = [
  { label: "10 referrals given", tone: "success" as const },
  { label: "Top mentor 2025", tone: "accent" as const },
  { label: "Active since 2024", tone: "neutral" as const },
  { label: "5 mentees helped", tone: "warning" as const },
];

const quickLinks = [
  { label: "Mentorship Hub", href: "/mentorship", icon: BookOpen },
  { label: "Giving", href: "/giving", icon: Heart },
  { label: "Stories", href: "/stories", icon: BookMarked },
  { label: "Settings", href: "#", icon: Settings },
];

export function ProfileContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mentoring, setMentoring] = useState(true);
  const [bio, setBio] = useState(
    "Passionate about building products that make everyday work more human. Open to mentoring students and early-career professionals."
  );
  const [editingBio, setEditingBio] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshDone, setRefreshDone] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshDone(false);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshDone(true);
    }, 1000);
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
      router.push("/login");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-3xl space-y-12"
    >
      <motion.div variants={fadeIn}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">
          My Profile
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-tight">
          {user.name}
        </h1>
        <p className="mt-3 text-sm text-ink-900/55">
          {user.role} · {user.department}
        </p>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brass-500 text-2xl font-semibold text-white">
                {user.initials}
              </div>
              <div>
                <h2 className="font-display text-3xl">{user.name}</h2>
                <p className="mt-1 text-sm text-ink-900/60">
                  {user.role} · {user.department}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="neutral">
                    Class of {user.classYear} · {user.department}
                  </Badge>
                  <ShieldCheck size={16} className="text-sage-500" />
                </div>
              </div>
            </div>
            <button className="rounded-full border border-ink-900/15 px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brass-500 hover:text-brass-500">
              <span className="flex items-center gap-2">
                <Pencil size={14} /> Edit profile
              </span>
            </button>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <h3 className="font-display text-xl">About</h3>
          {editingBio ? (
            <div className="mt-4">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-ink-900/20 bg-transparent px-4 py-3 text-sm leading-6 outline-none transition-colors focus:border-brass-500"
              />
              <button
                onClick={() => setEditingBio(false)}
                className="mt-3 text-xs font-semibold text-brass-500 hover:text-brass-600"
              >
                Done
              </button>
            </div>
          ) : (
            <p
              onClick={() => setEditingBio(true)}
              className="mt-4 cursor-pointer text-sm leading-6 text-ink-900/70 transition-colors hover:text-ink-900"
            >
              {bio}
            </p>
          )}
          <div className="mt-6 flex items-center justify-between border-t border-ink-900/10 pt-5">
            <span className="text-sm font-medium text-ink-900">
              Open to mentoring
            </span>
            <button
              onClick={() => setMentoring(!mentoring)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                mentoring ? "bg-tertiaryOnContainer" : "bg-ink-900/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  mentoring ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <h3 className="font-display text-xl">Career Timeline</h3>
          <div className="mt-6 space-y-0">
            {timelineEntries.map((entry, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-brass-500" />
                  {i < timelineEntries.length - 1 && (
                    <div className="w-px flex-1 bg-ink-900/15" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-ink-900">
                    {entry.role}
                  </p>
                  <p className="text-xs text-ink-900/60">{entry.company}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-900/40">
                    {entry.range}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <h3 className="font-display text-xl">Achievements</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {achievements.map((a) => (
              <Badge key={a.label} tone={a.tone}>
                {a.label}
              </Badge>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <h3 className="font-display text-xl">AI Match Profile</h3>
          <p className="mt-3 text-sm text-ink-900/60">
            Your embedding was last updated 3 days ago
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brass-500 hover:text-brass-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : refreshDone ? (
              <span className="text-tertiaryOnContainer">Updated!</span>
            ) : (
              <>
                <RefreshCw size={15} /> Refresh my AI match profile
              </>
            )}
          </button>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <h3 className="font-display text-xl">Quick Links</h3>
          <div className="mt-4 divide-y divide-ink-900/10 border-y border-ink-900/10">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-between py-4 transition-colors hover:bg-paper-50/50"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-ink-900">
                  <link.icon size={16} className="text-ink-900/50" />
                  {link.label}
                </span>
                <ArrowRight
                  size={14}
                  className="text-ink-900/30 transition-transform group-hover:translate-x-0.5 group-hover:text-brass-500"
                />
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-clay-500/10 px-6 py-3.5 text-sm font-semibold text-clay-500 transition-colors hover:bg-clay-500/20"
        >
          <LogOut size={16} /> Sign out
        </button>
      </motion.div>
    </motion.div>
  );
}
