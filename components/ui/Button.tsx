import { type LucideIcon } from "lucide-react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const base = "group inline-flex items-center justify-center gap-3 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brass-500 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink-900 text-paper-50 hover:bg-brass-500",
  secondary: "bg-brass-500 text-white hover:bg-ink-900",
  ghost: "text-ink-900 underline decoration-mist-200 underline-offset-8 transition-colors hover:decoration-brass-500 focus:ring-0"
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3.5 text-sm",
  sm: "px-4 py-2.5 text-xs"
};

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: Variant;
  size?: Size;
  iconRight?: LucideIcon;
  children?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", iconRight: Icon, className = "", children, ...rest },
  ref
) {
  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
      {Icon ? <Icon size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> : null}
    </button>
  );
});
