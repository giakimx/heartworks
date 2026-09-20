"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/chrome/PageHeader";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { Chip } from "@/components/ui/Chip";
import { weekday } from "@/lib/format";
import { applicationFor, orgById, roleById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

export default function LogShiftPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const state = useDemoStore();
  const logShift = useDemoStore((s) => s.logShift);

  const role = roleById(state, id);
  const [hours, setHours] = useState<number | null>(null);
  const [used, setUsed] = useState<string[] | null>(null);
  const [note, setNote] = useState("");

  if (!role) return null;
  const org = orgById(state, role.orgId);
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : undefined;
  const application = volunteerId
    ? applicationFor(state, role.id, volunteerId)
    : undefined;

  const h = hours ?? role.hours ?? 3;
  const skills = used ?? role.skillsTaught.slice(0, 2);
  const options = [...role.skillsTaught, "Something else"];

  const toggle = (label: string) =>
    setUsed(
      skills.includes(label) ? skills.filter((x) => x !== label) : [...skills, label]
    );

  const submit = () => {
    if (!application) return;
    logShift(application.id, h, skills, note.trim() || undefined);
    router.push("/profile");
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-[22px] px-6 pb-7 pt-3">
      <PageHeader backHref={`/roles/${role.id}`} backLabel="Back" trailing={<div />} />

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[32px] font-normal leading-[1.1] tracking-[-0.5px]">
          How was {weekday(role.date) || "the shift"}?
        </h1>
        <p className="text-base leading-normal text-muted">
          {role.title} at {org?.name}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 rounded-card border border-line bg-[rgba(255,255,255,0.8)] p-[18px]">
        <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
          Hours you put in
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="One hour less"
            onClick={() => setHours(Math.max(1, h - 1))}
            className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-ground text-ink"
          >
            <MinusIcon size={20} strokeWidth={2.4} />
          </button>
          <div className="flex items-baseline gap-1.5">
            <div className="font-display text-5xl leading-none">{h}</div>
            <div className="text-base text-muted">{h === 1 ? "hour" : "hours"}</div>
          </div>
          <button
            type="button"
            aria-label="One hour more"
            onClick={() => setHours(Math.min(12, h + 1))}
            className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-ground text-ink"
          >
            <PlusIcon size={20} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
          Skills you actually used
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((label) => (
            <Chip
              key={label}
              label={label}
              on={skills.includes(label)}
              onToggle={() => toggle(label)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="note"
          className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted"
        >
          One line for your profile (optional)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Primed and painted the east wall"
          className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink"
        />
      </div>

      <div className="grow" />

      <div className="flex flex-col gap-3">
        <div className="text-center text-[13px] leading-normal text-muted">
          {org?.name} confirms with one tap, then it&apos;s stamped on your profile as
          verified experience.
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!hydrated || !application || application.status !== "accepted"}
          className="flex h-14 items-center justify-center rounded-full bg-ink text-base font-semibold text-white disabled:opacity-50"
        >
          Log shift
        </button>
      </div>
    </main>
  );
}
