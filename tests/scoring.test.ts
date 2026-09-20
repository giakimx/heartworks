import { describe, expect, it } from "vitest";
import { seedState } from "@/lib/seed";
import { matchedLearnTags, score } from "@/lib/scoring";
import { discoverRoles } from "@/lib/selectors";
import type { Volunteer } from "@/lib/types";

// Gia's demo picks from the pitch script.
function giaWithGoals(): Volunteer {
  const data = seedState();
  const gia = data.volunteers.find((v) => v.id === "v_gia")!;
  return { ...gia, learnGoals: ["Mural painting", "Gardening"], brings: ["Design"] };
}

describe("match scoring", () => {
  it("scores the seed roles per the pitch: paint 6, park 1, cats 0, garden sunk by full penalty", () => {
    const data = seedState();
    const gia = giaWithGoals();
    const byId = (id: string) => data.roles.find((r) => r.id === id)!;
    // 3·(Mural painting) + 2·(Design) + 1·(Little Village)
    expect(score(gia, byId("r_paint"), data.applications)).toBe(6);
    // neighborhood only
    expect(score(gia, byId("r_park"), data.applications)).toBe(1);
    expect(score(gia, byId("r_cats"), data.applications)).toBe(0);
    // 3·(Gardening) − 100 (10 of 10 filled)
    expect(score(gia, byId("r_garden"), data.applications)).toBe(-97);
  });

  it("puts Paint the building! on top of discover and keeps the full role visible last", () => {
    const data = seedState();
    data.volunteers = data.volunteers.map((v) =>
      v.id === "v_gia" ? giaWithGoals() : v
    );
    const sorted = discoverRoles(data, "v_gia");
    expect(sorted[0].id).toBe("r_paint");
    expect(sorted.map((r) => r.id)).toContain("r_garden");
    expect(sorted[sorted.length - 1].id).toBe("r_garden");
  });

  it("breaks score ties by date ascending", () => {
    const data = seedState();
    // no goals: park (1, Sep 30) vs paint (1, Sep 18) both neighborhood-only
    const sorted = discoverRoles(data, "v_gia");
    const paint = sorted.findIndex((r) => r.id === "r_paint");
    const park = sorted.findIndex((r) => r.id === "r_park");
    expect(paint).toBeLessThan(park);
  });

  it("orders learn tags matched-first, capped at two", () => {
    const data = seedState();
    const gia = giaWithGoals();
    const paint = data.roles.find((r) => r.id === "r_paint")!;
    const tags = matchedLearnTags(paint, gia);
    expect(tags).toHaveLength(2);
    expect(tags[0]).toBe("Mural painting");
  });

  it("gives every role a non-negative score for a volunteer with no goals", () => {
    const data = seedState();
    const gia = data.volunteers.find((v) => v.id === "v_gia")!;
    for (const role of data.roles.filter((r) => r.status === "live" && r.id !== "r_garden")) {
      expect(score(gia, role, data.applications)).toBeGreaterThanOrEqual(0);
    }
  });
});
