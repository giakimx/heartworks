// Initials avatars + overlapped stack (Role register card, Requests, OrgConfirm).

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
