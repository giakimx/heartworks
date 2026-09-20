"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { Chip } from "@/components/ui/Chip";
import Segmented from "@/components/ui/Segmented";
import { toast } from "@/components/ui/Toast";
import { uid } from "@/lib/logic";
import { orgById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";
import type { Role, WorkType } from "@/lib/types";

const FLAGS = ["Training provided", "Good for groups", "Background check", "Minimum age"];

// "Sat, Oct 3" → ISO date in the showcase year; blank/unparseable → undefined.
function parseDate(text: string): string | undefined {
  const cleaned = text.trim().replace(/^[A-Za-z]{3,},\s*/, "");
  if (!cleaned) return undefined;
  const parsed = new Date(`${cleaned}, 2026 12:00 UTC`);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed.toISOString().slice(0, 10);
}

// "10 AM to 1 PM" → ["10:00", "13:00"]; unparseable → [undefined, undefined].
function parseTime(text: string): [string | undefined, string | undefined] {
  const m = text
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*(?:to|–|-)\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!m) return [undefined, undefined];
  const [, h1, m1, ap1, h2, m2, ap2] = m;
  const to24 = (h: string, min: string | undefined, ap: string | undefined, apFallback?: string) => {
    let hour = Number(h) % 12;
    const suffix = (ap ?? apFallback ?? "AM").toUpperCase();
    if (suffix === "PM") hour += 12;
    return `${String(hour).padStart(2, "0")}:${min ?? "00"}`;
  };
  return [to24(h1, m1, ap1, ap2), to24(h2, m2, ap2, ap1)];
}

export default function PostRolePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const state = useDemoStore();
  const postRole = useDemoStore((s) => s.postRole);
  const saveDraft = useDemoStore((s) => s.saveDraft);

  const orgId = state.viewer.kind === "org" ? state.viewer.id : "o_dbg";
  const org = orgById(state, orgId);
  const draft = state.roles.find((r) => r.orgId === orgId && r.status === "draft");

  const [form, setForm] = useState<{
    title: string;
    dateText: string;
    timeText: string;
    spots: number;
    taught: string[];
    needed: string[];
    mode: WorkType;
    address: string;
    impact: string;
    flags: string[];
  } | null>(null);

  // Prefill from the draft once the store has hydrated.
  const f = form ?? {
    title: draft?.title ?? "",
    dateText: "",
    timeText: "",
    spots: draft?.spots ?? 6,
    taught: draft?.skillsTaught ?? [],
    needed: draft?.skillsNeeded ?? [],
    mode: draft?.workType ?? "On-site",
    address: draft?.address ?? "",
    impact: draft?.impact ?? "",
    flags: [
      ...(draft?.trainingProvided ? ["Training provided"] : []),
      ...(draft?.goodForGroups ? ["Good for groups"] : []),
      ...(draft?.backgroundCheck ? ["Background check"] : []),
    ],
  };

  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<typeof f>) => setForm({ ...f, ...patch });
  const toggleIn = (key: "taught" | "needed" | "flags", label: string) =>
    set({
      [key]: f[key].includes(label)
        ? f[key].filter((x) => x !== label)
        : [...f[key], label],
    } as Partial<typeof f>);

  const buildRole = (): Omit<Role, "status"> => {
    const [start, end] = parseTime(f.timeText);
    return {
      id: draft?.id ?? uid("r"),
      orgId,
      title: f.title.trim(),
      image: draft?.image,
      date: parseDate(f.dateText) ?? draft?.date,
      start,
      end,
      neighborhood: org?.neighborhood ?? "",
      address: f.address.trim() || undefined,
      verify: draft?.verify,
      workType: f.mode,
      spots: f.spots,
      baseFilled: draft?.baseFilled ?? 0,
      skillsTaught: f.taught.filter((s) => s !== "Add your own"),
      skillsNeeded: f.needed,
      impact: f.impact.trim() || undefined,
      trainingProvided: f.flags.includes("Training provided") || undefined,
      goodForGroups: f.flags.includes("Good for groups") || undefined,
      backgroundCheck: f.flags.includes("Background check") || undefined,
      // "Minimum age" stays cosmetic: no number field in the form, and we
      // don't invent one (min age renders only when a role has minAge).
      minAge: draft?.minAge,
    };
  };

  const submit = () => {
    if (!f.title.trim()) {
      setError("Give the role a title so volunteers know what they're signing up for.");
      return;
    }
    if (f.taught.filter((s) => s !== "Add your own").length === 0) {
      setError("Pick at least one skill they'll gain — it's what we match on.");
      return;
    }
    postRole(buildRole(), draft?.id);
    router.push("/org");
  };

  const onSaveDraft = () => {
    saveDraft(buildRole());
    router.push("/org");
  };

  if (!hydrated) {
    return <main className="mx-auto min-h-dvh w-full max-w-120 px-6 pt-3" />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-[22px] px-6 pb-8 pt-3">
      <div className="flex h-11 items-center justify-between">
        <Link
          href="/org"
          aria-label="Back to org home"
          className="-ml-2.5 flex size-11 items-center justify-center text-ink"
        >
          <BackIcon size={24} strokeWidth={2.2} />
        </Link>
        <button
          type="button"
          onClick={onSaveDraft}
          className="py-3 text-sm font-semibold text-muted"
        >
          Save draft
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-normal leading-[1.15] tracking-[-0.4px]">
          Post a role
        </h1>
        <p className="text-[15px] leading-normal text-muted">
          Two minutes. Say what needs doing and what someone walks away knowing.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted"
        >
          Role title
        </label>
        <input
          id="title"
          type="text"
          value={f.title}
          onChange={(e) => set({ title: e.target.value })}
          className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="date"
            className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted"
          >
            Date
          </label>
          <input
            id="date"
            type="text"
            placeholder="Sat, Oct 3"
            value={f.dateText}
            onChange={(e) => set({ dateText: e.target.value })}
            className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="time"
            className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted"
          >
            Time
          </label>
          <input
            id="time"
            type="text"
            placeholder="10 AM to 1 PM"
            value={f.timeText}
            onChange={(e) => set({ timeText: e.target.value })}
            className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-line bg-[rgba(255,255,255,0.8)] px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <div className="text-base font-semibold">Volunteers needed</div>
          <div className="text-[13px] text-muted">We stop requests when it&apos;s full</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="One fewer"
            onClick={() => set({ spots: Math.max(1, f.spots - 1) })}
            className="flex size-11 items-center justify-center rounded-full border border-line-strong bg-ground text-ink"
          >
            <MinusIcon size={18} strokeWidth={2.4} />
          </button>
          <div className="min-w-6 text-center font-display text-2xl">{f.spots}</div>
          <button
            type="button"
            aria-label="One more"
            onClick={() => set({ spots: Math.min(99, f.spots + 1) })}
            className="flex size-11 items-center justify-center rounded-full border border-line-strong bg-ground text-ink"
          >
            <PlusIcon size={18} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-[3px]">
          <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
            Skills they&apos;ll gain
          </div>
          <div className="text-[13px] text-muted">
            This is what we match on. Roles with at least one get seen more.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {state.skills.learn.map((label) => (
            <Chip
              key={label}
              label={label}
              on={f.taught.includes(label)}
              onToggle={() => toggleIn("taught", label)}
            />
          ))}
          <Chip
            label="Add your own"
            on={false}
            onToggle={() => toast("Custom skills are coming soon")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
          Skills that help (optional)
        </div>
        <div className="flex flex-wrap gap-2">
          {state.skills.bring.map((label) => (
            <Chip
              key={label}
              label={label}
              on={f.needed.includes(label)}
              onToggle={() => toggleIn("needed", label)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
          Where
        </div>
        <Segmented
          options={["On-site", "Hybrid", "Remote"] as const}
          value={f.mode}
          onChange={(mode) => set({ mode })}
        />
        <label htmlFor="addr" className="sr-only">
          Address
        </label>
        <input
          id="addr"
          type="text"
          value={f.address}
          onChange={(e) => set({ address: e.target.value })}
          className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="impact"
          className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted"
        >
          Community impact, one sentence
        </label>
        <textarea
          id="impact"
          rows={3}
          placeholder="What changes in the neighborhood because this got done?"
          value={f.impact}
          onChange={(e) => set({ impact: e.target.value })}
          className="resize-none rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 py-3.5 text-base leading-[1.4] text-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {FLAGS.map((label) => (
          <label
            key={label}
            className="flex min-h-12 items-center gap-2.5 rounded-input border border-line bg-white/70 px-3.5 text-sm font-medium"
          >
            <input
              type="checkbox"
              checked={f.flags.includes(label)}
              onChange={() => toggleIn("flags", label)}
              className="size-[18px] accent-ink"
            />
            {label}
          </label>
        ))}
      </div>

      {error && (
        <div className="text-center text-sm font-medium text-accent-ink" role="alert">
          {error}
        </div>
      )}

      <div className="grow" />

      <button
        type="button"
        onClick={submit}
        className="flex h-14 items-center justify-center rounded-full bg-ink text-base font-semibold text-white"
      >
        Post role
      </button>
    </main>
  );
}
