// apps/web/src/app/page.js
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Compass, HeartHandshake, Search, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[24px] bg-navy px-7 py-10 text-white md:px-12 md:py-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-gold/20" />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-gold/20" />
        <div className="relative max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-gold"><Sparkles size={15} /> ALUMNI, IN MOTION</div>
          <h1 className="display-serif text-4xl leading-tight md:text-6xl">Your next chapter starts with a connection.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/70 md:text-lg">A living network for finding opportunities, sharing hard-won wisdom, and showing up for the people who come after you.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/jobs" className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 font-bold text-navy transition hover:bg-white">Explore opportunities <ArrowRight size={17} /></Link><Link href="/alumni" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 font-bold text-white transition hover:border-gold hover:text-gold">Meet the network</Link></div>
        </div>
        <div className="relative mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/15 pt-5 text-sm"><div><strong className="block text-2xl text-gold">1,240+</strong><span className="text-white/55">Alumni connected</span></div><div><strong className="block text-2xl text-gold">86</strong><span className="text-white/55">Open opportunities</span></div><div><strong className="block text-2xl text-gold">94%</strong><span className="text-white/55">Would recommend</span></div></div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <FeatureCard icon={<BriefcaseBusiness />} title="Career board" desc="Roles shared by people in your network" href="/jobs" />
        <FeatureCard icon={<Compass />} title="Alumni network" desc="Find peers by industry, place, and story" href="/alumni" />
        <FeatureCard icon={<HeartHandshake />} title="Referrals" desc="Turn a warm connection into a real opportunity" href="/referrals/me" />
        <FeatureCard icon={<CalendarDays />} title="Gather together" desc="Events that keep the community close" href="/events" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-line bg-surface p-6 md:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-[0.16em] text-bronze">START HERE</p><h2 className="display-serif mt-2 text-3xl text-navy">Make your network work for you.</h2></div><Search className="text-bronze" size={24} /></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><QuickLink href="/jobs" title="Find an opportunity" detail="Browse roles posted by alumni" /><QuickLink href="/alumni" title="Meet an alum" detail="Search the directory" /><QuickLink href="/matching" title="See your matches" detail="Personalized connections" /><QuickLink href="/stories" title="Read a journey" detail="Learn from the community" /></div></div>
        <div className="rounded-2xl border border-gold/50 bg-gold p-6 md:p-8"><p className="text-xs font-bold tracking-[0.16em] text-bronze">THE SMALL GESTURE</p><h2 className="display-serif mt-3 text-3xl text-navy">Someone helped you get here.</h2><p className="mt-4 leading-7 text-navy/70">Be the person who answers the message, shares the opening, or makes the introduction.</p><Link href="/stories" className="mt-7 inline-flex items-center gap-2 font-bold text-navy">Share your story <ArrowRight size={17} /></Link></div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, href }) {
  return (
    <Link href={href} className="group rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-bronze hover:shadow-lg hover:shadow-navy/5"><div className="mb-8 text-bronze transition group-hover:text-navy">{icon}</div><h3 className="font-bold text-navy">{title}</h3><p className="mt-1 text-sm leading-6 text-muted">{desc}</p></Link>
  );
}

function QuickLink({ href, title, detail }) {
  return <Link href={href} className="flex items-center justify-between rounded-xl border border-line bg-ivory p-4 transition hover:border-bronze"><span><strong className="block text-sm text-ink">{title}</strong><span className="mt-1 block text-xs text-muted">{detail}</span></span><ArrowRight size={17} className="text-bronze" /></Link>;
}
