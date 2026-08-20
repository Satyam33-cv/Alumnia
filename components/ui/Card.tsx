import { forwardRef } from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "dark";
  padding?: "sm" | "md" | "lg";
};

const tones = {
  default: "border border-ink-900/10 bg-white/70",
  muted: "border border-ink-900/10 bg-paper-50/60",
  dark: "bg-ink-900 text-paper-50 border border-ink-900"
} as const;

const padding = { sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" } as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone = "default", padding: pad = "md", className = "", ...rest },
  ref
) {
  return <div ref={ref} className={`${tones[tone]} ${padding[pad]} ${className}`} {...rest} />;
});
