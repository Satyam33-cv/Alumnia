"use client";

import { useState, useRef } from "react";
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
  Upload,
  X,
  Plus,
  Trash2,
  FileText,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, Badge } from "@/components/ui";
import { fadeIn, slideUp, staggerContainer } from "@/lib/motion";
import { apiClient } from "@/lib/api/client";

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

const DEFAULT_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "GraphQL",
  "AWS",
  "Docker",
  "CI/CD",
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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [skills, setSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [newSkill, setNewSkill] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshDone(false);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshDone(true);
      showToast("AI match profile refreshed!");
    }, 1500);
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
      router.push("/login");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const uploadResume = async (file: File) => {
    try {
      setUploadingResume(true);
      setResumeFile(file);
      setResumePreview(file.name);
      const { url } = await apiClient.uploads.resume(file);
      await apiClient.users.updateProfile({ resumeUrl: url });
      showToast("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload resume");
      setResumeFile(null);
      setResumePreview(null);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      uploadResume(file);
    } else if (file) {
      showToast("Please upload a PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      uploadResume(file);
    } else if (file) {
      showToast("Please upload a PDF file");
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      showToast("Skill already exists");
      return;
    }
    setSkills([...skills, trimmed]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage">
          My Profile
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-tight">
          {user.name}
        </h1>
        <p className="mt-3 text-sm text-ink/55">
          {user.role} · {user.department}
        </p>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brass text-2xl font-semibold text-white">
                {user.initials}
              </div>
              <div>
                <h2 className="font-display text-3xl">{user.name}</h2>
                <p className="mt-1 text-sm text-ink/60">
                  {user.role} · {user.department}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="neutral">
                    Class of {user.classYear} · {user.department}
                  </Badge>
                  <ShieldCheck size={16} className="text-sage" />
                </div>
              </div>
            </div>
            <button className="rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brass hover:text-brass">
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
                className="w-full rounded-lg border border-ink/20 bg-transparent px-4 py-3 text-sm leading-6 outline-none transition-colors focus:border-brass"
              />
              <button
                onClick={() => setEditingBio(false)}
                className="mt-3 text-xs font-semibold text-brass hover:text-brass-600"
              >
                Done
              </button>
            </div>
          ) : (
            <p
              onClick={() => setEditingBio(true)}
              className="mt-4 cursor-pointer text-sm leading-6 text-ink/70 transition-colors hover:text-ink"
            >
              {bio}
            </p>
          )}
          <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
            <span className="text-sm font-medium text-ink">
              Open to mentoring
            </span>
            <button
              onClick={() => setMentoring(!mentoring)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                mentoring ? "bg-sage" : "bg-ink/20"
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
          <h3 className="font-display text-xl">Resume & AI Profile</h3>
          <p className="mt-3 text-sm text-ink/60">
            Upload your resume to improve AI matching accuracy
          </p>

          <div className="mt-6 space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragOver
                  ? "border-brass bg-brass/5"
                  : "border-ink/15 bg-white/50 hover:border-ink/30"
              }`}
            >
              <Upload size={24} className="text-ink/35" />
              {uploadingResume ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={20} className="animate-spin text-brass" />
                  <span className="text-sm text-ink/70">Uploading...</span>
                </div>
              ) : resumePreview ? (
                <div className="flex items-center gap-2 text-sm text-ink/65">
                  <FileText size={14} />
                  <span>{resumePreview}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeResume();
                    }}
                    className="ml-2 p-1 text-ink/40 hover:text-clay"
                    aria-label="Remove resume"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">
                    Upload your resume
                  </p>
                  <p className="text-xs text-ink/40">
                    Accepted formats: .pdf
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </div>

            {resumeFile && (
              <div className="p-4 rounded-lg bg-brass/5 border border-brass/20">
                <p className="font-mono text-xs uppercase tracking-wider text-brass">Resume uploaded</p>
                <p className="mt-1 text-sm text-ink/60">
                  Your resume will be parsed to extract skills and experience for better AI matching.
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl">Skills & Tags</h3>
            <button
              onClick={() => {
                const skill = prompt("Add a new skill:");
                if (skill?.trim() && !skills.includes(skill.trim())) {
                  setSkills([...skills, skill.trim()]);
                }
              }}
              className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brass hover:text-brass"
            >
              <Plus size={12} /> Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} tone="neutral" className="gap-1">
                {skill}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(skill);
                  }}
                  className="p-0.5 text-ink/40 hover:text-clay"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={10} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill and press Enter..."
              className="w-full rounded-lg border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-brass placeholder:text-ink/35"
            />
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
                  <div className="h-3 w-3 rounded-full bg-brass" />
                  {i < timelineEntries.length - 1 && (
                    <div className="w-px flex-1 bg-ink/15" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-ink">
                    {entry.role}
                  </p>
                  <p className="text-xs text-ink/60">{entry.company}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink/40">
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
          <p className="mt-3 text-sm text-ink/60">
            Your embedding was last updated 3 days ago
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brass hover:text-brass disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : refreshDone ? (
              <span className="text-sage">Updated! <Sparkles size={14} className="ml-1" /></span>
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
          <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-between py-4 transition-colors hover:bg-paper/50"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-ink">
                  <link.icon size={16} className="text-ink/50" />
                  {link.label}
                </span>
                <ArrowRight
                  size={14}
                  className="text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-brass"
                />
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-clay/10 px-6 py-3.5 text-sm font-semibold text-clay transition-colors hover:bg-clay/20"
        >
          <LogOut size={16} /> Sign out
        </button>
      </motion.div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </motion.div>
  );
}