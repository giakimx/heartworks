"use client";

import Link from "next/link";
import TabBar from "@/components/chrome/TabBar";
import { VolunteerTopNav } from "@/components/chrome/TopNav";
import Wordmark from "@/components/chrome/Wordmark";
import RoleRow from "@/components/roles/RoleRow";
import { myShifts, orgById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_STYLE: Partial<Record<ApplicationStatus, string>> = {
  requested: "bg-accent-tint text-accent-ink",
  accepted: "bg-ok-tint text-ok-ink",
  logged: "bg-ink/6 text-muted",
};

export default function ShiftsPage() {
  const hydrated = useHydrated();
  const state = useDemoStore();
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : "v_gia";
  const shifts = myShifts(state, volunteerId);

  return (
    <>
    <VolunteerTopNav />
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-32 pt-3 lg:min-h-0 lg:max-w-170 lg:pb-14 lg:pt-6">
      <div className="flex h-12 items-center justify-between lg:hidden">
        <Wordmark size={20} />
      </div>

      <h1 className="font-display text-[30px] font-normal leading-[1.1] tracking-[-0.4px] lg:text-[44px]">
        My shifts
      </h1>

      {hydrated && shifts.length === 0 && (
        <div className="flex flex-col gap-2 border-t border-line py-4 text-[15px] text-muted">
          <div>Nothing on the calendar yet.</div>
          <Link href="/discover" className="font-semibold">
            Find a role that fits
          </Link>
        </div>
      )}

      {hydrated && (
        <div className="flex flex-col gap-1">
          {shifts.map(({ application, role }) => {
            const org = orgById(state, role.orgId);
            const label =
              application.status === "requested"
                ? "Requested"
                : application.status === "accepted"
                  ? "You're going"
                  : `Waiting on ${org?.name}`;
            return (
              <RoleRow
                key={application.id}
                role={role}
                org={org}
                trailing={
                  <div
                    className={`flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${STATUS_STYLE[application.status] ?? ""}`}
                  >
                    {label}
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      <TabBar />
    </main>
    </>
  );
}
