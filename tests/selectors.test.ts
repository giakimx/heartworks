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
  searchRoles,
  verifiedSkills,
} from "@/lib/selectors";
import { spotsLabel, spotsLeftLabel } from "@/lib/format";

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

describe("search", () => {
  it("matches titles, orgs, neighborhoods and skills, case-insensitively", () => {
    const data = seedState();
    expect(searchRoles(data, "v_gia", "paint").map((r) => r.id)).toEqual(["r_paint"]);
    expect(searchRoles(data, "v_gia", "colony").map((r) => r.id)).toEqual(["r_cats"]);
    expect(searchRoles(data, "v_gia", "GARDENING").map((r) => r.id)).toContain(
      "r_garden"
    );
    expect(searchRoles(data, "v_gia", "corktown")).toHaveLength(2);
    expect(searchRoles(data, "v_gia", "riverfront").length).toBeGreaterThan(0);
  });

  it("returns nothing for an empty or unmatched query, and never draft/done roles", () => {
    const data = seedState();
    expect(searchRoles(data, "v_gia", "  ")).toEqual([]);
    expect(searchRoles(data, "v_gia", "zamboni")).toEqual([]);
    // "prep" hits Wall prep day's title, but it's done — not searchable
    expect(searchRoles(data, "v_gia", "wall prep")).toEqual([]);
  });
});

describe("spots label", () => {
  it("shows momentum on discovery surfaces and the waitlist when full", () => {
    expect(spotsLabel(4, 7)).toBe("4/7 going");
    expect(spotsLabel(0, 6)).toBe("0/6 going");
    expect(spotsLabel(10, 10)).toBe("Full · join waitlist");
  });

  it("keeps the scarcity variant for the register card", () => {
    expect(spotsLeftLabel(3)).toBe("3 spots left");
    expect(spotsLeftLabel(1)).toBe("1 spot left");
    expect(spotsLeftLabel(0)).toBe("Full · join waitlist");
  });
});
