"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/chrome/PageHeader";
import { VolunteerTopNav } from "@/components/chrome/TopNav";
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ExportIcon,
  HeartFilledIcon,
  ListIcon,
  PinIcon,
} from "@/components/icons";
import InfoTile, { DateTile, IconTile } from "@/components/ui/InfoTile";
import ProgressBar from "@/components/ui/ProgressBar";
import { AvatarStack, OrgAvatar } from "@/components/ui/Avatar";
import { toast } from "@/components/ui/Toast";
import {
  dayOfMonth,
  firstName,
  formatDate,
  metaDate,
  monthAbbrev,
  spotsLabel,
  timeRange,
  timeRangeWithHours,
} from "@/lib/format";
import { imageFor } from "@/lib/images";
import { filledCount, intersect } from "@/lib/scoring";
import { applicationFor, orgById, roleById, volunteerById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";
import type { Application, Org, Role, Volunteer } from "@/lib/types";

const AVATAR_COLORS = ["#F2B8A0", "#C9B8E8", "#A9D4B8", "#F3D48A"];
const COUNT_WORDS = ["None", "One", "Two", "Three", "Four", "Five", "Six"];

export default function RolePage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const state = useDemoStore();

  const role = roleById(state, id);
  if (!role) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-8 pt-3">
        <PageHeader backHref="/discover" backLabel="Back to feed" />
        {hydrated && (
          <>
            <h1 className="font-display text-[32px] leading-[1.1]">
              This role isn&apos;t here anymore.
            </h1>
            <Link href="/discover" className="text-[15px] font-semibold">
              See other roles
            </Link>
          </>
        )}
      </main>
    );
  }

  const org = orgById(state, role.orgId);
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : undefined;
  const volunteer = volunteerId ? volunteerById(state, volunteerId) : undefined;
  const application = volunteerId
    ? applicationFor(state, role.id, volunteerId)
    : undefined;

  if (hydrated && application?.status === "accepted" && volunteer) {
    return <GoingView role={role} org={org} volunteer={volunteer} application={application} />;
  }

  return <RoleView role={role} org={org} volunteer={volunteer} application={application} hydrated={hydrated} />;
}

function RoleView({
  role,
  org,
  volunteer,
  application,
  hydrated,
}: {
  role: Role;
  org?: Org;
  volunteer?: Volunteer;
  application?: Application;
  hydrated: boolean;
}) {
  const state = useDemoStore();
  const withdraw = useDemoStore((s) => s.withdraw);
  const undoRequest = useDemoStore((s) => s.undoRequest);
  const [moreOpen, setMoreOpen] = useState(false);
  const image = imageFor(role.image);
  const filled = filledCount(role, state.applications);
  const left = role.spots - filled;
  const matchCount = volunteer
    ? intersect(role.skillsTaught, volunteer.learnGoals).length
    : 0;

  const cancelRegistration = () => {
    setMoreOpen(false);
    if (application?.status === "accepted") {
      if (window.confirm(`Give up your spot at ${role.title}?`)) {
        withdraw(role.id);
        toast("Your spot was given back");
      }
    } else if (application?.status === "requested") {
      undoRequest(role.id);
      toast("Request withdrawn");
    } else {
      toast("You're not registered for this role yet");
    }
  };

  const facts = [
    role.workType,
    role.trainingProvided ? "No training needed" : undefined,
    role.goodForGroups ? "Good for groups" : undefined,
    role.backgroundCheck ? "Background check" : undefined,
    role.minAge ? `Ages ${role.minAge}+` : undefined,
  ].filter(Boolean) as string[];

  const imageEl = image && (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority
      className="h-[250px] w-full rounded-feature object-cover shadow-photo lg:h-[300px]"
    />
  );

  const registerCard = hydrated && (
    <div className="flex flex-col gap-3.5 rounded-card border border-line bg-[rgba(255,255,255,0.8)] p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AvatarStack colors={AVATAR_COLORS.slice(0, Math.min(4, Math.max(filled, 1)))} />
          <div className="pl-2.5 text-sm font-medium">
            {filled} of {role.spots} going
          </div>
        </div>
        <div className="text-[13px] text-muted">{spotsLabel(left)}</div>
      </div>
      <ProgressBar filled={filled} total={role.spots} />
      <RegisterActions role={role} org={org} application={application} left={left} />
    </div>
  );

  const orgTitle = (
    <div className="flex flex-col gap-2.5">
      {org && (
        <Link
          href={`/orgs/${org.id}` as never}
          className="flex items-center gap-2 self-start text-sm font-semibold text-ink no-underline"
        >
          <OrgAvatar org={org} size={22} />
          {org.name}
        </Link>
      )}
      <h1 className="font-display text-[29px] font-normal leading-[1.1] tracking-[-0.5px] lg:text-[37px]">
        {role.title}
      </h1>
    </div>
  );

  const content = (
    // 3px more breathing room between detail sections than the page default
    <div className="flex flex-col gap-[23px] lg:gap-[27px]">
      <div className="flex flex-col gap-3.5">
        {role.date && (
          <InfoTile
            tile={<DateTile month={monthAbbrev(role.date)} day={dayOfMonth(role.date)} />}
            title={formatDate(role.date)}
            sub={timeRangeWithHours(role.start, role.end, role.hours)}
          />
        )}
        {/* address = where the event happens; neighborhood = community context */}
        <InfoTile
          tile={
            <IconTile>
              <PinIcon size={22} />
            </IconTile>
          }
          title={role.address ?? role.neighborhood}
          sub={role.address ? `${role.neighborhood} neighborhood` : undefined}
        />
        {facts.length > 0 && (
          <div className="flex items-center gap-3.5">
            <IconTile>
              <ListIcon size={20} />
            </IconTile>
            <div className="text-[13px] font-medium text-muted">
              {facts.join(" · ")}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="self-start py-2 text-[11px] font-semibold tracking-[0.4px] text-muted opacity-80"
        >
          More...
        </button>
      </div>

      {role.impact && (
        <section className="relative overflow-hidden rounded-card border border-accent/25 bg-gradient-to-br from-accent-tint via-[#FDEDE2] to-[#FCEBCB] p-4 shadow-[0_1px_2px_rgba(217,88,59,0.06),0_12px_32px_rgba(217,88,59,0.12)]">
          {/* soft shine sweep across the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-8 -left-1/4 w-1/3 rotate-12 bg-white/35 blur-xl"
          />
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <HeartFilledIcon size={13} className="text-accent" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.4px] text-accent-ink">
                Community impact
              </h2>
            </div>
            <p className="text-sm leading-normal text-ink">{role.impact}</p>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.4px] text-muted opacity-80">
          You&apos;ll build
        </h2>
        <div className="h-px w-full bg-line-strong opacity-50" aria-hidden="true" />
        <div className="flex flex-wrap gap-1.5">
          {role.skillsTaught.map((skill) => (
            <div
              key={skill}
              className="flex h-8 items-center rounded-full bg-accent-tint px-3 text-[13px] font-semibold text-accent-ink"
            >
              {skill}
            </div>
          ))}
        </div>
        {hydrated && (
          <div className="text-sm leading-normal text-muted">
            {matchCount > 0 && (
              <>
                {COUNT_WORDS[matchCount] ?? matchCount}{" "}
                {matchCount === 1 ? "matches" : "match"} your goals.{" "}
              </>
            )}
            <span className="text-xs">
              Added to your skills once the org confirms your shift.
            </span>
          </div>
        )}
      </section>

      {role.description && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.4px] text-muted opacity-80">
            About
          </h2>
          <div className="h-px w-full bg-line-strong opacity-50" aria-hidden="true" />
          <p className="whitespace-pre-line text-sm leading-normal">
            {role.description}
          </p>
        </section>
      )}

      {org && (
        <Link
          href={`/orgs/${org.id}` as never}
          className="flex flex-col gap-2 text-ink no-underline"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.4px] text-muted opacity-80">
              About {org.name}
            </h2>
            <ChevronRightIcon size={16} className="text-muted" />
          </div>
          <div className="h-px w-full bg-line-strong opacity-50" aria-hidden="true" />
          {org.blurb && <p className="text-sm leading-normal">{org.blurb}</p>}
        </Link>
      )}
    </div>
  );

  const shareButton = (
    <button
      type="button"
      aria-label="Share this role"
      onClick={() => toast("Sharing is coming soon")}
      className="-mr-2.5 flex size-11 items-center justify-center text-ink"
    >
      <ExportIcon size={22} />
    </button>
  );

  return (
    <>
      <VolunteerTopNav />
      <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-8 pt-3 lg:min-h-0 lg:max-w-260 lg:px-0 lg:pb-14 lg:pt-4">
        <div className="lg:hidden">
          <PageHeader backHref="/discover" backLabel="Back to feed" trailing={shareButton} />
        </div>
        <div className="hidden lg:block">
          <Link href="/discover" className="text-sm font-semibold no-underline">
            ← All roles
          </Link>
        </div>

        {/* mobile: single column */}
        <div className="flex flex-col gap-5 lg:hidden">
          {imageEl}
          {orgTitle}
          {registerCard}
          {content}
        </div>

        {/* desktop: 440px sticky left (photo + request card), content right */}
        <div className="hidden lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="sticky top-6 flex flex-col gap-5">
            {imageEl}
            {registerCard}
          </div>
          <div className="flex flex-col gap-6">
            {orgTitle}
            {content}
          </div>
        </div>

        {moreOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            role="dialog"
            aria-modal="true"
            aria-label="More options"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setMoreOpen(false)}
              className="absolute inset-0 bg-ink/30"
            />
            <div className="relative flex w-full max-w-90 flex-col overflow-hidden rounded-card border border-line bg-white shadow-card">
              {(
                [
                  ["Add to Calendar", () => toast("Calendar export is coming soon")],
                  [
                    "Contact organizer",
                    () => toast(`Messaging ${org?.name ?? "the org"} is coming soon`),
                  ],
                  ["Cancel registration", cancelRegistration],
                  ["Share event poster", () => toast("Sharing is coming soon")],
                ] as const
              ).map(([label, action], i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label !== "Cancel registration") setMoreOpen(false);
                    action();
                  }}
                  className={`h-14 px-5 text-left text-[15px] font-semibold text-ink hover:bg-ink/5 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function RegisterActions({
  role,
  org,
  application,
  left,
}: {
  role: Role;
  org?: Org;
  application?: Application;
  left: number;
}) {
  const request = useDemoStore((s) => s.request);
  const undoRequest = useDemoStore((s) => s.undoRequest);
  const status = application?.status;

  if (status === "requested") {
    return (
      <>
        <div className="flex h-[54px] items-center justify-center gap-2 rounded-full border border-line-strong bg-ground text-base font-semibold text-ink">
          <CheckIcon size={18} strokeWidth={2.4} />
          Request sent
        </div>
        <div className="flex items-center justify-center gap-3 text-[13px] text-muted">
          <div>We&apos;ll text you when {org?.name ?? "the org"} replies.</div>
          <button
            type="button"
            onClick={() => undoRequest(role.id)}
            className="py-3 text-[13px] font-semibold text-accent-ink"
          >
            Undo
          </button>
        </div>
      </>
    );
  }

  if (status === "logged") {
    return (
      <div className="text-center text-sm font-medium text-muted">
        Hours sent to {org?.name ?? "the org"} for confirmation.
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <span className="flex size-6 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
          <CheckIcon size={14} strokeWidth={2.6} />
        </span>
        Stamped.
        <Link href="/profile" className="font-semibold">
          See your profile
        </Link>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="flex flex-col items-center gap-1 text-center text-sm text-muted">
        <div>{org?.name ?? "The org"} went with other volunteers this time.</div>
        <Link href="/discover" className="font-semibold">
          See other roles
        </Link>
      </div>
    );
  }

  if (left <= 0) {
    return (
      <>
        <button
          type="button"
          onClick={() => toast("The waitlist is coming soon")}
          className="h-[54px] rounded-full border border-line-strong bg-card-soft text-base font-semibold text-muted"
        >
          Join waitlist
        </button>
        <div className="text-center text-[13px] text-muted">
          This one filled up. We&apos;ll ask the org to add spots.
        </div>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => request(role.id)}
        className="h-[49px] rounded-full bg-ink text-base font-semibold text-white"
      >
        I&apos;m interested
      </button>
      <div className="text-center text-xs text-muted">
        The org confirms your spot. No commitment until they do.
      </div>
    </>
  );
}

function GoingView({
  role,
  org,
  volunteer,
  application,
}: {
  role: Role;
  org?: Org;
  volunteer: Volunteer;
  application: Application;
}) {
  const state = useDemoStore();
  const withdraw = useDemoStore((s) => s.withdraw);
  const image = imageFor(role.image);
  const filled = filledCount(role, state.applications);
  void application;

  const cantMakeIt = () => {
    if (window.confirm(`Give up your spot at ${role.title}?`)) {
      withdraw(role.id);
    }
  };

  return (
    <>
      <VolunteerTopNav />
      <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-[22px] px-6 pb-7 pt-3 lg:min-h-0 lg:max-w-170 lg:pt-6">
      <div className="lg:hidden">
        <PageHeader
          backHref="/discover"
          backLabel="Back to feed"
          trailing={
            <button
              type="button"
              aria-label="Share this role"
              onClick={() => toast("Sharing is coming soon")}
              className="-mr-2.5 flex size-11 items-center justify-center text-ink"
            >
              <ExportIcon size={22} />
            </button>
          }
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex size-13 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(217,88,59,0.28)]">
          <CheckIcon size={26} strokeWidth={2.6} />
        </div>
        <h1 className="font-display text-[34px] font-normal leading-[1.1] tracking-[-0.5px]">
          You&apos;re going, {firstName(volunteer.name)}.
        </h1>
        <p className="text-base leading-normal text-muted">
          {org?.name ?? "The org"} saved you a spot. {filled} of {role.spots} are in.
        </p>
      </div>

      <div className="flex flex-col rounded-feature border border-line bg-card shadow-[0_1px_2px_rgba(31,26,23,0.04),0_16px_40px_rgba(31,26,23,0.08)]">
        <div className="flex items-center gap-3.5 p-4">
          {image && (
            <Image
              src={image.src}
              alt={image.alt}
              width={144}
              height={144}
              className="size-18 shrink-0 rounded-thumb object-cover"
            />
          )}
          <div className="flex flex-col gap-1">
            <div className="font-display text-xl leading-[1.15]">{role.title}</div>
            <div className="text-sm text-muted">{org?.name}</div>
          </div>
        </div>
        <div className="mx-4 h-0 border-t-[1.5px] border-dashed border-[rgba(31,26,23,0.16)]" />
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-[3px]">
            <div className="text-xs font-semibold uppercase tracking-[0.4px] text-muted">
              When
            </div>
            <div className="text-[15px] font-semibold">{metaDate(role.date)}</div>
            <div className="text-sm text-muted">{timeRange(role.start, role.end)}</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <div className="text-xs font-semibold uppercase tracking-[0.4px] text-muted">
              Where
            </div>
            <div className="text-[15px] font-semibold">
              {role.address?.split(",")[0] ?? role.neighborhood}
            </div>
            {role.address && (
              <div className="text-sm text-muted">{role.neighborhood} neighborhood</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 px-4 pb-4">
          {role.skillsTaught.map((skill) => (
            <div
              key={skill}
              className="flex h-7 items-center rounded-full bg-accent-tint px-2.5 text-xs font-semibold text-accent-ink"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => toast("Calendar export is coming soon")}
          className="flex h-[54px] items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white"
        >
          <CalendarIcon size={18} />
          Add to calendar
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => toast("Directions are coming soon")}
            className="h-[50px] rounded-full border border-[rgba(31,26,23,0.12)] bg-card-soft text-[15px] font-semibold text-ink"
          >
            Directions
          </button>
          <button
            type="button"
            onClick={() => toast("Invites are coming soon")}
            className="h-[50px] rounded-full border border-[rgba(31,26,23,0.12)] bg-card-soft text-[15px] font-semibold text-ink"
          >
            Bring a friend
          </button>
        </div>
      </div>

      <div className="grow" />

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={cantMakeIt}
          className="py-3 font-semibold text-muted"
        >
          Can&apos;t make it?
        </button>
        <Link
          href={`/shifts/${role.id}/log` as never}
          className="py-3 font-semibold no-underline"
        >
          Log your shift
        </Link>
      </div>
      </main>
    </>
  );
}
