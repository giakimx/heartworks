import Tag from "@/components/ui/Tag";
import { spotsLabel } from "@/lib/format";

// Live preview beside the desktop post-a-role form (DPostRole).
export default function RolePreviewCard({
  title,
  orgName,
  orgColor,
  neighborhood,
  workType,
  taught,
  spots,
}: {
  title: string;
  orgName?: string;
  orgColor?: string;
  neighborhood?: string;
  workType: string;
  taught: string[];
  spots: number;
}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-feature border border-line bg-card p-5 shadow-card">
      <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
        How volunteers see it
      </div>
      <div className="text-[13px] font-medium text-muted">
        {[neighborhood, workType].filter(Boolean).join(" · ")}
      </div>
      <div className="font-display text-2xl leading-[1.15]">
        {title.trim() || "Your role title"}
      </div>
      {orgName && (
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="size-5 rounded-full" style={{ background: orgColor }} />
          {orgName}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {taught.slice(0, 3).map((skill) => (
          <Tag key={skill} skill={skill} />
        ))}
        {taught.length === 0 && (
          <div className="text-[13px] text-muted">Learn tags show up here</div>
        )}
      </div>
      <div className="text-[13px] text-muted">{spotsLabel(spots)}</div>
    </div>
  );
}
