"use client";

import Image from "next/image";
import Link from "next/link";
import { OrgTopNav } from "@/components/chrome/TopNav";
import Wordmark from "@/components/chrome/Wordmark";
import { CheckIcon, ChevronRightIcon, PlusIcon } from "@/components/icons";
import { OrgAvatar } from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { timeRange, metaDate } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { filledCount } from "@/lib/scoring";
import {
  orgById,
  orgRequestedCount,
  orgRoleToConfirm,
  orgRoleWithMostRequests,
  orgRoles,
  spotsLeft,
} from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";
import type { Role } from "@/lib/types";

export default function OrgHomePage() {
  const hydrated = useHydrated();
  const state = useDemoStore();
  const orgId = state.viewer.kind === "org" ? state.viewer.id : "o_dbg";
  const org = orgById(state, orgId);

  const requestedCount = orgRequestedCount(state, orgId);
  const requestsRole = orgRoleWithMostRequests(state, orgId);
  const confirmRole = orgRoleToConfirm(state, orgId);
  const roles = orgRoles(state, orgId);
  const attention = (requestedCount > 0 && requestsRole ? 1 : 0) + (confirmRole ? 1 : 0);

  const loggedCount = (role: Role) =>
    state.applications.filter((a) => a.roleId === role.id && a.status === "logged").length;

  return (
    <>
    <OrgTopNav />
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-7 pt-3 lg:min-h-0 lg:max-w-260 lg:gap-8 lg:px-0 lg:pb-14 lg:pt-6">
      <div className="flex h-12 items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <Link href="/org" aria-label="Heartworks org home">
            <Wordmark size={20} />
          </Link>
          <div className="flex h-[22px] items-center rounded-full bg-ink/8 px-2 text-[11px] font-bold tracking-[0.4px] text-muted">
            ORGS
          </div>
        </div>
        {org && <OrgAvatar org={org} size={36} />}
      </div>

      <div className="flex flex-col gap-1 lg:gap-1.5">
        <h1 className="font-display text-[30px] font-normal leading-[1.1] tracking-[-0.4px] lg:text-[44px] lg:leading-[1.08] lg:tracking-[-0.8px]">
          {org?.name}
        </h1>
        {hydrated && (
          <div className="text-[15px] text-muted">
            {org?.neighborhood}
            {attention > 0 && (
              <> · {attention} {attention === 1 ? "thing needs" : "things need"} you</>
            )}
          </div>
        )}
      </div>

      <div className="contents lg:grid lg:grid-cols-2 lg:gap-5">
      {hydrated && requestedCount > 0 && requestsRole && (
        <Link
          href={`/org/roles/${requestsRole.id}/requests` as never}
          className="flex items-center gap-3.5 rounded-card border border-line bg-card p-4 text-ink no-underline shadow-card"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-tint font-display text-[22px] text-accent-ink">
            {requestedCount}
          </div>
          <div className="flex grow flex-col gap-[3px]">
            <div className="text-base font-semibold">People want in</div>
            <div className="text-sm text-muted">
              {requestsRole.title} ·{" "}
              {spotsLeft(requestsRole, state.applications) === 0
                ? "full"
                : `${spotsLeft(requestsRole, state.applications)} ${
                    spotsLeft(requestsRole, state.applications) === 1 ? "spot" : "spots"
                  } open`}
            </div>
          </div>
          <ChevronRightIcon size={20} strokeWidth={2.2} className="text-muted" />
        </Link>
      )}

      {hydrated && confirmRole && (
        <Link
          href={`/org/shifts/${confirmRole.id}/confirm` as never}
          className="flex items-center gap-3.5 rounded-card border border-line bg-card p-4 text-ink no-underline shadow-card"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
            <CheckIcon size={24} strokeWidth={2.4} />
          </div>
          <div className="flex grow flex-col gap-[3px]">
            <div className="text-base font-semibold">Confirm a finished shift</div>
            <div className="text-sm text-muted">
              {confirmRole.title} · {loggedCount(confirmRole)}{" "}
              {loggedCount(confirmRole) === 1 ? "volunteer" : "volunteers"} logged hours
            </div>
          </div>
          <ChevronRightIcon size={20} strokeWidth={2.2} className="text-muted" />
        </Link>
      )}
      </div>

      {hydrated && (
        <section className="flex flex-col gap-1 lg:hidden">
          <h2 className="pb-1.5 font-display text-xl font-normal">Your roles</h2>
          {roles.map((role) => (
            <OrgRoleRow key={role.id} role={role} loggedCount={loggedCount(role)} />
          ))}
        </section>
      )}

      {/* desktop: roles table */}
      {hydrated && (
        <section className="hidden flex-col lg:flex">
          <h2 className="pb-3 font-display text-2xl font-normal">Your roles</h2>
          <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_120px] items-center gap-4 pb-2.5 text-xs font-semibold uppercase tracking-[0.4px] text-muted">
            <div>Role</div>
            <div>When</div>
            <div>Filled</div>
            <div>Requests</div>
            <div>Status</div>
          </div>
          {roles.map((role) => (
            <OrgRoleTableRow key={role.id} role={role} loggedCount={loggedCount(role)} />
          ))}
        </section>
      )}

      <div className="grow lg:hidden" />

      <Link
        href="/org/roles/new"
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white no-underline lg:hidden"
      >
        <PlusIcon size={18} strokeWidth={2.4} />
        Post an event
      </Link>
    </main>
    </>
  );
}

function OrgRoleTableRow({ role, loggedCount }: { role: Role; loggedCount: number }) {
  const state = useDemoStore();
  const image = imageFor(role.image);
  const filled = filledCount(role, state.applications);
  const requested = state.applications.filter(
    (a) => a.roleId === role.id && a.status === "requested"
  ).length;

  const href =
    role.status === "draft"
      ? "/org/roles/new"
      : role.status === "done" && loggedCount > 0
        ? `/org/shifts/${role.id}/confirm`
        : `/org/roles/${role.id}/requests`;

  return (
    <Link
      href={href as never}
      className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_120px] items-center gap-4 border-t border-line py-3.5 text-ink no-underline"
    >
      <div className="flex items-center gap-3.5">
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={96}
            height={96}
            className="size-12 shrink-0 rounded-tile object-cover"
          />
        ) : (
          <div className="box-border size-12 shrink-0 rounded-tile border-[1.5px] border-dashed border-[rgba(31,26,23,0.24)]" />
        )}
        <div className="text-base font-semibold">{role.title}</div>
      </div>
      <div className="text-sm text-muted">
        {role.status === "draft"
          ? "Draft · no date yet"
          : [metaDate(role.date), timeRange(role.start, role.end)]
              .filter(Boolean)
              .join(" · ") || "—"}
      </div>
      <div className="flex items-center gap-2.5">
        {role.status === "draft" ? (
          <div className="text-sm text-muted">—</div>
        ) : (
          <>
            <ProgressBar filled={filled} total={role.spots} className="w-21" />
            <div className="text-sm text-muted">
              {filled} of {role.spots}
            </div>
          </>
        )}
      </div>
      <div className="text-sm font-semibold">
        {loggedCount > 0
          ? `${loggedCount} to confirm`
          : requested > 0
            ? `${requested} waiting`
            : "—"}
      </div>
      <div
        className={`text-[13px] font-semibold ${
          role.status === "live"
            ? "text-ok-ink"
            : role.status === "draft"
              ? "text-accent-ink"
              : "text-muted"
        }`}
      >
        {role.status === "live" ? "Live" : role.status === "draft" ? "Draft" : "Done"}
      </div>
    </Link>
  );
}

function OrgRoleRow({ role, loggedCount }: { role: Role; loggedCount: number }) {
  const state = useDemoStore();
  const image = imageFor(role.image);
  const filled = filledCount(role, state.applications);

  const href =
    role.status === "draft"
      ? "/org/roles/new"
      : role.status === "done" && loggedCount > 0
        ? `/org/shifts/${role.id}/confirm`
        : `/org/roles/${role.id}/requests`;

  const meta =
    role.status === "draft"
      ? "Draft · no date yet"
      : [metaDate(role.date), timeRange(role.start, role.end)]
          .filter(Boolean)
          .join(" · ");

  return (
    <Link
      href={href as never}
      className="flex items-center gap-3.5 border-t border-line py-3.5 text-ink no-underline"
    >
      <div className="flex min-w-0 grow flex-col gap-1.5">
        <div className="text-[13px] font-medium text-muted">{meta}</div>
        <div className="text-[17px] font-semibold">{role.title}</div>
        {role.status === "draft" ? (
          <div className="text-[13px] font-semibold text-accent-ink">Finish posting</div>
        ) : loggedCount > 0 ? (
          <div className="text-[13px] font-semibold text-accent-ink">
            {loggedCount} logged {loggedCount === 1 ? "shift" : "shifts"} to confirm
          </div>
        ) : role.status === "done" ? (
          <div className="text-[13px] font-medium text-muted">Done</div>
        ) : (
          <div className="flex items-center gap-2.5">
            <ProgressBar filled={filled} total={role.spots} className="w-21" />
            <div className="text-[13px] text-muted">
              {filled} of {role.spots} filled
            </div>
          </div>
        )}
      </div>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={128}
          height={128}
          className="size-16 shrink-0 rounded-input object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="box-border size-16 shrink-0 rounded-input border-[1.5px] border-dashed border-[rgba(31,26,23,0.24)]"
        />
      )}
    </Link>
  );
}
