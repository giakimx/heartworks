import { describe, expect, it } from "vitest";
import * as logic from "@/lib/logic";
import { seedState } from "@/lib/seed";
import { filledCount } from "@/lib/scoring";
import type { DemoData } from "@/lib/types";

function apply(data: DemoData, changes: Partial<DemoData> | null): DemoData {
  expect(changes).not.toBeNull();
  return { ...data, ...changes };
}

describe("application state machine", () => {
  it("request creates a requested application", () => {
    let data = seedState();
    data = apply(data, logic.request(data, "r_paint", "v_gia"));
    const app = data.applications.find(
      (a) => a.roleId === "r_paint" && a.volunteerId === "v_gia"
    );
    expect(app?.status).toBe("requested");
  });

  it("request is blocked when the role is full", () => {
    const data = seedState();
    expect(logic.request(data, "r_garden", "v_gia")).toBeNull();
  });

  it("request is idempotent per volunteer+role", () => {
    let data = seedState();
    data = apply(data, logic.request(data, "r_paint", "v_gia"));
    expect(logic.request(data, "r_paint", "v_gia")).toBeNull();
  });

  it("undoRequest deletes the application", () => {
    let data = seedState();
    data = apply(data, logic.request(data, "r_paint", "v_gia"));
    data = { ...data, ...logic.undoRequest(data, "r_paint", "v_gia") };
    expect(
      data.applications.some((a) => a.roleId === "r_paint" && a.volunteerId === "v_gia")
    ).toBe(false);
  });

  it("accept moves requested to accepted and counts toward filled", () => {
    let data = seedState();
    const before = filledCount(data.roles.find((r) => r.id === "r_paint")!, data.applications);
    data = apply(data, logic.accept(data, "a1"));
    expect(data.applications.find((a) => a.id === "a1")?.status).toBe("accepted");
    const after = filledCount(data.roles.find((r) => r.id === "r_paint")!, data.applications);
    expect(after).toBe(before + 1);
  });

  it("accept is blocked when full", () => {
    let data = seedState();
    // fill paint to 7 of 7: 4 base + accept marcus (a1), gia, jordan
    data = apply(data, logic.accept(data, "a1"));
    data = apply(data, logic.request(data, "r_paint", "v_gia"));
    const giaApp = data.applications.find(
      (a) => a.roleId === "r_paint" && a.volunteerId === "v_gia"
    )!;
    data = apply(data, logic.accept(data, giaApp.id));
    data = apply(data, logic.request(data, "r_paint", "v_jordan"));
    const jordanApp = data.applications.find(
      (a) => a.roleId === "r_paint" && a.volunteerId === "v_jordan"
    )!;
    data = apply(data, logic.accept(data, jordanApp.id));
    // elena (a2) is still requested against a full role
    expect(logic.accept(data, "a2")).toBeNull();
    // and no new request can be made against a full role
    expect(logic.request(data, "r_park", "v_gia")).not.toBeNull();
    expect(logic.request(data, "r_garden", "v_gia")).toBeNull();
  });

  it("decline and undoDecision round-trip through requested", () => {
    let data = seedState();
    data = apply(data, logic.decline(data, "a1"));
    expect(data.applications.find((a) => a.id === "a1")?.status).toBe("declined");
    data = apply(data, logic.undoDecision(data, "a1"));
    expect(data.applications.find((a) => a.id === "a1")?.status).toBe("requested");
  });

  it("withdraw deletes an accepted application", () => {
    let data = seedState();
    data = apply(data, logic.accept(data, "a1")); // marcus accepted on r_paint
    data = { ...data, ...logic.withdraw(data, "r_paint", "v_marcus") };
    expect(
      data.applications.some((a) => a.roleId === "r_paint" && a.volunteerId === "v_marcus")
    ).toBe(false);
  });

  it("logShift stores hours, skills and note on an accepted application", () => {
    let data = seedState();
    data = apply(data, logic.accept(data, "a1"));
    data = apply(data, logic.logShift(data, "a1", 3, ["Teamwork"], "great day"));
    const app = data.applications.find((a) => a.id === "a1")!;
    expect(app.status).toBe("logged");
    expect(app.loggedHours).toBe(3);
    expect(app.loggedSkills).toEqual(["Teamwork"]);
    expect(app.note).toBe("great day");
  });

  it("logShift only applies to accepted applications", () => {
    const data = seedState();
    expect(logic.logShift(data, "a1", 3, [])).toBeNull(); // a1 is requested
  });

  it("confirmShift confirms present, no-shows absent, stamps only the present, and finishes the role", () => {
    let data = seedState();
    // r_prep has a3 (elena, 3h), a4 (marcus, 2h), a5 (jordan, 3h) all logged
    data = apply(data, logic.confirmShift(data, "r_prep", ["a3", "a5"]));
    expect(data.applications.find((a) => a.id === "a3")?.status).toBe("confirmed");
    expect(data.applications.find((a) => a.id === "a5")?.status).toBe("confirmed");
    expect(data.applications.find((a) => a.id === "a4")?.status).toBe("no_show");
    const newStamps = data.stamps.filter((s) => s.roleId === "r_prep");
    expect(newStamps).toHaveLength(2);
    expect(newStamps.find((s) => s.volunteerId === "v_elena")?.hours).toBe(3);
    expect(newStamps.find((s) => s.volunteerId === "v_marcus")).toBeUndefined();
    expect(data.roles.find((r) => r.id === "r_prep")?.status).toBe("done");
    // other roles' applications untouched
    expect(data.applications.find((a) => a.id === "a1")?.status).toBe("requested");
  });

  it("confirmShift falls back to role hours for accepted apps that never logged", () => {
    let data = seedState();
    data = apply(data, logic.accept(data, "a1")); // marcus accepted on r_paint (role.hours = 3)
    const marcusApp = data.applications.find((a) => a.id === "a1")!;
    data = apply(data, logic.confirmShift(data, "r_paint", [marcusApp.id]));
    const stamp = data.stamps.find(
      (s) => s.roleId === "r_paint" && s.volunteerId === "v_marcus"
    );
    expect(stamp?.hours).toBe(3);
  });

  it("postRole replaces the draft it came from and goes live", () => {
    let data = seedState();
    const draft = data.roles.find((r) => r.id === "r_greeters")!;
    data = {
      ...data,
      ...logic.postRole(data, { ...draft, title: "Opening day greeters" }, "r_greeters"),
    };
    const posted = data.roles.find((r) => r.id === "r_greeters")!;
    expect(posted.status).toBe("live");
    expect(data.roles.filter((r) => r.id === "r_greeters")).toHaveLength(1);
  });
});
