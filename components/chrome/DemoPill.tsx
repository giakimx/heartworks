"use client";

// The only UI not in the reference screens: a low-contrast demo switcher that
// replaces auth. One small toggle between the two sides (switching also
// navigates so we never render one side's pages with the other's viewer),
// plus a tiny reset.

import { useRouter } from "next/navigation";
import { useDemoStore, useHydrated } from "@/lib/store";

const VOLUNTEER_ID = "v_gia";
const ORG_ID = "o_dbg";

export default function DemoPill() {
  const hydrated = useHydrated();
  const viewer = useDemoStore((s) => s.viewer);
  const setViewer = useDemoStore((s) => s.setViewer);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const router = useRouter();

  const isVolunteer = viewer.kind === "volunteer";

  const toggle = () => {
    if (isVolunteer) {
      setViewer({ kind: "org", id: ORG_ID });
      router.push("/org");
    } else {
      setViewer({ kind: "volunteer", id: VOLUNTEER_ID });
      router.push("/discover");
    }
  };

  const reset = () => {
    if (!window.confirm("Reset the demo to its starting state?")) return;
    resetDemo();
    router.push("/");
  };

  if (!hydrated) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggle}
        className="rounded-full border border-line bg-card-soft px-3.5 py-2 text-xs font-semibold text-muted shadow-card backdrop-blur-md hover:text-ink"
      >
        {isVolunteer ? "org view (for demo)" : "user view (for demo)"}
      </button>
      <button
        type="button"
        onClick={reset}
        aria-label="Reset demo"
        className="rounded-full border border-line bg-card-soft px-2.5 py-2 text-xs font-medium text-muted/70 shadow-card backdrop-blur-md hover:text-ink"
      >
        reset
      </button>
    </div>
  );
}
