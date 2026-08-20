import { forwardRef, useId } from "react";

export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  dark?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "label">;

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, dark = false, id, className = "", ...rest },
  ref
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const describedBy = [hint ? `${inputId}-hint` : null, error ? `${inputId}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <label htmlFor={inputId} className={`block text-sm font-medium ${dark ? "text-paper-50" : "text-ink-900"}`}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={`mt-2 w-full border-b bg-transparent px-0 py-3 outline-none transition-colors ${dark ? "border-paper-50/25 placeholder:text-paper-50/25" : "border-ink-900/20 placeholder:text-ink-900/25"} focus:border-brass-500 ${error ? "border-clay-500" : ""} ${className}`}
        {...rest}
      />
      {hint && !error ? <span id={`${inputId}-hint`} className="mt-2 block text-xs text-ink-900/50">{hint}</span> : null}
      {error ? <span id={`${inputId}-err`} className="mt-2 block text-xs text-clay-500">{error}</span> : null}
    </label>
  );
});
