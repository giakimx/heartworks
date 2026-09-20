import { describe, expect, it } from "vitest";
import * as logic from "@/lib/logic";
import { seedState } from "@/lib/seed";
import { filledCount } from "@/lib/scoring";
import {
  applicantsForRole,
  attendanceForRole,
  orgRequestedCount,
  orgRoleToConfirm,
  orgRoleWithMostRequests,
  profileStats,
  verifiedSkills,
} from "@/lib/selectors";
import { spotsLabel } from "@/lib/format";

describe("derived values on the untouched seed", () => {
  it("r_paint shows 4 of 7 — requested applications never count as filled", () => {
    const data = seedState();
    const paint = data.roles.find((r) => r.id === "r_paint")!;
    expect(filledCount(paint, data.applications)).toBe(4);
  });

  it("gia's profile derives 2 shifts and 6 hours from her stamps", () => {
    const data = seedState();
    expect(profileStats(data, "v_gia")).toEqual({ shifts: 2, hours: 6, skills: 2 });
  });

  it("verified skills group by skill with confirming org names", () => {
    const data = seedState();
    const skills = verifiedSkills(data, "v_gia");
    const gardening = skills.find((s) => s.skill === "Gardening");
    expect(gardening?.hours).toBe(2);
    expect(gardening?.confirmedBy).toEqual(["Kintsugi Village"]);
  });

  it("org home sees 2 pending requests and a shift to confirm before gia does anything", () => {
    const data = seedState();
    expect(orgRequestedCount(data, "o_dbg")).toBe(2);
    expect(orgRoleWithMostRequests(data, "o_dbg")?.id).toBe("r_paint");
    expect(orgRoleToConfirm(data, "o_dbg")?.id).toBe("r_prep");
  });

  it("applicants sort by match score, tie broken by application order", () => {
    const data = seedState();
    const applicants = applicantsForRole(data, "r_paint");
    // marcus (Teamwork) and elena (Mural painting) both score 3; stable sort
    // keeps request order, matching the reference screen.
    expect(applicants.map((a) => a.volunteer.id)).toEqual(["v_marcus", "v_elena"]);
    expect(applicants[0].wants).toEqual(["Teamwork"]);
    expect(applicants[1].wants).toEqual(["Mural painting"]);
    expect(applicants[0].history).toBe("New to Heartworks");
  });

  it("attendance for r_prep lists the three logged volunteers", () => {
    const data = seedState();
    expect(attendanceForRole(data, "r_prep")).toHaveLength(3);
  });
});

describe("derived values as the demo advances", () => {
  it("accepting gia moves the paint fill bar from 4 to 5 of 7", () => {
    let data = seedState();
    data = { ...data, ...logic.request(data, "r_paint", "v_gia")! };
    const giaApp = data.applications.find(
      (a) => a.roleId === "r_paint" && a.volunteerId === "v_gia"
    )!;
    expect(orgRequestedCount(data, "o_dbg")).toBe(3);
    data = { ...data, ...logic.accept(data, giaApp.id)! };
    const paint = data.roles.find((r) => r.id === "r_paint")!;
    expect(filledCount(paint, data.applications)).toBe(5);
  });
});

describe("spots label", () => {
  it("covers the three variants", () => {
    expect(spotsLabel(3)).toBe("3 spots left");
    expect(spotsLabel(1)).toBe("1 spot left");
    expect(spotsLabel(0)).toBe("Full · join waitlist");
  });
});
