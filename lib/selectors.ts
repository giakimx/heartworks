// Derived values only — nothing here is ever stored (docs/DATA_MODEL.md).

import { filledCount, score, wants } from "./scoring";
import type {
  Application,
  DemoData,
  Org,
  Role,
  Skill,
  Volunteer,
} from "./types";

export function volunteerById(data: DemoData, id: string): Volunteer | undefined {
  return data.volunteers.find((v) => v.id === id);
}

export function orgById(data: DemoData, id: string): Org | undefined {
  return data.orgs.find((o) => o.id === id);
}

export function roleById(data: DemoData, id: string): Role | undefined {
  return data.roles.find((r) => r.id === id);
}

export function applicationFor(
  data: DemoData,
  roleId: string,
  volunteerId: string
): Application | undefined {
  return data.applications.find(
    (a) => a.roleId === roleId && a.volunteerId === volunteerId
  );
}

// Live roles, score desc then date asc; head is the top match.
export function discoverRoles(data: DemoData, volunteerId: string): Role[] {
  const v = volunteerById(data, volunteerId);
  const live = data.roles.filter((r) => r.status === "live");
  if (!v) return live;
  return [...live].sort((a, b) => {
    const diff = score(v, b, data.applications) - score(v, a, data.applications);
    if (diff !== 0) return diff;
    return (a.date ?? "9999").localeCompare(b.date ?? "9999");
  });
}

// Live roles matching a free-text query (title, org, neighborhood, skills),
// in match-ranked order. Empty query -> no results (the feed shows instead).
export function searchRoles(
  data: DemoData,
  volunteerId: string,
  query: string
): Role[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return discoverRoles(data, volunteerId).filter((role) => {
    const org = orgById(data, role.orgId);
    return [
      role.title,
      org?.name ?? "",
      role.neighborhood,
      ...role.skillsTaught,
      ...role.skillsNeeded,
    ].some((text) => text.toLowerCase().includes(q));
  });
}

export function profileStats(data: DemoData, volunteerId: string) {
  const stamps = data.stamps.filter((s) => s.volunteerId === volunteerId);
  const skills = new Set(stamps.flatMap((s) => s.skills));
  return {
    shifts: stamps.length,
    hours: stamps.reduce((sum, s) => sum + s.hours, 0),
    skills: skills.size,
  };
}

export type VerifiedSkill = { skill: Skill; hours: number; confirmedBy: string[] };

export function verifiedSkills(data: DemoData, volunteerId: string): VerifiedSkill[] {
  const stamps = data.stamps.filter((s) => s.volunteerId === volunteerId);
  const bySkill = new Map<Skill, VerifiedSkill>();
  for (const stamp of stamps) {
    const orgName = orgById(data, stamp.orgId)?.name ?? "";
    for (const skill of stamp.skills) {
      const entry = bySkill.get(skill) ?? { skill, hours: 0, confirmedBy: [] };
      entry.hours += stamp.hours;
      if (orgName && !entry.confirmedBy.includes(orgName)) entry.confirmedBy.push(orgName);
      bySkill.set(skill, entry);
    }
  }
  return [...bySkill.values()];
}

export function stampsFor(data: DemoData, volunteerId: string) {
  // newest first
  return data.stamps
    .filter((s) => s.volunteerId === volunteerId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function orgRoles(data: DemoData, orgId: string): Role[] {
  return data.roles.filter((r) => r.orgId === orgId);
}

// "people want in" — requested count across the org's live roles.
export function orgRequestedCount(data: DemoData, orgId: string): number {
  const liveIds = new Set(
    data.roles.filter((r) => r.orgId === orgId && r.status === "live").map((r) => r.id)
  );
  return data.applications.filter(
    (a) => liveIds.has(a.roleId) && a.status === "requested"
  ).length;
}

// Role with the most pending requests (org home action card target).
export function orgRoleWithMostRequests(data: DemoData, orgId: string): Role | undefined {
  const live = data.roles.filter((r) => r.orgId === orgId && r.status === "live");
  let best: Role | undefined;
  let bestCount = 0;
  for (const r of live) {
    const count = data.applications.filter(
      (a) => a.roleId === r.id && a.status === "requested"
    ).length;
    if (count > bestCount) {
      best = r;
      bestCount = count;
    }
  }
  return best;
}

// "confirm a finished shift" — first of the org's roles with any logged application.
export function orgRoleToConfirm(data: DemoData, orgId: string): Role | undefined {
  return data.roles.find(
    (r) =>
      r.orgId === orgId &&
      data.applications.some((a) => a.roleId === r.id && a.status === "logged")
  );
}

export function requestedCountForRole(data: DemoData, roleId: string): number {
  return data.applications.filter(
    (a) => a.roleId === roleId && a.status === "requested"
  ).length;
}

export type Applicant = {
  application: Application;
  volunteer: Volunteer;
  history: string; // "n stamps · h verified hours" or "New to Heartworks"
  wants: Skill[];
  brings: Skill[];
};

// Applicants for the org requests screen, sorted by match score.
// Includes decided ones (accepted/declined render as state pills with undo).
export function applicantsForRole(data: DemoData, roleId: string): Applicant[] {
  const r = roleById(data, roleId);
  if (!r) return [];
  const apps = data.applications.filter(
    (a) =>
      a.roleId === roleId &&
      (a.status === "requested" || a.status === "accepted" || a.status === "declined")
  );
  const items = apps.flatMap((application) => {
    const volunteer = volunteerById(data, application.volunteerId);
    if (!volunteer) return [];
    const stats = profileStats(data, volunteer.id);
    return [
      {
        application,
        volunteer,
        history:
          stats.shifts > 0
            ? `${stats.shifts} ${stats.shifts === 1 ? "stamp" : "stamps"} · ${stats.hours} verified hours`
            : "New to Heartworks",
        wants: wants(volunteer, r),
        brings: volunteer.brings,
      },
    ];
  });
  return items.sort(
    (a, b) =>
      score(b.volunteer, r, data.applications) - score(a.volunteer, r, data.applications)
  );
}

// Attendance rows for the confirm screen: logged apps plus accepted-with-no-log
// ("hasn't logged yet", unticked by default).
export function attendanceForRole(data: DemoData, roleId: string) {
  return data.applications
    .filter(
      (a) => a.roleId === roleId && (a.status === "logged" || a.status === "accepted")
    )
    .flatMap((application) => {
      const volunteer = volunteerById(data, application.volunteerId);
      return volunteer ? [{ application, volunteer }] : [];
    });
}

// My shifts: the viewer's applications still in motion.
export function myShifts(data: DemoData, volunteerId: string) {
  return data.applications
    .filter(
      (a) =>
        a.volunteerId === volunteerId &&
        (a.status === "requested" || a.status === "accepted" || a.status === "logged")
    )
    .flatMap((application) => {
      const role = roleById(data, application.roleId);
      return role ? [{ application, role }] : [];
    });
}

export { filledCount };

export function spotsLeft(role: Role, applications: Application[]): number {
  return Math.max(0, role.spots - filledCount(role, applications));
}
