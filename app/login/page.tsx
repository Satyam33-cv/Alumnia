"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const { setSession } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");
    if (!email.trim() || !password) {
      setServerError("Enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const session = await apiClient.auth.login({ email: email.trim(), password });
      setSession(session);
      router.push("/home");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "We could not sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-200 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Alumnia</span>
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-xs text-slate-500">Sign in to manage your Webhooks &amp; AI Agents</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="text-xs font-semibold text-slate-500 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@alumnia.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="text-xs font-semibold text-slate-500 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {serverError ? <p role="alert" className="text-xs text-red-500">{serverError}</p> : null}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                <span className="text-slate-500">Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-600 font-semibold hover:underline">Forgot password?</a>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20">
              {isSubmitting ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <p className="text-xs text-center text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right: Feature Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff08_1px,transparent_1px),linear-gradient(-45deg,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-white/10 blur-[100px]" />
        <div className="relative z-10 max-w-md space-y-8">
          <blockquote className="text-xl font-medium leading-relaxed">
            &ldquo;Alumnia bridged the gap between our graduating batch and alumni at top tech firms, making warm referrals structured and transparent.&rdquo;
          </blockquote>
          <p className="text-xs text-indigo-200">— University Career &amp; Placement Cell</p>
          <div className="space-y-4">
            {["Instant AI matching with 384-dim vectors", "Verified alumni across 40+ companies", "Skillshare-style courses for career growth"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</div>
                <span className="text-sm text-indigo-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}