import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { OrgAvatar } from "@/components/ui/Avatar";
import { metaDate } from "@/lib/format";
import { imageFor } from "@/lib/images";
import type { Org, Role } from "@/lib/types";

// Feed row: meta / title / learn+spots, 76px thumb right, top divider.
export default function RoleRow({
  role,
  org,
  learnTag,
  spotsText,
  trailing,
}: {
  role: Role;
  org?: Org;
  learnTag?: string;
  spotsText?: string;
  trailing?: ReactNode;
}) {
  const image = imageFor(role.image);
  return (
    <Link
      href={`/roles/${role.id}` as never}
      className="flex items-center gap-3.5 border-t border-line py-3.5 text-ink no-underline"
    >
      <div className="flex min-w-0 grow flex-col gap-[5px]">
        {/* single line: a too-long org name ellipsizes instead of wrapping */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
          {metaDate(role.date) && (
            <span className="shrink-0 whitespace-nowrap">{metaDate(role.date)}</span>
          )}
          {metaDate(role.date) && org && <span className="shrink-0">·</span>}
          {org && (
            <span className="flex min-w-0 items-center gap-1.5">
              <OrgAvatar org={org} size={16} />
              <span className="truncate">{org.name}</span>
            </span>
          )}
        </div>
        <div className="text-[17px] font-semibold leading-[1.25]">{role.title}</div>
        <div className="flex items-center gap-2 text-[13px] text-muted">
          {learnTag && (
            <div className="rounded-md border border-accent-ink/30 px-1.5 py-0.5 text-xs font-semibold text-accent-ink">
              {learnTag}
            </div>
          )}
          {spotsText && <div>{spotsText}</div>}
          {trailing}
        </div>
      </div>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={152}
          height={152}
          className="size-19 shrink-0 rounded-thumb object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="size-19 shrink-0 rounded-thumb"
          style={{ background: org?.color ?? "#E9A23B", opacity: 0.35 }}
        />
      )}
    </Link>
  );
}
