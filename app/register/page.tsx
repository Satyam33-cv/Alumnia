"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Building, GraduationCap, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "alumni">("student");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-200 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Alumnia</span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-xs text-slate-500">Join 1,200+ alumni and students building careers together</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            {(["student", "alumni"] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                role === r ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}>
                {r === "student" ? "I'm a Student" : "I'm an Alumni"}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input placeholder="John" className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Last Name</label>
                <input placeholder="Smith" className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" placeholder="you@university.edu" className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
              </div>
            </div>

            {role === "alumni" && (
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input placeholder="Google" className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20">
              Create Account
            </button>
          </form>

          <p className="text-xs text-center text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right: Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff08_1px,transparent_1px),linear-gradient(-45deg,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-white/10 blur-[100px]" />
        <div className="relative z-10 max-w-md space-y-8">
          <div className="text-4xl font-extrabold leading-tight">Your network is your net worth.</div>
          <p className="text-indigo-100">Connect with verified alumni from 40+ companies, get personalized referrals, and access exclusive Skillshare-style courses.</p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { n: "1,200+", l: "Alumni" },
              { n: "85%", l: "Referral Rate" },
              { n: "384-Dim", l: "AI Matching" },
              { n: "450+", l: "Courses" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold">{s.n}</p>
                <p className="text-xs text-indigo-200">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}