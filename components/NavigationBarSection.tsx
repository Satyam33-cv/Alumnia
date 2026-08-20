"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Directory", href: "/directory" },
  { label: "Job Board", href: "/jobs" },
  { label: "Spotlight", href: "/stories" },
  { label: "Events", href: "/events" },
];

const notifications = [
  { id: 1, text: "Priya accepted your referral request", time: "2m ago", unread: true },
  { id: 2, text: "New matching alumni in your field", time: "1h ago", unread: true },
  { id: 3, text: "Your referral was viewed by Google", time: "3h ago", unread: false },
];

export function NavigationBarSection() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo text-white font-outfit font-bold text-sm">
            A
          </div>
          <span className="font-outfit text-xl font-bold text-slate-900 tracking-tight">
            Alumnia
          </span>
        </Link>

        {/* Center Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-900/70">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 transition-colors hover:text-indigo ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-indigo"
                  : ""
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-indigo" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-lg p-2 text-slate-900/60 hover:text-slate-900 hover:bg-slate-900/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-900/10 bg-white shadow-card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900/5">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="rounded p-0.5 text-slate-900/40 hover:text-slate-900"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <ul className="max-h-72 divide-y divide-slate-900/5">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                          n.unread ? "bg-indigo/5" : ""
                        }`}
                      >
                        <p className="text-sm text-slate-900">{n.text}</p>
                        <p className="mt-1 text-xs text-slate-900/40 font-mono">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Log In */}
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-900 hover:text-indigo transition-colors rounded-lg hover:bg-indigo/5"
          >
            Log In
          </Link>

          {/* Get Started / Dashboard */}
          <Link
            href="/register"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-white bg-indigo rounded-lg shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md"
          >
            Get Started
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-slate-900/60 hover:text-slate-900 hover:bg-slate-900/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-900/5 bg-white/95 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-indigo/10 text-indigo"
                    : "text-slate-900/70 hover:bg-slate-900/5 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-slate-900/5 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-center text-sm font-semibold text-slate-900 rounded-lg hover:bg-slate-900/5"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-center text-sm font-semibold text-white bg-indigo rounded-lg hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavigationBarSection;