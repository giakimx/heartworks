// The definition-of-done click path (docs/BUILD_PLAN.md) as one store test.
// If this passes, the loop the pitch depends on works end to end.

import { beforeEach, describe, expect, it } from "vitest";
import { seedState } from "@/lib/seed";
import { filledCount } from "@/lib/scoring";
import {
  applicationFor,
  discoverRoles,
  profileStats,
  stampsFor,
  verifiedSkills,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";

describe("the pitch script", () => {
  beforeEach(() => {
    useDemoStore.setState({ ...seedState() });
  });

  it("runs the whole loop: goals → match → request → accept → log → confirm → stamp", () => {
    const store = useDemoStore.getState();

    // 1–2. pick goals → paint the building is the top match
    store.setGoals(["Mural painting", "Gardening"], ["Design"]);
    let s = useDemoStore.getState();
    expect(discoverRoles(s, "v_gia")[0].id).toBe("r_paint");

    // 3. i'm interested → request sent
    s.request("r_paint");
    s = useDemoStore.getState();
    const requested = applicationFor(s, "r_paint", "v_gia");
    expect(requested?.status).toBe("requested");

    // 4. org accepts gia → fill bar 4→5 of 7
    s.accept(requested!.id);
    s = useDemoStore.getState();
    expect(applicationFor(s, "r_paint", "v_gia")?.status).toBe("accepted");
    expect(filledCount(s.roles.find((r) => r.id === "r_paint")!, s.applications)).toBe(5);

    // 6. gia logs 3 hrs, mural painting + teamwork
    s.logShift(applicationFor(s, "r_paint", "v_gia")!.id, 3, [
      "Mural painting",
      "Teamwork",
    ]);
    s = useDemoStore.getState();
    expect(applicationFor(s, "r_paint", "v_gia")?.status).toBe("logged");

    // 7. org confirms the shift with gia present
    s.confirmShift("r_paint", [applicationFor(s, "r_paint", "v_gia")!.id]);
    s = useDemoStore.getState();
    expect(applicationFor(s, "r_paint", "v_gia")?.status).toBe("confirmed");

    // 8. profile shows the new detroit body garage stamp and updated totals
    const stamps = stampsFor(s, "v_gia");
    expect(stamps).toHaveLength(4);
    const newStamp = stamps.find((st) => st.roleId === "r_paint")!;
    expect(newStamp.orgId).toBe("o_dbg");
    expect(newStamp.hours).toBe(3);
    expect(newStamp.skills).toEqual(["Mural painting", "Teamwork"]);
    expect(profileStats(s, "v_gia")).toEqual({ shifts: 4, hours: 11, skills: 5 });
    const mural = verifiedSkills(s, "v_gia").find((v) => v.skill === "Mural painting");
    expect(mural?.confirmedBy).toEqual(["Detroit Body Garage"]);
  });

  it("resetDemo restores the seed snapshot", () => {
    const store = useDemoStore.getState();
    store.setGoals(["Carpentry"], []);
    store.request("r_paint");
    store.resetDemo();
    const s = useDemoStore.getState();
    expect(s.volunteers.find((v) => v.id === "v_gia")?.learnGoals).toEqual([]);
    expect(applicationFor(s, "r_paint", "v_gia")).toBeUndefined();
    expect(s.applications).toHaveLength(5);
  });
});
