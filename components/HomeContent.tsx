"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundPattern } from "@/components/ui/Layout/BackgroundPattern";
import {
  BriefcaseBusiness,
  GraduationCap,
  Heart,
  User,
  Calendar,
  Megaphone,
  ArrowRight,
  Clock,
  Users,
  Briefcase,
  Send,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { recommendedAlumni, events, announcements } from "@/lib/mock-data";
import {
  staggerContainer,
  slideUp,
  MotionDiv,
  StaggerItem,
} from "@/lib/motion";
import { Card, Badge } from "@/components/ui";
import { MatchRing } from "@/components/MatchRing";

const quickActions = [
  {
    label: "Jobs",
    description: "Browse opportunities from your network",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Mentorship",
    description: "Connect with experienced alumni",
    href: "/mentorship",
    icon: GraduationCap,
  },
  {
    label: "Giving",
    description: "Support the next generation",
    href: "/giving",
    icon: Heart,
  },
  {
    label: "Profile",
    description: "Update your information",
    href: "/profile",
    icon: User,
  },
];

const recentActivity = [
  {
    icon: Briefcase,
    text: "Priya Raman posted a new job at Northstar Labs",
    time: "2h ago",
  },
  {
    icon: GraduationCap,
    text: "Your mentorship request was accepted by Marcus Chen",
    time: "5h ago",
  },
  {
    icon: Calendar,
    text: "142 alumni registered for Designing your first five years",
    time: "1d ago",
  },
  {
    icon: Send,
    text: "Nina Okafor endorsed you for TypeScript",
    time: "2d ago",
  },
];

function getDaysUntilNextEvent(): { days: number; title: string } | null {
  const now = new Date();
  const futureEvents = events
    .filter((e) => e.startsAt && new Date(e.startsAt) > now)
    .sort(
      (a, b) =>
        new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime()
    );
  if (futureEvents.length === 0) return null;
  const next = futureEvents[0];
  const diff = Math.ceil(
    (new Date(next.startsAt!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return { days: diff, title: next.title };
}

export function HomeContent() {
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const upcomingEvent = getDaysUntilNextEvent();

  return (
    <>
      <BackgroundPattern color="brass" speed={0.8}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-14 relative"
        >
          <motion.div variants={slideUp}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">
              Welcome back
            </p>
            <h1 className="mt-2 font-display text-5xl tracking-tight">
              {firstName}
            </h1>
            <p className="mt-3 text-sm text-ink-900/55">
              Class of {user.classYear} · {user.department}
            </p>
          </motion.div>

          {upcomingEvent && (
            <motion.div variants={slideUp}>
              <Card
                padding="lg"
                className="border-brass-500/30 bg-brass-500/10"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="block font-display text-6xl leading-none text-brass-500">
                        {upcomingEvent.days}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-ink-900/50">
                        days
                      </span>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-brass-500">
                        Next Event
                      </p>
                      <h2 className="mt-1 font-display text-2xl">
                        {upcomingEvent.title}
                      </h2>
                    </div>
                  </div>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-900 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2"
                  >
                    Register Now
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div variants={slideUp} className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Card
                  key={action.label}
                  padding="md"
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 pb-3">
                    <action.icon className="size-6 text-brass-500" />
                    <div>
                      <p className="font-medium text-sm text-ink-900">{action.label}</p>
                      <p className="text-xs text-ink-900/50">{action.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link
                      href={action.href}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-brass-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-900 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2"
                    >
                      Go to {action.label}
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={slideUp} className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Recommended Alumni</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedAlumni.slice(0, 6).map((alumni) => (
                <Card key={alumni.id} padding="md" className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-500 text-sm font-semibold text-white">
                      {alumni.initials}
                    </div>
                    <div>
                      <h3 className="font-display text-xl">{alumni.name}</h3>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-900/45">
                        Class of {alumni.batch}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-ink-900/10 pt-4">
                    <p className="text-sm font-medium">{alumni.role} <span className="text-ink-900/35">at</span> {alumni.company}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-900/50">
                      <Clock size={12} /> {alumni.location}
                    </p>
                  </div>
                  <Link
                    href={`/directory/${alumni.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sage-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 group-hover:text-brass-500"
                  >
                    View profile
                    <ArrowRight size={13} />
                  </Link>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={slideUp} className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Recent Activity</h2>
              <Link
                href="/notifications"
                className="text-xs font-semibold text-sage-500 underline underline-offset-4"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
              {recentActivity.map((activity) => (
                <Link
                  key={activity.text}
                  href="#"
                  className="flex items-center gap-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-brass-500/15 text-brass-500">
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="mt-1 text-xs text-ink-900/50">{activity.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={slideUp} className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Announcements</h2>
              <Link
                href="/announcements"
                className="text-xs font-semibold text-sage-500 underline underline-offset-4"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {announcements.slice(0, 2).map((ann) => (
                <Card key={ann.id} padding="md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-brass-500/15 text-brass-500">
                      <Megaphone size={14} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg">{ann.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink-900/55">
                        {ann.body}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] font-medium text-ink-900/70">
                          {ann.author}
                        </span>
                        <span className="text-[10px] text-ink-900/35">·</span>
                        <span className="font-mono text-[10px] text-ink-900/40">
                          {ann.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </BackgroundPattern>
    </>
  );
}