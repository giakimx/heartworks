import type { ReactNode } from "react";

// Eyebrow label + 52px input, 14px radius (PostRole).

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
      {children}
    </div>
  );
}

export const inputClass =
  "h-13 w-full rounded-input border border-line-strong bg-card-soft px-4 text-base text-ink placeholder:text-muted/70";

export default function Field({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
        {label}
      </label>
      {children}
      {error && <div className="text-[13px] font-medium text-accent-ink">{error}</div>}
    </div>
  );
}
