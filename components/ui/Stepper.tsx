"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

// 44–48px round −/+ with serif numeral (LogShift hours, PostRole spots).
export default function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  suffix,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-5">
      <button
        type="button"
        aria-label={`Fewer ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-card-soft text-ink disabled:opacity-40"
      >
        <MinusIcon size={20} />
      </button>
      <div className="min-w-24 text-center">
        <span className="font-display text-[44px] leading-none tracking-[-0.6px]">
          {value}
        </span>
        {suffix && <span className="pl-1.5 text-sm font-medium text-muted">{suffix}</span>}
      </div>
      <button
        type="button"
        aria-label={`More ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-card-soft text-ink disabled:opacity-40"
      >
        <PlusIcon size={20} />
      </button>
    </div>
  );
}
