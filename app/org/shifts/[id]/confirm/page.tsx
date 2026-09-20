"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/chrome/PageHeader";
import { OrgTopNav } from "@/components/chrome/TopNav";
import { CheckIcon } from "@/components/icons";
import { InitialsAvatar } from "@/components/ui/Avatar";
import { metaDate } from "@/lib/format";
import { attendanceForRole, roleById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

export default function OrgConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const state = useDemoStore();
  const confirmShift = useDemoStore((s) => s.confirmShift);

  // Untick set (everyone is pre-ticked except accepted-with-no-log).
  const [out, setOut] = useState<string[]>([]);
  const [seeded, setSeeded] = useState(false);

  const role = roleById(state, id);
  if (!role) return null;

  const rows = attendanceForRole(state, role.id);
  if (hydrated && !seeded) {
    // "hasn't logged yet" rows start unticked
    setOut(rows.filter((r) => r.application.status === "accepted").map((r) => r.application.id));
    setSeeded(true);
  }

  const kept = rows.filter((r) => !out.includes(r.application.id));
  const hours = kept.reduce(
    (n, r) => n + (r.application.loggedHours ?? role.hours ?? 0),
    0
  );

  const toggle = (appId: string) =>
    setOut(out.includes(appId) ? out.filter((x) => x !== appId) : [...out, appId]);

  const confirm = () => {
    confirmShift(role.id, kept.map((r) => r.application.id));
    router.push("/org");
  };

  return (
    <>
    <OrgTopNav />
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-7 pt-3 lg:min-h-0 lg:max-w-170 lg:pt-6">
      <div className="lg:hidden">
        <PageHeader backHref="/org" backLabel="Back to org home" trailing={<div />} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-muted">
          {role.title} · {metaDate(role.date)}
        </div>
        <h1 className="font-display text-[30px] font-normal leading-[1.15] tracking-[-0.4px]">
          Who showed up?
        </h1>
        <p className="text-[15px] leading-normal text-muted">
          Untick anyone who didn&apos;t make it. Hours are what they reported.
        </p>
      </div>

      {hydrated && (
        <div className="flex flex-col rounded-card border border-line bg-card px-4 py-1">
          {rows.map(({ application, volunteer }) => {
            const on = !out.includes(application.id);
            const detail =
              application.status === "logged"
                ? `${application.loggedHours} hrs · ${(application.loggedSkills ?? []).join(", ")}`
                : "Hasn't logged yet";
            return (
              <button
                key={application.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(application.id)}
                className="flex min-h-19 items-center gap-3 border-b border-[rgba(31,26,23,0.07)] text-left text-ink last:border-b-0"
              >
                <InitialsAvatar
                  initials={volunteer.initials}
                  color={volunteer.avatarColor}
                  size={40}
                  fontSize={14}
                />
                <div className="flex grow flex-col gap-0.5">
                  <div className="text-base font-semibold">{volunteer.name}</div>
                  <div className="text-[13px] text-muted">{detail}</div>
                </div>
                {on ? (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                    <CheckIcon size={16} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="box-border size-7 shrink-0 rounded-full border-[1.5px] border-[rgba(31,26,23,0.28)]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="grow" />

      {hydrated && (
        <div className="flex flex-col gap-3">
          <div className="text-center text-[13px] leading-normal text-muted">
            {hours} verified hours go on {kept.length}{" "}
            {kept.length === 1 ? "profile" : "profiles"} as stamps.
          </div>
          <button
            type="button"
            onClick={confirm}
            disabled={rows.length === 0}
            className="flex h-14 items-center justify-center rounded-full bg-ink text-base font-semibold text-white disabled:opacity-50"
          >
            Confirm {kept.length} {kept.length === 1 ? "volunteer" : "volunteers"}
          </button>
        </div>
      )}
    </main>
    </>
  );
}
