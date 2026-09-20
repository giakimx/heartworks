"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartFilledIcon } from "@/components/icons";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { compactTimeRange, metaDate, spotsLabel } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { filledCount } from "@/lib/scoring";
import type { Application, Org, Role, Skill } from "@/lib/types";

// Top match card: stacked on mobile, horizontal on desktop (via `horizontal`).
export default function FeatureRoleCard({
  role,
  org,
  tags,
  applications,
  horizontal = false,
}: {
  role: Role;
  org?: Org;
  tags: Skill[];
  applications: Application[];
  horizontal?: boolean;
}) {
  const image = imageFor(role.image);
  const filled = filledCount(role, applications);
  const meta = [
    metaDate(role.date),
    compactTimeRange(role.start, role.end),
    role.neighborhood,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/roles/${role.id}` as never}
      className={`flex overflow-hidden rounded-feature border border-line bg-[rgba(255,255,255,0.8)] text-ink no-underline shadow-card ${
        horizontal ? "flex-row" : "flex-col"
      }`}
    >
      <div className={`relative ${horizontal ? "w-[480px] shrink-0" : "h-47"}`}>
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            className={`block object-cover ${horizontal ? "h-full w-full" : "h-47 w-full"}`}
          />
        )}
        <div className="absolute left-3 top-3 flex h-7.5 items-center gap-1.5 rounded-full bg-white/90 px-3 text-xs font-semibold text-ink backdrop-blur-[10px]">
          <HeartFilledIcon size={14} className="text-accent" />
          Top match
        </div>
      </div>
      <div className={`flex flex-col gap-2.5 p-4 ${horizontal ? "grow justify-center gap-3 p-8" : ""}`}>
        <div className="text-[13px] font-medium text-muted">{meta}</div>
        <div className={`font-display leading-[1.15] ${horizontal ? "text-[34px]" : "text-[22px]"}`}>
          {role.title}
        </div>
        {org && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="size-5 rounded-full" style={{ background: org.color }} />
            {org.name}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((skill) => (
            <Tag key={skill} skill={skill} />
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <ProgressBar filled={filled} total={role.spots} className="w-21" />
            <div className="text-[13px] text-muted">
              {spotsLabel(role.spots - filled)}
            </div>
          </div>
          <div className="flex h-9 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
            View role
          </div>
        </div>
      </div>
    </Link>
  );
}
