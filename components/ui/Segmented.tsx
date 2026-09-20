"use client";

// 3-up pill switch in a 7% ink track (PostRole work type).
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full bg-ink/7 p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className={`h-10 flex-1 rounded-full text-sm transition-colors duration-150 ease-out ${
            option === value
              ? "bg-white font-semibold text-ink shadow-[0_1px_3px_rgba(31,26,23,0.10)]"
              : "font-medium text-muted"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
