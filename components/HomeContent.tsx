"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundPattern } from "@/components/ui/Layout/BackgroundPattern";
import { ScrollReveal } from "@/components/ui/Layout/ScrollReveal";
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
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Search,
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

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: typeof BriefcaseBusiness;
};

const quickActions: QuickAction[] = [
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

const heroStats = [
  { value: "2.4k+", label: "Active Alumni", icon: Users },
  { value: "340+", label: "Companies", icon: BriefcaseBusiness },
  { value: "180+", label: "Mentors", icon: GraduationCap },
  { value: "92%", label: "Match Rate", icon: Target },
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
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[50vh] flex items-center" aria-labelledby="hero-heading">
        <BackgroundPattern color="purple" speed={20} className="absolute inset-0 opacity-30" />
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Welcome Header with Glassmorphism */}
          <ScrollReveal delay={0.1} direction="up" className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-flex items-center gap-2 rounded-full bg-purple/10 px-4 py-2 mb-6 border border-purple/20"
            >
              <Sparkles className="size-4 text-purple" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-purple/80 font-medium">
                Welcome back, {firstName}
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-ink"
            >
              Ready to grow your{" "}
              <span className="relative">
                network
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-purple/30 -z-10" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 text-lg sm:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed"
            >
              Class of {user.classYear} · {user.department} — Discover opportunities, connect with mentors, and give back to your community.
            </motion.p>
          </ScrollReveal>

          {/* Hero Stats */}
          <ScrollReveal delay={0.3} direction="up" className="mt-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group relative"
                >
                  <Card
                    padding="md"
                    className="relative overflow-hidden border-border bg-white/80 backdrop-blur-sm hover:border-purple/30 hover:bg-white transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple group-hover:bg-purple group-hover:text-canvas transition-all duration-300">
                        <stat.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-2xl sm:text-3xl font-semibold text-ink leading-tight">
                          {stat.value}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink/45 mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Primary CTAs */}
          <ScrollReveal delay={0.5} direction="up" className="mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 rounded-full bg-purple px-8 py-4 text-base font-semibold text-canvas transition-all duration-300 hover:bg-ink hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2"
              >
                Explore Opportunities
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/mentorship"
                className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-canvas px-8 py-4 text-base font-semibold text-ink transition-all duration-300 hover:border-purple hover:bg-purple/5 hover:text-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2"
              >
                Find a Mentor
              </Link>
            </div>
          </ScrollReveal>

          {/* Upcoming Event Card */}
          {upcomingEvent && (
            <ScrollReveal delay={0.6} direction="up" className="mt-12 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative overflow-hidden"
              >
                <Card
                  padding="lg"
                  className="relative border-border bg-gradient-to-br from-purple/5 via-white to-blue/5"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple/10 via-transparent to-transparent" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple/10">
                        <Calendar className="size-8 text-purple" />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-purple/80 font-medium">
                          Upcoming Event
                        </p>
                        <h2 className="mt-1 font-heading text-xl sm:text-2xl font-semibold text-ink">
                          {upcomingEvent.title}
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col items-end sm:items-center gap-2">
                      <div className="text-center">
                        <span className="block font-heading text-4xl sm:text-5xl font-bold text-purple leading-none">
                          {upcomingEvent.days}
                        </span>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-ink/50 mt-1">
                          days left
                        </span>
                      </div>
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-2 rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2"
                      >
                        Register Now
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </ScrollReveal>
          )}

          {/* Decorative accent line */}
          <ScrollReveal delay={0.7} direction="up" className="mt-16">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple to-transparent" />
              <div className="flex h-2 w-2 items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-purple" />
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-purple to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <BackgroundPattern color="blue" speed={30} className="absolute -top-20 left-0 right-0 h-40 opacity-20 pointer-events-none" />
        
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-14 relative"
        >
          {/* Quick Actions */}
          <ScrollReveal direction="up" className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">
                  <Sparkles size={20} />
                </div>
                <h2 className="font-heading text-3xl">Quick Actions</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <ScrollReveal key={action.label} delay={0.1} direction="up" className="min-h-[180px]">
                  <Card
                    padding="md"
                    className="flex flex-col h-full group relative overflow-hidden border-border hover:border-purple/30 hover:shadow-cardHover transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple group-hover:bg-purple group-hover:text-canvas transition-all duration-300">
                        <action.icon size={22} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-ink">{action.label}</p>
                        <p className="text-xs text-ink/50">{action.description}</p>
                      </div>
                    </div>
                    <div className="relative mt-auto">
                      <Link
                        href={action.href}
                        className="relative inline-flex items-center gap-2 rounded-full bg-purple px-4 py-2 text-sm font-medium text-canvas transition-all duration-300 hover:bg-ink hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2"
                      >
                        Go to {action.label}
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* Recommended Alumni */}
          <ScrollReveal direction="up" className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">
                  <Users size={20} />
                </div>
                <h2 className="font-heading text-3xl">Recommended Alumni</h2>
              </div>
              <Link
                href="/directory"
                className="text-xs font-semibold text-purple underline underline-offset-4 hover:text-ink transition-colors"
              >
                View all
                <ArrowRight size={12} className="inline ml-1" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedAlumni.slice(0, 6).map((alumni) => (
                <ScrollReveal key={alumni.id} delay={0.05} direction="up">
                  <Card
                    padding="md"
                    className="flex flex-col group relative overflow-hidden border-border hover:border-purple/30 hover:shadow-cardHover transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple text-base font-semibold group-hover:bg-purple group-hover:text-canvas transition-all duration-300">
                        {alumni.initials}
                      </div>
                      <div>
                        <h3 className="font-heading text-xl">{alumni.name}</h3>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink/45">
                          Class of {alumni.batch}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-sm font-medium">{alumni.role} <span className="text-ink/35">at</span> {alumni.company}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                        <Clock size={12} /> {alumni.location}
                      </p>
                    </div>
                    <Link
                      href={`/directory/${alumni.id}`}
                      className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-purple transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple group-hover:text-ink"
                    >
                      View profile
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* Recent Activity */}
          <ScrollReveal direction="up" className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <TrendingUp size={20} />
                </div>
                <h2 className="font-heading text-3xl">Recent Activity</h2>
              </div>
              <Link
                href="/notifications"
                className="text-xs font-semibold text-purple underline underline-offset-4 hover:text-ink transition-colors"
              >
                View all
                <ArrowRight size={12} className="inline ml-1" />
              </Link>
            </div>
            <Card className="overflow-hidden border-border">
              <div className="divide-y divide-border">
                {recentActivity.map((activity) => (
                  <Link
                    key={activity.text}
                    href="#"
                    className="relative flex items-center gap-4 py-5 px-6 hover:bg-purple/5 transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple group-hover:bg-purple group-hover:text-canvas transition-all duration-300">
                      <activity.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{activity.text}</p>
                      <p className="mt-1 text-xs text-ink/50">{activity.time}</p>
                    </div>
                    <ArrowRight size={16} className="text-ink/30 group-hover:text-purple group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </Card>
          </ScrollReveal>

          {/* Announcements */}
          <ScrollReveal direction="up" className="mt-8">
            <div className="mb-5 flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">
                  <Megaphone size={20} />
                </div>
                <h2 className="font-heading text-3xl">Announcements</h2>
              </div>
              <Link
                href="/announcements"
                className="text-xs font-semibold text-purple underline underline-offset-4 hover:text-ink transition-colors"
              >
                View all
                <ArrowRight size={12} className="inline ml-1" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {announcements.slice(0, 2).map((ann) => (
                <ScrollReveal key={ann.id} delay={0.05} direction="up">
                  <Card
                    padding="md"
                    className="group relative overflow-hidden border-border hover:border-purple/30 hover:shadow-cardHover transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple/10 text-purple group-hover:bg-purple group-hover:text-canvas transition-all duration-300">
                        <Megaphone size={14} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-lg">{ann.title}</h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/55">
                          {ann.body}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[11px] font-medium text-ink/70">
                            {ann.author}
                          </span>
                          <span className="text-[10px] text-ink/35">·</span>
                          <span className="font-mono text-[10px] text-ink/40">
                            {ann.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* Feature Highlights */}
          <ScrollReveal direction="up" className="mt-16">
            <div className="mb-5 flex items-baseline justify-center text-center">
              <div className="flex items-center gap-3 justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">
                  <Award size={20} />
                </div>
                <h2 className="font-heading text-3xl">Why Alumni Choose AlumniConnect</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Smart Matching",
                  desc: "AI-powered recommendations connect you with the right alumni based on your goals, industry, and interests.",
                },
                {
                  icon: Users,
                  title: "Global Network",
                  desc: "Access 2,400+ alumni across 340+ companies worldwide — from startups to Fortune 500.",
                },
                {
                  icon: TrendingUp,
                  title: "Career Growth",
                  desc: "92% match rate for mentorship pairs. Real outcomes: promotions, career pivots, and funding raised.",
                },
              ].map((feature, index) => (
                <ScrollReveal key={feature.title} delay={0.1 + index * 0.1} direction="up">
                  <Card
                    padding="lg"
                    className="relative overflow-hidden border-border hover:border-purple/30 hover:shadow-cardHover transition-all duration-500 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex flex-col items-center text-center h-full">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10 text-purple group-hover:bg-purple group-hover:text-canvas transition-all duration-300">
                        <feature.icon size={26} />
                      </div>
                      <h3 className="mt-5 font-heading text-xl font-semibold text-ink">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm text-ink/60 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </motion.div>
      </div>
    </>
  );
}