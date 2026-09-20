"use client";

// The only UI not in the reference screens: a low-contrast demo switcher that
// replaces auth. Switching viewer also navigates so we never render one
// side's pages with the other side's viewer.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemoStore } from "@/lib/store";

const VOLUNTEER_ID = "v_gia";
const ORG_ID = "o_dbg";

export default function DemoPill() {
  const [open, setOpen] = useState(false);
  const viewer = useDemoStore((s) => s.viewer);
  const setViewer = useDemoStore((s) => s.setViewer);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const router = useRouter();

  const asVolunteer = () => {
    setViewer({ kind: "volunteer", id: VOLUNTEER_ID });
    setOpen(false);
    router.push("/discover");
  };
  const asOrg = () => {
    setViewer({ kind: "org", id: ORG_ID });
    setOpen(false);
    router.push("/org");
  };
  const reset = () => {
    if (!window.confirm("Reset the demo to its starting state?")) return;
    resetDemo();
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {open && (
        <div className="flex flex-col overflow-hidden rounded-[11px] border border-line bg-card shadow-card backdrop-blur-md">
          <button
            type="button"
            onClick={asVolunteer}
            aria-pressed={viewer.kind === "volunteer"}
            className={`px-4 py-2.5 text-left text-[13px] font-medium hover:bg-ink/5 ${
              viewer.kind === "volunteer" ? "text-ink" : "text-muted"
            }`}
          >
            {viewer.kind === "volunteer" ? "✓ " : ""}view as volunteer (gia)
          </button>
          <button
            type="button"
            onClick={asOrg}
            aria-pressed={viewer.kind === "org"}
            className={`border-t border-line px-4 py-2.5 text-left text-[13px] font-medium hover:bg-ink/5 ${
              viewer.kind === "org" ? "text-ink" : "text-muted"
            }`}
          >
            {viewer.kind === "org" ? "✓ " : ""}view as org (detroit body garage)
          </button>
          <button
            type="button"
            onClick={reset}
            className="border-t border-line px-4 py-2.5 text-left text-[13px] font-medium text-muted hover:bg-ink/5"
          >
            reset demo
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rounded-full border border-line bg-card-soft px-3.5 py-2 text-xs font-semibold text-muted shadow-card backdrop-blur-md hover:text-ink"
      >
        demo
      </button>
    </div>
  );
}
