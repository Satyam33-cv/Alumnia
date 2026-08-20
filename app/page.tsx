import Link from "next/link";
import { ArrowUpRight, Compass, Network, Sparkles } from "lucide-react";

const signals = [
  { icon: Network, label: "12,480", detail: "alumni in the network" },
  { icon: Compass, label: "94%", detail: "of students find a useful lead" },
  { icon: Sparkles, label: "1 thread", detail: "can change a whole career" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-primary">
          alumni<span className="text-secondary">connect</span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/home" className="hidden px-4 py-2.5 text-primary transition-colors hover:text-secondary sm:block">Sign in</Link>
          <Link href="/register" className="rounded-full bg-primary px-5 py-2.5 text-background transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">Join the network</Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-secondary">A better way forward</p>
          <h1 className="max-w-3xl font-display text-6xl leading-[0.96] tracking-tight text-primary sm:text-7xl lg:text-[5.8rem]">
            Keep the <span className="italic text-secondary">thread</span> going.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-primary/70">
            AlumniConnect turns the people you already know into the opportunities you have been looking for. Find a guide, share what you know, and move forward together.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/register" className="group inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Find your next connection <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/login" className="text-sm font-semibold text-primary underline decoration-outlineVariant underline-offset-8 transition-colors hover:decoration-secondary">I already have an account</Link>
          </div>
        </div>

        <div className="relative min-h-[440px] lg:min-h-[530px]">
          <div className="absolute right-3 top-0 h-[390px] w-[86%] rotate-3 border border-secondary/30 bg-surfaceContainerHigh lg:h-[470px]" />
          <div className="absolute bottom-3 left-2 h-[390px] w-[86%] -rotate-6 border border-primary/10 bg-tertiaryOnContainer/90 lg:h-[470px]" />
          <div className="relative z-10 flex h-[390px] w-[86%] flex-col justify-between bg-primary p-7 text-background shadow-card lg:h-[470px] lg:p-10">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">Referral thread / 024</span>
              <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_0_5px_rgba(123,88,11,.2)]" />
            </div>
            <div>
              <p className="font-mono text-xs text-background/50">A small introduction</p>
              <p className="mt-4 max-w-sm font-display text-4xl leading-tight lg:text-5xl">&ldquo;The right person, at the right moment.&rdquo;</p>
            </div>
            <div className="flex items-end justify-between border-t border-background/15 pt-5 text-xs text-background/65">
              <span>Student → Alumna</span><span className="font-mono text-secondary">CONNECTED</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/10 bg-surfaceContainerLow/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3 lg:px-10">
          {signals.map(({ icon: Icon, label, detail }) => (
            <div key={detail} className="flex items-center gap-4">
              <Icon size={18} strokeWidth={1.5} className="text-secondary" />
              <div><span className="font-display text-2xl">{label}</span><p className="mt-0.5 text-xs text-primary/55">{detail}</p></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}