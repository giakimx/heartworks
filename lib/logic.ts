// Pure state-machine transitions (docs/DATA_MODEL.md § state machine).
// Each takes the relevant slices and returns the changed slices; the store's
// actions are thin wrappers. No React, no zustand — unit-testable as-is.

import { filledCount } from "./scoring";
import type { Application, DemoData, Role, Skill, Stamp } from "./types";

let counter = 0;
export function uid(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}

function role(data: DemoData, roleId: string): Role | undefined {
  return data.roles.find((r) => r.id === roleId);
}

function app(data: DemoData, appId: string): Application | undefined {
  return data.applications.find((a) => a.id === appId);
}

function replaceApp(
  applications: Application[],
  next: Application
): Application[] {
  return applications.map((a) => (a.id === next.id ? next : a));
}

// (none) --request--> requested. Blocked when full.
export function request(
  data: DemoData,
  roleId: string,
  volunteerId: string
): Pick<DemoData, "applications"> | null {
  const r = role(data, roleId);
  if (!r || filledCount(r, data.applications) >= r.spots) return null;
  const existing = data.applications.find(
    (a) => a.roleId === roleId && a.volunteerId === volunteerId
  );
  if (existing) return null;
  return {
    applications: [
      ...data.applications,
      { id: uid("a"), roleId, volunteerId, status: "requested" },
    ],
  };
}

// requested --undo--> (deleted)
export function undoRequest(
  data: DemoData,
  roleId: string,
  volunteerId: string
): Pick<DemoData, "applications"> {
  return {
    applications: data.applications.filter(
      (a) =>
        !(
          a.roleId === roleId &&
          a.volunteerId === volunteerId &&
          a.status === "requested"
        )
    ),
  };
}

// accepted --withdraw--> (deleted)
export function withdraw(
  data: DemoData,
  roleId: string,
  volunteerId: string
): Pick<DemoData, "applications"> {
  return {
    applications: data.applications.filter(
      (a) =>
        !(
          a.roleId === roleId &&
          a.volunteerId === volunteerId &&
          a.status === "accepted"
        )
    ),
  };
}

// requested --accept--> accepted. Blocked when full.
export function accept(
  data: DemoData,
  appId: string
): Pick<DemoData, "applications"> | null {
  const a = app(data, appId);
  if (!a || a.status !== "requested") return null;
  const r = role(data, a.roleId);
  if (!r || filledCount(r, data.applications) >= r.spots) return null;
  return { applications: replaceApp(data.applications, { ...a, status: "accepted" }) };
}

// requested --decline--> declined
export function decline(
  data: DemoData,
  appId: string
): Pick<DemoData, "applications"> | null {
  const a = app(data, appId);
  if (!a || a.status !== "requested") return null;
  return { applications: replaceApp(data.applications, { ...a, status: "declined" }) };
}

// accepted/declined --undo (org)--> requested
export function undoDecision(
  data: DemoData,
  appId: string
): Pick<DemoData, "applications"> | null {
  const a = app(data, appId);
  if (!a || (a.status !== "accepted" && a.status !== "declined")) return null;
  return { applications: replaceApp(data.applications, { ...a, status: "requested" }) };
}

// accepted --logShift--> logged
export function logShift(
  data: DemoData,
  appId: string,
  hours: number,
  skills: Skill[],
  note?: string
): Pick<DemoData, "applications"> | null {
  const a = app(data, appId);
  if (!a || a.status !== "accepted") return null;
  return {
    applications: replaceApp(data.applications, {
      ...a,
      status: "logged",
      loggedHours: hours,
      loggedSkills: skills,
      note,
    }),
  };
}

// Per-shift confirm: ticked logged/accepted apps -> confirmed (+ Stamp),
// unticked -> no_show. The role leaves the "needs confirming" bucket.
export function confirmShift(
  data: DemoData,
  roleId: string,
  presentAppIds: string[]
): Pick<DemoData, "applications" | "stamps" | "roles"> | null {
  const r = role(data, roleId);
  if (!r) return null;
  const present = new Set(presentAppIds);
  const stamps: Stamp[] = [...data.stamps];
  const applications = data.applications.map((a) => {
    if (a.roleId !== roleId) return a;
    if (a.status !== "logged" && a.status !== "accepted") return a;
    if (!present.has(a.id)) return { ...a, status: "no_show" as const };
    stamps.push({
      id: uid("s"),
      volunteerId: a.volunteerId,
      roleId: r.id,
      orgId: r.orgId,
      hours: a.loggedHours ?? r.hours ?? 0,
      skills: a.loggedSkills ?? [],
      date: r.date ?? new Date().toISOString().slice(0, 10),
      image: r.image,
      place: r.neighborhood,
    });
    return { ...a, status: "confirmed" as const };
  });
  const roles = data.roles.map((x) =>
    x.id === roleId ? { ...x, status: "done" as const } : x
  );
  return { applications, stamps, roles };
}

// Post a role: goes live, replacing the draft it was opened from (if any).
export function postRole(
  data: DemoData,
  draft: Omit<Role, "status">,
  fromDraftId?: string
): Pick<DemoData, "roles"> {
  const posted: Role = { ...draft, status: "live" };
  const rest = data.roles.filter((r) => r.id !== fromDraftId && r.id !== draft.id);
  return { roles: [...rest, posted] };
}

export function saveDraft(
  data: DemoData,
  draft: Omit<Role, "status">
): Pick<DemoData, "roles"> {
  const saved: Role = { ...draft, status: "draft" };
  const rest = data.roles.filter((r) => r.id !== draft.id);
  return { roles: [...rest, saved] };
}
