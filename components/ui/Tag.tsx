export default function Tag({
  prefix = "Learn",
  skill,
}: {
  prefix?: string;
  skill: string;
}) {
  return (
    <div className="flex h-7 items-center rounded-full bg-accent-tint px-2.5 text-xs font-semibold text-accent-ink">
      {prefix} · {skill}
    </div>
  );
}
