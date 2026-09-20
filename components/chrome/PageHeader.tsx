"use client";

// Mobile page header: 44px back chevron + optional trailing action.

import Link from "next/link";
import type { ReactNode } from "react";
import { BackIcon } from "@/components/icons";

export default function PageHeader({
  backHref,
  backLabel = "Back",
  trailing,
  center,
}: {
  backHref: string;
  backLabel?: string;
  trailing?: ReactNode;
  center?: ReactNode;
}) {
  return (
    <div className="flex h-11 items-center justify-between gap-4">
      <Link
        href={backHref as never}
        aria-label={backLabel}
        className="-ml-2.5 flex size-11 items-center justify-center text-ink"
      >
        <BackIcon size={24} strokeWidth={2.2} />
      </Link>
      {center && <div className="min-w-0 flex-1">{center}</div>}
      {trailing ?? <div className="size-11" aria-hidden="true" />}
    </div>
  );
}
