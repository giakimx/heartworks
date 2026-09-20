"use client";

// The signature element (docs/DESIGN.md § stamp). 154×196 — both multiples of
// the 14px perforation pitch. Plain <img>: a fixed 126×112 crop inside a
// rotated, drop-shadowed collage is nothing next/image can improve.

import { shortDate } from "@/lib/format";
import { imageFor } from "@/lib/images";
import type { Stamp as StampType } from "@/lib/types";

// Random-but-stable rotation between −5° and 6°, seeded from the stamp id.
export function stampRotation(id: string): number {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return (Math.abs(hash) % 12) - 5;
}

// Live-earned stamps get uid()-style ids ("s_…"); seeded ones are "s1", "s2".
function isLiveEarned(id: string): boolean {
  return id.startsWith("s_");
}

export default function Stamp({
  stamp,
  orgName,
  rotation,
}: {
  stamp: StampType;
  orgName: string;
  rotation?: number;
}) {
  const image = imageFor(stamp.image);
  const deg = rotation ?? stampRotation(stamp.id);
  return (
    <div
      className={`stamp ${isLiveEarned(stamp.id) ? "stamp-enter" : ""}`}
      style={
        {
          transform: `rotate(${deg}deg)`,
          "--stamp-rotation": `${deg}deg`,
        } as React.CSSProperties
      }
    >
      <div className="stamp-inner">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={`${orgName} stamp`}
            className="box-border block h-28 w-[126px] border-[1.5px] border-accent object-cover"
          />
        ) : (
          <div className="box-border h-28 w-[126px] border-[1.5px] border-accent bg-accent-tint" />
        )}
        <div className="font-display text-[13px] leading-[1.1]">{orgName}</div>
        <div className="flex items-baseline justify-between gap-1 text-[11px] text-muted">
          <div className="truncate whitespace-nowrap">
            {stamp.place ? `${stamp.place} · ` : ""}
            {shortDate(stamp.date)}
          </div>
          <div className="whitespace-nowrap font-bold text-accent-ink">
            {stamp.hours} HRS
          </div>
        </div>
      </div>
    </div>
  );
}
