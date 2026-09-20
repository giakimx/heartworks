"use client";

import PageHeader from "@/components/chrome/PageHeader";
import TabBar from "@/components/chrome/TabBar";
import { VolunteerTopNav } from "@/components/chrome/TopNav";
import { ExportIcon } from "@/components/icons";
import StampWall from "@/components/profile/StampWall";
import { toast } from "@/components/ui/Toast";
import { firstName } from "@/lib/format";
import {
  orgById,
  profileStats,
  roleById,
  stampsFor,
  verifiedSkills,
  volunteerById,
} from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

export default function ProfilePage() {
  const hydrated = useHydrated();
  const state = useDemoStore();
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : "v_gia";
  const volunteer = volunteerById(state, volunteerId);

  const stats = profileStats(state, volunteerId);
  const stamps = stampsFor(state, volunteerId);
  const skills = verifiedSkills(state, volunteerId);
  const pending = state.applications.filter(
    (a) => a.volunteerId === volunteerId && a.status === "logged"
  );

  return (
    <>
    <VolunteerTopNav />
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-[22px] px-6 pb-32 pt-3 lg:min-h-0 lg:max-w-260 lg:gap-8 lg:px-0 lg:pb-14 lg:pt-6">
      <div className="lg:hidden">
      <PageHeader
        backHref="/discover"
        backLabel="Back to feed"
        trailing={
          <button
            type="button"
            aria-label="Share your profile"
            onClick={() => toast("Sharing is coming soon")}
            className="-mr-2.5 flex size-11 items-center justify-center text-ink"
          >
            <ExportIcon size={22} />
          </button>
        }
      />
      </div>

      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[34px] font-normal leading-[1.1] tracking-[-0.5px] lg:text-[52px] lg:leading-[1.08] lg:tracking-[-0.8px]">
            {volunteer ? `${firstName(volunteer.name)}'s community` : "Your community"}
          </h1>
          <div className="text-[15px] text-muted lg:text-base">
            Every confirmed shift earns a stamp.
          </div>
        </div>
        {hydrated && (
          <div className="hidden gap-2 lg:flex">
            {(
              [
                [stats.shifts, "shifts"],
                [stats.hours, "hours"],
                [stats.skills, "skills"],
              ] as const
            ).map(([value, label]) => (
              <div
                key={label}
                className="flex items-baseline gap-2 rounded-2xl border border-line bg-card-soft px-5 py-3.5"
              >
                <div className="font-display text-[28px] leading-none">{value}</div>
                <div className="text-sm text-muted">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hydrated && (
        <>
          <div className="grid grid-cols-3 gap-2 lg:hidden">
            {(
              [
                [stats.shifts, "shifts"],
                [stats.hours, "hours"],
                [stats.skills, "skills"],
              ] as const
            ).map(([value, label]) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 rounded-2xl border border-line bg-card-soft p-3.5"
              >
                <div className="font-display text-[26px] leading-none">{value}</div>
                <div className="text-[13px] text-muted">{label}</div>
              </div>
            ))}
          </div>

          {pending.map((application) => {
            const role = roleById(state, application.roleId);
            const org = role ? orgById(state, role.orgId) : undefined;
            if (!role) return null;
            return (
              <div
                key={application.id}
                className="flex items-center justify-between gap-3 rounded-card border border-line bg-card-soft px-4 py-3.5 text-sm"
              >
                <div className="font-semibold">{role.title}</div>
                <div className="text-right text-[13px] text-muted">
                  {application.loggedHours} hrs · waiting on {org?.name} to confirm
                </div>
              </div>
            );
          })}

          <StampWall
            stamps={stamps}
            orgNameFor={(orgId) => orgById(state, orgId)?.name ?? ""}
          />

          <section className="flex flex-col gap-1 lg:max-w-160">
            <h2 className="pb-1.5 font-display text-xl font-normal lg:text-2xl">
              Verified skills
            </h2>
            {skills.map(({ skill, hours, confirmedBy }) => (
              <div
                key={skill}
                className="flex items-center justify-between gap-3 border-t border-line py-3.5"
              >
                <div className="flex flex-col gap-[3px]">
                  <div className="text-base font-semibold">{skill}</div>
                  <div className="text-[13px] text-muted">
                    Confirmed by {confirmedBy.join(", ")}
                  </div>
                </div>
                <div className="text-sm font-semibold text-muted">{hours} hrs</div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="border-t border-line py-3.5 text-sm text-muted">
                Confirmed shifts add verified skills here.
              </div>
            )}
          </section>

          <button
            type="button"
            onClick={() => toast("Export is coming soon")}
            className="flex h-[54px] items-center justify-center gap-2 rounded-full border border-[rgba(31,26,23,0.12)] bg-card-soft text-[15px] font-semibold text-ink lg:max-w-100 lg:px-8"
          >
            Export as resume-ready experience
          </button>
        </>
      )}

      <TabBar />
    </main>
    </>
  );
}
