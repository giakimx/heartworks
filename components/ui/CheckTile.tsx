"use client";

import { CheckIcon } from "@/components/icons";

// Label-wrapped checkbox tile (PostRole requirement checks).
export default function CheckTile({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-input border px-4 py-3 text-sm font-medium transition-colors duration-150 ease-out ${
        checked ? "border-ink bg-white" : "border-line-strong bg-card-soft"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
          checked ? "border-ink bg-ink text-white" : "border-line-strong bg-white"
        }`}
      >
        {checked && <CheckIcon size={13} strokeWidth={2.6} />}
      </span>
      {label}
    </label>
  );
}
