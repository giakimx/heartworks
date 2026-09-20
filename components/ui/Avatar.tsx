// Initials avatars + overlapped stack (Role register card, Requests, OrgConfirm).

/* eslint-disable @next/next/no-img-element -- tiny fixed-size circles */

import { orgIconFor } from "@/lib/images";
import type { Org } from "@/lib/types";

// Org icon circle: the org's icon image when we have one, else the colored
// initials circle from the reference screens.
export function OrgAvatar({
  org,
  size,
  showInitials = true,
}: {
  org: Org;
  size: number;
  showInitials?: boolean;
}) {
  const icon = orgIconFor(org.id);
  if (icon) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-ink"
      style={{
        width: size,
        height: size,
        background: org.color,
        fontSize: Math.round(size * 0.33),
      }}
    >
      {showInitials && size >= 32 ? org.initials : ""}
    </div>
  );
}

export function InitialsAvatar({
  initials,
  color,
  size = 40,
  fontSize,
}: {
  initials: string;
  color: string;
  size?: number;
  fontSize?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-ink/80"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: fontSize ?? Math.round(size * 0.36),
      }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({ colors, size = 28 }: { colors: string[]; size?: number }) {
  return (
    <div className="flex" aria-hidden="true">
      {colors.map((color, i) => (
        <div
          key={i}
          className="rounded-full ring-2 ring-white"
          style={{
            width: size,
            height: size,
            background: color,
            marginLeft: i === 0 ? 0 : -Math.round(size * 0.3),
          }}
        />
      ))}
    </div>
  );
}
