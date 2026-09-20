// Types mirror docs/DATA_MODEL.md; seed/seed.json matches this shape.

export type Skill = string; // fixed vocabulary in seed.skills, but kept loose (seed stamps use off-vocab skills)

export type Volunteer = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  neighborhood?: string;
  learnGoals: Skill[]; // "i want to learn"
  brings: Skill[]; // "i can bring"
};

export type Org = {
  id: string;
  name: string;
  initials: string;
  color: string;
  neighborhood: string;
  blurb?: string;
};

export type RoleStatus = "draft" | "live" | "done";
export type WorkType = "On-site" | "Hybrid" | "Remote";

export type Role = {
  id: string;
  orgId: string;
  title: string;
  image?: string;
  status: RoleStatus;
  date?: string; // ISO date
  start?: string; // "12:00"
  end?: string; // "15:00"
  hours?: number;
  neighborhood: string;
  address?: string;
  verify?: boolean; // address/neighborhood flagged for verification — render as-is
  workType: WorkType;
  spots: number;
  baseFilled: number; // seats taken by people outside the demo cast
  skillsTaught: Skill[]; // "you'll build" — the thing we match on
  skillsNeeded: Skill[]; // matched against volunteer.brings
  impact?: string;
  description?: string;
  trainingProvided?: boolean;
  goodForGroups?: boolean;
  backgroundCheck?: boolean;
  minAge?: number;
};

export type ApplicationStatus =
  | "requested"
  | "accepted"
  | "declined"
  | "logged"
  | "confirmed"
  | "no_show";

export type Application = {
  id: string;
  roleId: string;
  volunteerId: string;
  status: ApplicationStatus;
  loggedHours?: number;
  loggedSkills?: Skill[];
  note?: string;
};

export type Stamp = {
  id: string;
  volunteerId: string;
  roleId: string | null; // seeded stamps predate the demo's roles
  orgId: string;
  hours: number;
  skills: Skill[];
  date: string;
  image?: string;
  place?: string;
};

export type Viewer =
  | { kind: "volunteer"; id: string }
  | { kind: "org"; id: string };

export type SkillVocab = { learn: Skill[]; bring: Skill[] };

export type DemoData = {
  viewer: Viewer;
  skills: SkillVocab;
  orgs: Org[];
  volunteers: Volunteer[];
  roles: Role[];
  applications: Application[];
  stamps: Stamp[];
};
