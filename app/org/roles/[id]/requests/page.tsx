"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/chrome/PageHeader";
import { OrgTopNav } from "@/components/chrome/TopNav";
import { CheckIcon } from "@/components/icons";
import { InitialsAvatar } from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { metaDate } from "@/lib/format";
import { filledCount } from "@/lib/scoring";
import { applicantsForRole, roleById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

export default function RequestsPage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const state = useDemoStore();
  const accept = useDemoStore((s) => s.accept);
  const decline = useDemoStore((s) => s.decline);
  const undoDecision = useDemoStore((s) => s.undoDecision);

  const role = roleById(state, id);
  if (!role) return null;

  const filled = filledCount(role, state.applications);
  const open = role.spots - filled;
  const applicants = applicantsForRole(state, role.id);
  const full = open <= 0;

  return (
    <>
    <OrgTopNav />
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-8 pt-3 lg:min-h-0 lg:max-w-260 lg:px-0 lg:pb-14 lg:pt-6">
      <div className="lg:hidden">
        <PageHeader backHref="/org" backLabel="Back to org home" trailing={<div />} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-muted">
          {role.title} · {metaDate(role.date)}
        </div>
        <h1 className="font-display text-[30px] font-normal leading-[1.15] tracking-[-0.4px] lg:text-[44px] lg:leading-[1.08] lg:tracking-[-0.8px]">
          Who wants in
        </h1>
      </div>

      {hydrated && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <div className="font-semibold">
                {filled} of {role.spots} filled
              </div>
              <div className="text-muted">
                {full ? "Full" : `${open} ${open === 1 ? "spot" : "spots"} open`}
              </div>
            </div>
            <ProgressBar filled={filled} total={role.spots} />
          </div>

          <div className="contents lg:grid lg:grid-cols-3 lg:items-start lg:gap-5">
          {applicants.map(({ application, volunteer, history, wants, brings }) => (
            <div
              key={application.id}
              className="flex flex-col gap-3.5 rounded-card border border-line bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <InitialsAvatar
                  initials={volunteer.initials}
                  color={volunteer.avatarColor}
                  size={44}
                  fontSize={15}
                />
                <div className="flex grow flex-col gap-0.5">
                  <div className="text-base font-semibold">{volunteer.name}</div>
                  <div className="text-[13px] text-muted">{history}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-sm leading-[1.4]">
                <div className="flex gap-2">
                  <div className="w-14 shrink-0 text-muted">Wants</div>
                  <div className="font-medium">{wants.join(", ") || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-14 shrink-0 text-muted">Brings</div>
                  <div className="font-medium">{brings.join(", ") || "—"}</div>
                </div>
              </div>

              {application.status === "requested" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => decline(application.id)}
                    className="h-12 rounded-full border border-line-strong bg-ground text-[15px] font-semibold text-ink"
                  >
                    Not this time
                  </button>
                  <button
                    type="button"
                    onClick={() => accept(application.id)}
                    disabled={full}
                    className="h-12 rounded-full bg-ink text-[15px] font-semibold text-white disabled:opacity-40"
                  >
                    Accept
                  </button>
                </div>
              )}

              {application.status === "accepted" && (
                <div className="flex h-12 items-center justify-between rounded-full bg-ok-tint px-4 text-[15px] font-semibold text-ok-ink">
                  <div className="flex items-center gap-2">
                    <CheckIcon size={18} strokeWidth={2.4} />
                    Accepted · we let them know
                  </div>
                  <button
                    type="button"
                    onClick={() => undoDecision(application.id)}
                    className="py-3 text-[13px] font-bold text-ok-ink underline"
                  >
                    Undo
                  </button>
                </div>
              )}

              {application.status === "declined" && (
                <div className="flex h-12 items-center justify-between rounded-full bg-ink/6 px-4 text-[15px] font-semibold text-muted">
                  <div>Declined · we&apos;ll suggest other roles</div>
                  <button
                    type="button"
                    onClick={() => undoDecision(application.id)}
                    className="py-3 text-[13px] font-bold text-ink underline"
                  >
                    Undo
                  </button>
                </div>
              )}
            </div>
          ))}
          </div>
        </>
      )}

      <div className="grow" />
      <div className="text-center text-[13px] leading-normal text-muted">
        Sorted by match. Declines get a kind note and other roles, never a bare no.
      </div>
    </main>
    </>
  );
}
