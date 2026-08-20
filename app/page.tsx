"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Search, ArrowRight, ShieldCheck, Terminal, Zap,
  Globe, Database, Cpu, BookOpen, ChevronRight, Play,
} from "lucide-react";
import { PreLoginNav } from "@/components/PreLoginNav";
import { ThemeToggle } from "@/components/ThemeToggle";

const capabilities = [
  { icon: Search, title: "Deep Web Search", desc: "Extract real-time web intelligence using autonomous data crawlers.", color: "text-blue-600" },
  { icon: Terminal, title: "Webhook Execution", desc: "Trigger API payloads effortlessly with active secret key validation.", color: "text-indigo-600" },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "Bank-grade encryption for all API keys, integrations, and user data.", color: "text-emerald-500" },
  { icon: Cpu, title: "Deep Research Agents", desc: "AI agents that browse, extract, and synthesize web data for you.", color: "text-violet-600" },
  { icon: Globe, title: "FindAll Crawler", desc: "Discover every relevant page, profile, and data point across the web.", color: "text-blue-600" },
  { icon: Database, title: "Data Enrichment", desc: "Auto-enrich profiles with verified emails, roles, and company data.", color: "text-indigo-600" },
];

const stats = [
  { value: "1,200+", label: "Verified Alumni" },
  { value: "85%", label: "Referral Rate" },
  { value: "384-Dim", label: "AI Matching" },
  { value: "450+", label: "Courses" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <PreLoginNav />

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Alumni Automation
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Extract, Enrich &amp; Research
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Your Career Network</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Automate referral pipelines, AI-powered matching, and live alumni analysis with modern agentic workflows.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link href="/register" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/education" className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl font-semibold transition-colors">
                Explore Docs
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="max-w-3xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPABILITIES GRID ── */}
        <section className="py-20 px-6 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">Platform Capabilities</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Everything you need to get referred</h2>
              <p className="text-slate-500 dark:text-slate-400">Six powerful tools working together to connect you with the right alumni.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <c.icon className={`w-6 h-6 ${c.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── API PREVIEW ── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Developer API</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Integrate in minutes</h2>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 dark:bg-slate-950 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs text-slate-500 font-mono">api-preview.js</span>
              </div>
              <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`const alumnia = require('alumnia');

// Find alumni at a company
const matches = await alumnia.search({
  company: "Google",
  skills: ["React", "System Design"],
  minMatchScore: 85,
});

// Request a referral
const referral = await alumnia.referrals.create({
  alumniId: matches[0].id,
  message: "Hi! I'd love to connect about the SWE role.",
  resumeUrl: "https://my-resume.pdf",
});

console.log(referral.status); // "pending"`}
              </pre>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-3xl bg-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff08_1px,transparent_1px),linear-gradient(-45deg,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-extrabold">Start your journey today</h2>
              <p className="text-indigo-100 max-w-lg mx-auto">Join 1,200+ alumni and students building meaningful careers through verified connections.</p>
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}