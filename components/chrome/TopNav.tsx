"use client";

// Desktop top nav (lg+), volunteer + org variants. 76px tall, 48px side padding.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Wordmark from "@/components/chrome/Wordmark";
import { PlusIcon } from "@/components/icons";
import {
  orgById,
  orgRoleToConfirm,
  orgRoleWithMostRequests,
  volunteerById,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";

function NavPill({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current: boolean;
}) {
  return (
    <Link
      href={href as never}
      aria-current={current ? "page" : undefined}
      className={`flex h-11 items-center rounded-full px-3.5 text-[15px] font-semibold no-underline ${
        current ? "bg-ink/7 text-ink" : "text-muted"
      }`}
    >
      {label}
    </Link>
  );
}

export function VolunteerTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const state = useDemoStore();
  const setViewer = useDemoStore((s) => s.setViewer);
  const volunteer =
    state.viewer.kind === "volunteer" ? volunteerById(state, state.viewer.id) : undefined;

  const forOrgs = () => {
    setViewer({ kind: "org", id: "o_dbg" });
    router.push("/org");
  };

  return (
    <nav
      aria-label="Main"
      className="hidden h-19 items-center justify-between px-12 lg:flex"
    >
      <Link href="/discover" className="text-ink no-underline">
        <Wordmark size={22} />
      </Link>
      <div className="flex items-center gap-1">
        <NavPill href="/discover" label="Discover" current={pathname === "/discover"} />
        <NavPill href="/shifts" label="My shifts" current={pathname === "/shifts"} />
        <NavPill href="/profile" label="Community" current={pathname === "/profile"} />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={forOrgs}
          className="px-2 py-3 text-sm font-semibold text-muted"
        >
          For organizations
        </button>
        <Link
          href="/profile"
          aria-label="Your profile"
          className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white no-underline"
        >
          {volunteer?.name[0] ?? "G"}
        </Link>
      </div>
    </nav>
  );
}

export function OrgTopNav() {
  const pathname = usePathname();
  const state = useDemoStore();
  const orgId = state.viewer.kind === "org" ? state.viewer.id : "o_dbg";
  const org = orgById(state, orgId);
  const requestsRole = orgRoleWithMostRequests(state, orgId);
  const confirmRole = orgRoleToConfirm(state, orgId);

  const requestsHref = requestsRole ? `/org/roles/${requestsRole.id}/requests` : "/org";
  const confirmHref = confirmRole ? `/org/shifts/${confirmRole.id}/confirm` : "/org";

  return (
    <nav
      aria-label="Main"
      className="hidden h-19 items-center justify-between px-12 lg:flex"
    >
      <div className="flex items-center gap-2.5">
        <Link href="/org" className="text-ink no-underline">
          <Wordmark size={22} />
        </Link>
        <div className="flex h-[22px] items-center rounded-full bg-ink/8 px-2 text-[11px] font-bold tracking-[0.4px] text-muted">
          ORGS
        </div>
      </div>
      <div className="flex items-center gap-1">
        <NavPill href="/org" label="Home" current={pathname === "/org"} />
        <NavPill
          href={requestsHref}
          label="Requests"
          current={pathname.includes("/requests")}
        />
        <NavPill
          href={confirmHref}
          label="Confirm shifts"
          current={pathname.includes("/confirm")}
        />
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/org/roles/new"
          className="flex h-11 items-center gap-1.5 rounded-full bg-ink px-[18px] text-sm font-semibold text-white no-underline"
        >
          <PlusIcon size={16} strokeWidth={2.4} />
          Post a role
        </Link>
        {org && (
          <div
            className="flex size-10 items-center justify-center rounded-full text-[13px] font-bold text-ink"
            style={{ background: org.color }}
          >
            {org.initials}
          </div>
        )}
      </div>
    </nav>
  );
}
