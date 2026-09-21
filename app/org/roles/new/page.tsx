"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrgTopNav } from "@/components/chrome/TopNav";
import { BackIcon, MinusIcon, PlusIcon, SearchIcon } from "@/components/icons";
import RolePreviewCard from "@/components/org/RolePreviewCard";
import { Chip } from "@/components/ui/Chip";
import Segmented from "@/components/ui/Segmented";
import { toast } from "@/components/ui/Toast";
import { uid } from "@/lib/logic";
import { orgById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";
import type { Role, WorkType } from "@/lib/types";

const FLAGS = ["Training provided", "Good for groups", "Background check", "Minimum age"];

// The date field is a native date input, so it hands us ISO directly;
// anything else (old drafts) falls through the loose parser.
function parseDate(text: string): string | undefined {
  const cleaned = text.trim().replace(/^[A-Za-z]{3,},\s*/, "");
  if (!cleaned) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
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
    description: string;
    minAgeText: string;
    flags: string[];
  } | null>(null);

  // Prefill from the draft once the store has hydrated.
  const f = form ?? {
    title: draft?.title ?? "",
    dateText: draft?.date ?? "",
    timeText: "",
    spots: draft?.spots ?? 6,
    taught: draft?.skillsTaught ?? [],
    needed: draft?.skillsNeeded ?? [],
    mode: draft?.workType ?? "On-site",
    address: draft?.address ?? "",
    impact: draft?.impact ?? "",
    description: draft?.description ?? "",
    minAgeText: draft?.minAge ? String(draft.minAge) : "",
    flags: [
      ...(draft?.trainingProvided ? ["Training provided"] : []),
      ...(draft?.goodForGroups ? ["Good for groups"] : []),
      ...(draft?.backgroundCheck ? ["Background check"] : []),
      ...(draft?.minAge ? ["Minimum age"] : []),
    ],
  };

  const [error, setError] = useState<string | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");

  // 7 chips up front (selected ones always visible); More... browses the rest
  const visibleTaught = [
    ...state.skills.learn.slice(0, 7),
    ...f.taught.filter((s) => !state.skills.learn.slice(0, 7).includes(s)),
  ];
  const browsableSkills = state.skills.learn.filter((s) =>
    s.toLowerCase().includes(skillQuery.trim().toLowerCase())
  );

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
      address: f.mode === "Remote" ? undefined : f.address.trim() || undefined,
      verify: draft?.verify,
      workType: f.mode,
      spots: f.spots,
      baseFilled: draft?.baseFilled ?? 0,
      skillsTaught: f.taught,
      skillsNeeded: f.needed,
      impact: f.impact.trim() || undefined,
      description: f.description.trim() || undefined,
      trainingProvided: f.flags.includes("Training provided") || undefined,
      goodForGroups: f.flags.includes("Good for groups") || undefined,
      backgroundCheck: f.flags.includes("Background check") || undefined,
      minAge:
        f.flags.includes("Minimum age") && Number(f.minAgeText) > 0
          ? Number(f.minAgeText)
          : undefined,
    };
  };

  const submit = () => {
    if (!f.title.trim()) {
      setError("Give the event a name so volunteers know what they're signing up for.");
      return;
    }
    if (f.taught.length === 0) {
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
    <>
    <OrgTopNav />
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-[22px] px-6 pb-8 pt-3 lg:min-h-0 lg:max-w-240 lg:pb-14 lg:pt-6">
      <div className="flex h-11 items-center justify-between lg:hidden">
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

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-normal leading-[1.15] tracking-[-0.4px] lg:text-[44px] lg:leading-[1.08] lg:tracking-[-0.8px]">
            Post an event
          </h1>
          <p className="text-[15px] leading-normal text-muted">
            Two minutes. Say what needs doing and what someone walks away knowing.
          </p>
        </div>
        <button
          type="button"
          onClick={onSaveDraft}
          className="hidden py-3 text-sm font-semibold text-muted lg:block"
        >
          Save draft
        </button>
      </div>

      <div className="contents lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
      <div className="contents lg:flex lg:flex-col lg:gap-[22px]">
      <button
        type="button"
        onClick={() => toast("Image upload is coming soon")}
        className="flex h-24 flex-col items-center justify-center gap-1.5 rounded-input border-[1.5px] border-dashed border-[rgba(31,26,23,0.24)] bg-white/50 text-[13px] font-semibold text-muted"
      >
        <PlusIcon size={20} />
        Add images
      </button>

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="sr-only">
          Event name
        </label>
        <input
          id="title"
          type="text"
          placeholder="Event name"
          value={f.title}
          onChange={(e) => set({ title: e.target.value })}
          className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink placeholder:text-muted/70"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="sr-only">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={f.dateText}
            onChange={(e) => set({ dateText: e.target.value })}
            className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="time" className="sr-only">
            Time
          </label>
          <input
            id="time"
            type="text"
            placeholder="10 AM to 1 PM"
            value={f.timeText}
            onChange={(e) => set({ timeText: e.target.value })}
            className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink placeholder:text-muted/70"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[11px] border border-line bg-[rgba(255,255,255,0.8)] px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <div className="text-base font-semibold">Volunteers needed</div>
          <div className="text-[13px] text-muted">We keep waitlists when it&apos;s full</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="One fewer"
            onClick={() => set({ spots: Math.max(1, f.spots - 1) })}
            className="flex size-9 items-center justify-center rounded-full border border-line-strong bg-ground text-ink"
          >
            <MinusIcon size={16} strokeWidth={2.4} />
          </button>
          <div className="min-w-6 text-center font-display text-2xl">{f.spots}</div>
          <button
            type="button"
            aria-label="One more"
            onClick={() => set({ spots: Math.min(99, f.spots + 1) })}
            className="flex size-9 items-center justify-center rounded-full border border-line-strong bg-ground text-ink"
          >
            <PlusIcon size={16} strokeWidth={2.4} />
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
        <div className="flex flex-wrap items-center gap-2">
          {visibleTaught.map((label) => (
            <Chip
              key={label}
              label={label}
              small
              on={f.taught.includes(label)}
              onToggle={() => toggleIn("taught", label)}
            />
          ))}
          <button
            type="button"
            onClick={() => setSkillsOpen(true)}
            className="px-1 py-2 text-[13px] font-semibold text-accent-ink"
          >
            More...
          </button>
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
              small
              on={f.needed.includes(label)}
              onToggle={() => toggleIn("needed", label)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Segmented
          options={["On-site", "Hybrid", "Remote"] as const}
          value={f.mode}
          onChange={(mode) => set({ mode })}
          small
        />
        <label htmlFor="addr" className="sr-only">
          Location
        </label>
        <input
          id="addr"
          type="text"
          value={f.address}
          onChange={(e) => set({ address: e.target.value })}
          disabled={f.mode === "Remote"}
          placeholder={
            f.mode === "Remote" ? "No location needed for remote roles" : "Location"
          }
          className="h-13 rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 text-base text-ink placeholder:text-muted/70 disabled:border-line disabled:bg-white/40 disabled:text-muted/60"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="impact" className="sr-only">
          Community impact
        </label>
        <textarea
          id="impact"
          rows={3}
          placeholder="Community impact, one sentence — what changes in the neighborhood because this got done?"
          value={f.impact}
          onChange={(e) => set({ impact: e.target.value })}
          className="resize-none rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 py-3.5 text-base leading-[1.4] text-ink placeholder:text-muted/70"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="about" className="sr-only">
          About
        </label>
        <textarea
          id="about"
          rows={6}
          placeholder="About — what the day looks like: schedule, what to bring, who they'll meet."
          value={f.description}
          onChange={(e) => set({ description: e.target.value })}
          className="resize-none rounded-input border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 py-3.5 text-base leading-[1.4] text-ink placeholder:text-muted/70"
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
            {label === "Minimum age" && f.flags.includes("Minimum age") && (
              <input
                type="number"
                min={1}
                max={99}
                value={f.minAgeText}
                onChange={(e) => set({ minAgeText: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                aria-label="Minimum age"
                placeholder="16"
                className="ml-auto h-9 w-14 rounded-[8px] border border-line-strong bg-white px-2 text-center text-sm text-ink"
              />
            )}
          </label>
        ))}
      </div>

      {error && (
        <div className="text-center text-sm font-medium text-accent-ink" role="alert">
          {error}
        </div>
      )}

      <div className="grow lg:hidden" />

      <button
        type="button"
        onClick={submit}
        className="flex h-11 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white"
      >
        Post event
      </button>
      </div>

      <div className="sticky top-6 hidden lg:block">
        <RolePreviewCard
          title={f.title}
          orgName={org?.name}
          orgColor={org?.color}
          neighborhood={org?.neighborhood}
          workType={f.mode}
          taught={f.taught}
          spots={f.spots}
        />
      </div>
      </div>

      {skillsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Browse skills"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSkillsOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <div className="relative flex max-h-[70vh] w-full max-w-90 flex-col gap-3 overflow-hidden rounded-card border border-line bg-white p-4 shadow-card">
            <div className="flex h-11 items-center gap-2.5 rounded-full border border-line-strong bg-ground px-4">
              <SearchIcon size={16} className="text-muted" />
              <label htmlFor="skill-q" className="sr-only">
                Search skills
              </label>
              <input
                id="skill-q"
                type="search"
                autoFocus
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="Search skills"
                className="min-w-0 grow bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
              />
            </div>
            <div className="flex flex-wrap gap-2 overflow-y-auto">
              {browsableSkills.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  small
                  on={f.taught.includes(label)}
                  onToggle={() => toggleIn("taught", label)}
                />
              ))}
              {browsableSkills.length === 0 && (
                <div className="py-2 text-sm text-muted">
                  No skills match &ldquo;{skillQuery.trim()}&rdquo;.
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSkillsOpen(false);
                setSkillQuery("");
              }}
              className="h-10 rounded-full bg-ink text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
