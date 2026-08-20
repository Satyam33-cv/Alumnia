"use client";

import { Check } from "lucide-react";

export type ReferralStatus = "pending" | "accepted" | "referred" | "hired" | "rejected";

const steps = ["Pending", "Accepted", "Referred", "Hired"];

export function ReferralThread({ status }: { status: ReferralStatus }) {
  const currentIndex = status === "rejected" ? -1 : steps.findIndex((step) => step.toLowerCase() === status);

  return (
    <div className="flex w-full items-start" aria-label={`Referral status: ${status}`}>
      {steps.map((step, index) => {
        const complete = currentIndex > index;
        const active = currentIndex === index;
        const rejected = status === "rejected" && index === 0;
        return (
          <div key={step} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-medium transition-colors ${rejected ? "border-clay-500 bg-clay-500 text-white" : complete ? "border-sage-500 bg-sage-500 text-white" : active ? "border-brass-500 bg-brass-500 text-white shadow-[0_0_0_5px_rgba(184,134,59,.12)]" : "border-mist-200 bg-paper-50 text-ink-900/35"}`}>
                {complete ? <Check size={13} /> : index + 1}
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-[0.08em] ${active || complete ? "text-ink-900" : "text-ink-900/40"}`}>{rejected ? "Declined" : step}</span>
            </div>
            {index < steps.length - 1 && <span className={`mt-3 h-[1.5px] flex-1 ${currentIndex > index ? "bg-sage-500" : "bg-brass-500/35"}`} />}
          </div>
        );
      })}
    </div>
  );
}