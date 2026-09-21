// Inline stroke icons copied from the reference screens (design/screens/**).
// 24 viewBox, stroke 2–2.4, round caps. No icon library.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({
  size = 18,
  strokeWidth = 2,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.6a4.3 4.3 0 017.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
    </Icon>
  );
}

export function HeartFilledIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.6a4.3 4.3 0 017.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Icon>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </Icon>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Icon>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </Icon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z" />
    </Icon>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="0.75" fill="currentColor" />
      <circle cx="4.5" cy="12" r="0.75" fill="currentColor" />
      <circle cx="4.5" cy="18" r="0.75" fill="currentColor" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13.5 13.5 0 014 9 13.5 13.5 0 01-4 9 13.5 13.5 0 01-4-9 13.5 13.5 0 014-9z" />
    </Icon>
  );
}

// Skill icons for the browse tiles, same 24-viewBox stroke style.

export function BrushIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 3l4 4L8.5 19.5 3 21l1.5-5.5L17 3z" />
      <path d="M14.5 5.5l4 4" />
    </Icon>
  );
}

export function SproutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21v-8" />
      <path d="M12 13C12 9.8 9.4 7.5 6 7.5c0 3.6 2.6 5.5 6 5.5z" />
      <path d="M12 13c0-3.2 2.6-5.5 6-5.5 0 3.6-2.6 5.5-6 5.5z" />
    </Icon>
  );
}

export function FileTextIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Icon>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 4h6a4 4 0 014 4v12a3 3 0 00-3-3H2V4z" />
      <path d="M22 4h-6a4 4 0 00-4 4v12a3 3 0 013-3h7V4z" />
    </Icon>
  );
}

export function HammerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 11.5L5 21l-2-2 9.5-9.5" />
      <path d="M13 4l7 7 2-2-1.5-1.5a3 3 0 00-2-4.9L16 2l-3 2z" />
    </Icon>
  );
}

export function PawIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      {...props}
    >
      <circle cx="6" cy="10" r="1.8" />
      <circle cx="12" cy="7.5" r="1.9" />
      <circle cx="18" cy="10" r="1.8" />
      <path d="M12 11.5c-3 0-5.3 2.4-5.3 4.8 0 1.7 1.2 2.9 2.7 2.9 1.1 0 1.6-.6 2.6-.6s1.5.6 2.6.6c1.5 0 2.7-1.2 2.7-2.9 0-2.4-2.3-4.8-5.3-4.8z" />
    </svg>
  );
}

export function RollerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="13" height="5" rx="1.5" />
      <path d="M16 6.5h3.5V11H12v3.5" />
      <path d="M12 14.5V21" />
    </Icon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
      <path d="M16.5 4.8a3.5 3.5 0 010 6.4M18 14.8c2.1.8 3.5 2.6 3.5 5.2" />
    </Icon>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 10.5L19 5v13L3 13.5v-3z" />
      <path d="M7 14v4a2 2 0 002 2h1" />
    </Icon>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-5.1A8.5 8.5 0 1121 11.5z" />
      <path d="M8.5 12.5c.9.9 2.1 1.4 3.5 1.4s2.6-.5 3.5-1.4" />
    </Icon>
  );
}

export function ExportIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </Icon>
  );
}
