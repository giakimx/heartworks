"use client";

// 44px toggle chip (Onboarding, LogShift, PostRole). 40px = FilterChip (Feed).

export function Chip({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={`h-11 rounded-full px-4 text-[15px] font-medium transition-colors duration-150 ease-out ${
        on
          ? "border border-ink bg-ink text-white"
          : "border border-[rgba(31,26,23,0.12)] bg-card-soft text-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function FilterChip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-10 shrink-0 rounded-full px-4 text-sm transition-colors duration-150 ease-out ${
        on
          ? "border border-ink bg-ink font-semibold text-white"
          : "border border-[rgba(31,26,23,0.12)] bg-card-soft font-medium text-ink"
      }`}
    >
      {label}
    </button>
  );
}
