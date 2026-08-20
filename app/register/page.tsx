import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Your Profile | AlumniConnect",
  description: "Register for the alumni network and create your profile to connect with fellow graduates",
  openGraph: {
    title: "Register - AlumniConnect",
    description: "Register for the alumni network and create your profile to connect with fellow graduates",
    images: ["https://alumni-connect.example.com/og-register.png"],
  },
  twitter: {
    title: "Register - AlumniConnect",
    description: "Register for the alumni network and create your profile to connect with fellow graduates",
    card: "summary_large_image",
  },
};

export default function RegisterPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-ink-900 px-6 py-14 text-paper-50">
			<div className="w-full max-w-lg">
				<Link href="/" className="inline-flex items-center gap-2 text-sm text-paper-50/55 hover:text-brass-500"><ArrowLeft size={16} /> Back home</Link>
				<div className="mt-20">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-500">Start your profile</p>
					<h1 className="mt-3 font-display text-5xl sm:text-6xl">Your people are closer than you think.</h1>
					<RegisterForm />
					<p className="mt-8 text-sm text-paper-50/50">Already a member? <Link href="/login" className="text-brass-500 underline underline-offset-4">Sign in</Link></p>
				</div>
			</div>
		</main>
	);
}