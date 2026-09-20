import type { Application, Role, Skill, Volunteer } from "./types";

export function intersect(a: Skill[], b: Skill[]): Skill[] {
  const set = new Set(b);
  return a.filter((s) => set.has(s));
}

export function filledCount(role: Role, applications: Application[]): number {
  return (
    role.baseFilled +
    applications.filter(
      (a) =>
        a.roleId === role.id &&
        (a.status === "accepted" || a.status === "logged" || a.status === "confirmed")
    ).length
  );
}

export function isFull(role: Role, applications: Application[]): boolean {
  return filledCount(role, applications) >= role.spots;
}

// docs/DATA_MODEL.md § match scoring. Transparent on purpose — the ui shows
// the reason, not the number. Full roles sink but stay visible.
export function score(
  volunteer: Volunteer,
  role: Role,
  applications: Application[]
): number {
  return (
    3 * intersect(role.skillsTaught, volunteer.learnGoals).length +
    2 * intersect(role.skillsNeeded, volunteer.brings).length +
    (role.neighborhood === volunteer.neighborhood ? 1 : 0) -
    (isFull(role, applications) ? 100 : 0)
  );
}

// Up to `max` learn tags for a role card, matched-to-goals first.
export function matchedLearnTags(
  role: Role,
  volunteer: Volunteer | undefined,
  max = 2
): Skill[] {
  if (!volunteer) return role.skillsTaught.slice(0, max);
  const matched = intersect(role.skillsTaught, volunteer.learnGoals);
  const rest = role.skillsTaught.filter((s) => !matched.includes(s));
  return [...matched, ...rest].slice(0, max);
}

// Requests screen: what the applicant wants from this role.
// learnGoals ∩ skillsTaught, falling back to their first two goals.
export function wants(volunteer: Volunteer, role: Role): Skill[] {
  const matched = intersect(volunteer.learnGoals, role.skillsTaught);
  return matched.length > 0 ? matched : volunteer.learnGoals.slice(0, 2);
}
