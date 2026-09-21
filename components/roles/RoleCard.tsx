import Image from "next/image";
import Link from "next/link";
import { OrgAvatar } from "@/components/ui/Avatar";
import { metaDate, spotsLabel } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { filledCount } from "@/lib/scoring";
import type { Application, Org, Role } from "@/lib/types";

// Image-top card for the desktop feed grid (DFeed "More near you").
export default function RoleCard({
  role,
  org,
  learnTag,
  applications,
}: {
  role: Role;
  org?: Org;
  learnTag?: string;
  applications: Application[];
}) {
  const image = imageFor(role.image);
  const filled = filledCount(role, applications);
  return (
    <Link
      href={`/roles/${role.id}` as never}
      className="flex flex-col overflow-hidden rounded-card border border-line bg-card text-ink no-underline shadow-card"
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="block h-45 w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="h-45 w-full"
          style={{ background: org?.color ?? "#E9A23B", opacity: 0.3 }}
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <div className="text-[13px] font-medium text-muted">
          {[metaDate(role.date), role.neighborhood].filter(Boolean).join(" · ")}
        </div>
        <div className="text-lg font-semibold leading-[1.25]">{role.title}</div>
        {org && (
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <OrgAvatar org={org} size={18} />
            <span className="truncate">{org.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1 text-[13px]">
          {learnTag ? (
            <div className="rounded-md border border-accent-ink/30 px-1.5 py-0.5 text-xs font-semibold text-accent-ink">
              {learnTag}
            </div>
          ) : (
            <div />
          )}
          <div className="text-muted">{spotsLabel(filled, role.spots)}</div>
        </div>
      </div>
    </Link>
  );
}
