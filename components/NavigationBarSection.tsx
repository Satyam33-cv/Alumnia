"use client";

import Link from "next/link";

export function NavigationBarSection() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-center w-full h-16 glass border-b border-border">
      <Link
        href="/home"
        className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 rounded-lg"
        aria-label="AlumniConnect Homepage"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple text-canvas font-heading font-semibold text-lg">
          AC
        </div>
        <span className="hidden font-heading text-xl font-semibold tracking-tight text-ink sm:block">
          alumni<span className="text-purple">connect</span>
        </span>
      </Link>
    </header>
  );
}

export default NavigationBarSection;