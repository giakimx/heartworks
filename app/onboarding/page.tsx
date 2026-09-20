"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackIcon } from "@/components/icons";
import { Chip } from "@/components/ui/Chip";
import { useDemoStore } from "@/lib/store";

export default function OnboardingPage() {
  const router = useRouter();
  const skills = useDemoStore((s) => s.skills);
  const setGoals = useDemoStore((s) => s.setGoals);
  const setViewer = useDemoStore((s) => s.setViewer);
  const [learn, setLearn] = useState<string[]>([]);
  const [bring, setBring] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, label: string) =>
    set(list.includes(label) ? list.filter((x) => x !== label) : [...list, label]);

  const count = learn.length + bring.length;

  const showMatches = () => {
    setViewer({ kind: "volunteer", id: "v_gia" });
    setGoals(learn, bring);
    router.push("/discover");
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-[22px] px-6 pb-7 pt-4">
      <div className="flex h-11 items-center gap-4">
        <Link
          href="/"
          aria-label="Back"
          className="-ml-2.5 flex size-11 items-center justify-center text-ink"
        >
          <BackIcon size={24} strokeWidth={2.2} />
        </Link>
        <div className="flex grow gap-1.5" aria-hidden="true">
          <div className="h-1 grow rounded-[4px] bg-ink" />
          <div className="h-1 grow rounded-[4px] bg-ink" />
          <div className="h-1 grow rounded-[4px] bg-line-strong" />
        </div>
        <Link href="/discover" className="py-3 text-sm font-semibold text-muted no-underline">
          Skip
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-normal leading-[1.15] tracking-[-0.4px]">
          What do you want out of volunteering?
        </h1>
        <p className="text-[15px] leading-normal text-muted">
          We match on this, not just your free Saturdays. Change it anytime.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
          I want to learn
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.learn.map((label) => (
            <Chip
              key={label}
              label={label}
              on={learn.includes(label)}
              onToggle={() => toggle(learn, setLearn, label)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.4px] text-muted">
          I can bring
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.bring.map((label) => (
            <Chip
              key={label}
              label={label}
              on={bring.includes(label)}
              onToggle={() => toggle(bring, setBring, label)}
            />
          ))}
        </div>
      </div>

      <div className="grow" />

      <div className="flex flex-col gap-3">
        <div className="text-center text-sm text-muted" aria-live="polite">
          {count === 0 ? "Pick at least one to tune your feed" : `${count} selected`}
        </div>
        <button
          type="button"
          onClick={showMatches}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white"
        >
          Show my matches
        </button>
      </div>
    </main>
  );
}
