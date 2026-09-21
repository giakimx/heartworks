"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartFilledIcon } from "@/components/icons";
import { OrgAvatar } from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { timeRange, metaDate, spotsLabel } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { filledCount } from "@/lib/scoring";
import type { Application, Org, Role, Skill } from "@/lib/types";

// Top match card: stacked on mobile, horizontal on desktop (via `horizontal`).
export default function FeatureRoleCard({
  role,
  org,
  tags,
  applications,
}: {
  role: Role;
  org?: Org;
  tags: Skill[];
  applications: Application[];
}) {
  const image = imageFor(role.image);
  const filled = filledCount(role, applications);
  const meta = [
    metaDate(role.date),
    timeRange(role.start, role.end),
    role.neighborhood,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/roles/${role.id}` as never}
      className="flex flex-col overflow-hidden rounded-feature border border-line bg-[rgba(255,255,255,0.8)] text-ink no-underline shadow-card lg:grid lg:grid-cols-[480px_minmax(0,1fr)] lg:rounded-hero"
    >
      <div className="relative h-47 lg:h-80">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            className="block h-47 w-full object-cover lg:h-80"
          />
        )}
        <div className="absolute left-3 top-3 flex h-7.5 items-center gap-1.5 rounded-full bg-white/90 px-3 text-xs font-semibold text-ink backdrop-blur-[10px] lg:left-4 lg:top-4 lg:h-8 lg:px-3.5 lg:text-[13px]">
          <HeartFilledIcon size={14} className="text-accent" />
          Top match
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-4 lg:justify-center lg:gap-3.5 lg:px-10 lg:py-9">
        <div className="text-[13px] font-medium text-muted lg:text-sm">{meta}</div>
        <div className="font-display text-[22px] leading-[1.15] tracking-[-0.4px] lg:text-[34px] lg:leading-[1.1]">
          {role.title}
        </div>
        {org && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <OrgAvatar org={org} size={20} />
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
              {spotsLabel(filled, role.spots)}
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
