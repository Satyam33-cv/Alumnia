"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Users,
  BookOpen,
  X,
} from "lucide-react";
import { clearSession } from "@/lib/auth";

type Role = "student" | "alumni" | "admin" | "faculty";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const primaryNav: Record<Role, NavItem[]> = {
  student: [
    { label: "Home", href: "/home", icon: LayoutDashboard },
    { label: "Network", href: "/network", icon: Users },
    { label: "Events", href: "/events", icon: CalendarDays },
    { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ],
  alumni: [
    { label: "Home", href: "/home", icon: LayoutDashboard },
    { label: "Network", href: "/network", icon: Users },
    { label: "Events", href: "/events", icon: CalendarDays },
    { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ],
  admin: [
    { label: "Command center", href: "/admin", icon: ShieldCheck },
    { label: "Directory", href: "/network", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: LayoutDashboard },
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ],
  faculty: [
    { label: "Home", href: "/home", icon: LayoutDashboard },
    { label: "Network", href: "/network", icon: Users },
    { label: "Events", href: "/events", icon: CalendarDays },
    { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ],
};

const secondaryNav: NavItem[] = [
  { label: "Mentorship", href: "/mentorship", icon: GraduationCap },
  { label: "Giving", href: "/giving", icon: Heart },
  { label: "Stories", href: "/stories", icon: BookOpen },
];

const mockNotifications = [
  { id: 1, text: "Sarah Chen accepted your mentorship request", time: "2m ago", unread: true },
  { id: 2, text: "New event: Fall Reunion Networking Night", time: "1h ago", unread: true },
  { id: 3, text: "David Park endorsed you for Python", time: "3h ago", unread: false },
  { id: 4, text: "Your referral request was viewed", time: "5h ago", unread: false },
  { id: 5, text: "Welcome to AlumniConnect v0.1", time: "1d ago", unread: false },
];

function isActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home" || pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getNavClasses(
  isActive: boolean,
  activeVariant: "primary" | "secondary" | "outline"
) {
  if (activeVariant === "primary") {
    return isActive
      ? "bg-primary text-primary-foreground"
      : "text-ink-900/60 hover:bg-primary/5 transition-colors";
  }
  if (activeVariant === "secondary") {
    return isActive
      ? "bg-secondary text-secondary-foreground"
      : "text-ink-900/60 hover:bg-secondary/5 transition-colors";
  }
  return isActive
    ? "border-b-2 border-primary"
    : "hover:text-ink-900 border-b-2 border-transparent transition-colors";
}

function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-ink-900/10 px-4 py-3">
        <p className="text-sm font-semibold text-ink-900">Notifications</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-ink-900/40 hover:text-ink-900 focus:outline-none focus:ring-2 focus:ring-brass-500"
          aria-label="Close notifications"
        >
          <X size={16} />
        </button>
      </div>
      <ul className="max-h-80 divide-y divide-ink-900/5 overflow-y-auto">
        {mockNotifications.map((n) => (
          <li
            key={n.id}
            className={`px-4 py-3 transition-colors hover:bg-paper-50 ${n.unread ? "bg-brass-500/5" : ""}`}
          >
            <p className="text-sm text-ink-900">{n.text}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-900/40">
              {n.time}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RoleShell({
  children,
  role = "student",
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const items = primaryNav[role];
  const unreadCount = useMemo(
    () => mockNotifications.filter((n) => n.unread).length,
    [],
  );

  useEffect(() => {
    setSidebarOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  function signOut() {
    clearSession();
    router.push("/login");
  }

  function active(href: string) {
    return isActive(pathname, href);
  }

  function sidebarContent(mobile: boolean) {
    return (
      <>
        <div className="flex items-center justify-between px-6 pb-6">
          <Link href="/home" className="font-display text-2xl tracking-tight">
            alumni<span className="text-brass-500">connect</span>
          </Link>
          {mobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1 text-paper-50/60 hover:text-paper-50 focus:outline-none focus:ring-2 focus:ring-brass-500"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 border-b border-paper-50/15 px-6 pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass-500 text-sm font-semibold text-ink-900">
            {getInitials("Ava Mitchell")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-paper-50">
              Ava Mitchell
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-paper-50/45">
              Student · 2025
            </p>
          </div>
        </div>

<nav
          className="mt-6 flex-1 space-y-0.5 px-3"
          aria-label="Primary navigation"
        >
          {items.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => mobile && setSidebarOpen(false)}
              aria-current={active(href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active(href)
                  ? getNavClasses(true, "primary")
                  : getNavClasses(false, "primary")
              }`}
            >
              <Icon size={18} strokeWidth={1.6} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-2 border-t border-paper-50/15 px-3 pt-4">
          <Link
            href="/profile"
            onClick={() => mobile && setSidebarOpen(false)}
            aria-current={active("/profile") ? "page" : undefined}
            className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active("/profile")
                ? getNavClasses(true, "primary")
                : getNavClasses(false, "primary")
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {getInitials("Ava Mitchell")}
            </div>
            <span className="truncate">My Profile</span>
          </Link>
          {secondaryNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => mobile && setSidebarOpen(false)}
              aria-current={active(href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active(href)
                  ? getNavClasses(true, "secondary")
                  : getNavClasses(false, "secondary")
              }`}
            >
              <Icon size={18} strokeWidth={1.6} />
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-paper-50/15 px-6 pt-5">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 text-sm text-paper-50/50 hover:text-paper-50 focus:outline-none focus:ring-2 focus:ring-brass-500"
          >
            <LogOut size={16} />
            Sign out
          </button>
          <p className="px-3 font-mono text-[9px] uppercase tracking-wider text-paper-50/30">
            AlumniConnect v0.1
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 text-ink-900">
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-900/10 bg-ink-900 text-paper-50 md:flex"
      >
        <div className="flex h-full flex-col py-7">
          {sidebarContent(false)}
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink-900/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink-900 text-paper-50 md:hidden"
            >
              <div className="flex h-full flex-col py-7">
                {sidebarContent(true)}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-ink-900/10 bg-paper-50/80 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1.5 text-ink-900/60 hover:text-ink-900 focus:outline-none focus:ring-2 focus:ring-brass-500 md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="flex flex-1 items-center gap-3">
            <Search size={18} className="shrink-0 text-ink-900/35" />
            <input
              type="search"
              placeholder="Search people, roles, or companies"
              className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-900/35 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((v) => !v)}
                className="relative rounded p-1.5 text-ink-900/60 hover:text-ink-900 focus:outline-none focus:ring-2 focus:ring-brass-500"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-clay-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brass-500 text-xs font-semibold text-ink-900">
              {getInitials("Ava Mitchell")}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>

<nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-input bg-white/80 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Primary navigation"
      >
        <ul className="flex items-stretch">
          {items.slice(0, 5).map(({ label, href, icon: Icon }) => (
            <li key={label} className="flex-1">
              <Link
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active(href)
                    ? getNavClasses(true, "primary")
                    : getNavClasses(false, "primary")
                }`}
              >
                <Icon size={20} strokeWidth={active(href) ? 2 : 1.5} />
                <span className="text-[10px] leading-none">{label}</span>
                {active(href) && (
                  <span className="mt-0.5 h-0.5 w-4 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}
