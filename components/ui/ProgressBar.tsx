export default function ProgressBar({
  filled,
  total,
  className = "",
}: {
  filled: number;
  total: number;
  className?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={total}
      className={`h-1.5 overflow-hidden rounded-[6px] bg-ink/10 ${className}`}
    >
      <div
        className="h-1.5 rounded-[6px] bg-accent transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
