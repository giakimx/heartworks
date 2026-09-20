"use client";

import Link from "next/link";
import { PlusIcon } from "@/components/icons";
import Stamp from "./Stamp";
import type { Stamp as StampType } from "@/lib/types";

// Mobile: scattered collage (absolute positions from the reference).
// Positions cycle in rows of two; the dashed slot takes the next position.
const POSITIONS = [
  { left: 4, top: 8, r: -5 },
  { left: 184, top: 36, r: 6 },
  { left: 14, top: 252, r: 3 },
  { left: 190, top: 268, r: -4 },
  { left: 8, top: 496, r: 5 },
  { left: 186, top: 512, r: -3 },
  { left: 12, top: 740, r: -4 },
  { left: 188, top: 756, r: 4 },
];

export default function StampWall({
  stamps,
  orgNameFor,
}: {
  stamps: StampType[];
  orgNameFor: (orgId: string) => string;
}) {
  const shown = stamps.slice(0, POSITIONS.length - 1);
  const slot = POSITIONS[shown.length];
  const height =
    Math.max(...[...POSITIONS.slice(0, shown.length), slot].map((p) => p.top)) + 216;

  // desktop wall: stamps + the find-next slot + faint empty slots up to 6
  const desktopStamps = stamps.slice(0, 4);
  const emptySlots = Math.max(0, 6 - desktopStamps.length - 1);
  const EMPTY_ROTATIONS = [-4, 2, 5, -3];

  return (
    <>
      <div className="relative lg:hidden" style={{ height }}>
        {shown.map((stamp, i) => (
          <div
            key={stamp.id}
            className="absolute"
            style={{ left: POSITIONS[i].left, top: POSITIONS[i].top }}
          >
            <Stamp stamp={stamp} orgName={orgNameFor(stamp.orgId)} rotation={POSITIONS[i].r} />
          </div>
        ))}
        <Link
          href="/discover"
          className="absolute box-border flex h-[182px] w-35 flex-col items-center justify-center gap-2 rounded-[4px] border-[1.5px] border-dashed border-[rgba(31,26,23,0.28)] p-3 text-center text-[13px] font-semibold text-muted no-underline"
          style={{ left: slot.left + 6, top: slot.top + 16, transform: `rotate(${slot.r}deg)` }}
        >
          <PlusIcon size={22} />
          Find your next stamp
        </Link>
      </div>

      <div className="hidden items-center justify-between rounded-hero border border-[rgba(31,26,23,0.06)] bg-white/50 px-8 py-9 lg:flex">
        {desktopStamps.map((stamp, i) => (
          <Stamp
            key={stamp.id}
            stamp={stamp}
            orgName={orgNameFor(stamp.orgId)}
            rotation={POSITIONS[i].r}
          />
        ))}
        <Link
          href="/discover"
          className="box-border flex h-[182px] w-35 shrink-0 rotate-3 flex-col items-center justify-center gap-2 rounded-[4px] border-[1.5px] border-dashed border-[rgba(31,26,23,0.28)] p-3 text-center text-[13px] font-semibold text-muted no-underline"
        >
          <PlusIcon size={22} />
          Find your next stamp
        </Link>
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="box-border h-[182px] w-35 shrink-0 rounded-[4px] border-[1.5px] border-dashed border-[rgba(31,26,23,0.16)]"
            style={{ transform: `rotate(${EMPTY_ROTATIONS[i % EMPTY_ROTATIONS.length]}deg)` }}
          />
        ))}
      </div>
    </>
  );
}
