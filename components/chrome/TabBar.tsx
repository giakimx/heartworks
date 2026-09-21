"use client";

// Floating glass pill: discover / my shifts / community. Mobile only (< lg).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, HomeIcon, PersonIcon } from "@/components/icons";

const tabs = [
  { href: "/discover", label: "Discover", Icon: HomeIcon },
  { href: "/shifts", label: "My contributions", Icon: CalendarIcon },
  { href: "/profile", label: "Community", Icon: PersonIcon },
] as const;

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-6 bottom-5 z-40 mx-auto flex h-16 max-w-108 items-center justify-around rounded-full border border-line bg-[rgba(255,255,255,0.86)] shadow-[0_12px_32px_rgba(31,26,23,0.10)] backdrop-blur-[14px] lg:hidden"
    >
      {tabs.map(({ href, label, Icon }) => {
        const current = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className={`flex h-13 w-24 flex-col items-center justify-center gap-[3px] text-[11px] font-semibold no-underline ${
              current ? "text-ink" : "text-muted"
            }`}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
