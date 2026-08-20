// apps/web/src/components/Navbar.js
'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { Compass, BriefcaseBusiness, CalendarDays, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-line/70 bg-ivory/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-[76px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center font-bold text-lg shadow-sm">A</span>
          <span className="hidden sm:block"><span className="block text-[15px] font-bold tracking-tight text-navy">Alumnia</span><span className="block text-[9px] font-semibold tracking-[0.2em] text-bronze">THE NETWORK</span></span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-semibold text-muted">
          <Link href="/alumni" className="ink-link hidden md:flex items-center gap-1.5"><Compass size={16} /> Network</Link>
          <Link href="/events" className="ink-link hidden md:flex items-center gap-1.5"><CalendarDays size={16} /> Events</Link>
          <Link href="/jobs" className="ink-link hidden md:flex items-center gap-1.5"><BriefcaseBusiness size={16} /> Jobs</Link>
          {user && <Link href="/referrals/me" className="ink-link hidden lg:block">Referrals</Link>}
          {user?.role === 'STUDENT' && <Link href="/matching" className="ink-link hidden lg:flex items-center gap-1.5"><Sparkles size={15} /> Matches</Link>}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="ink-link text-bronze font-bold">Admin</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link href="/profile" className="flex items-center gap-2 ink-link">
                <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center font-bold text-gold text-xs">
                  {user.name?.[0]}
                </div>
                <span className="hidden sm:block">{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="hidden lg:flex items-center gap-1 text-muted hover:text-red-700">Logout <ArrowUpRight size={14} /></button>
            </div>
          ) : (
            <>
              <Link href="/login" className="ink-link">Sign in</Link>
              <Link href="/register" className="bg-navy text-white px-4 py-2.5 rounded-lg hover:bg-bronze transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
