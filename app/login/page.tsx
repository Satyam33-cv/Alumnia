import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign In | AlumniConnect" };

export default function LoginPage() {
	return (
		<main className="grid min-h-screen lg:grid-cols-[.8fr_1.2fr]">
			<section className="hidden bg-ink-900 p-10 text-paper-50 lg:flex lg:flex-col lg:justify-between">
				<Link href="/" className="font-display text-2xl">alumni<span className="text-brass-500">connect</span></Link>
				<div><p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-brass-500">Welcome back</p><h1 className="max-w-md font-display text-6xl leading-[.95]">Your next connection is waiting.</h1></div>
				<p className="font-mono text-[10px] uppercase tracking-wider text-paper-50/35">AlumniConnect / member portal</p>
			</section>
			<section className="flex items-center justify-center px-6 py-14">
				<div className="w-full max-w-md">
					<Link href="/" className="mb-16 inline-flex items-center gap-2 text-sm text-ink-900/55 hover:text-brass-500"><ArrowLeft size={16} /> Back home</Link>
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-sage-500">Member sign in</p>
					<h2 className="mt-3 font-display text-5xl">Good to see you.</h2>
					<LoginForm />
					<p className="mt-8 text-sm text-ink-900/55">New here? <Link href="/register" className="font-semibold text-sage-500 underline underline-offset-4">Create an account</Link></p>
				</div>
			</section>
		</main>
	);
}