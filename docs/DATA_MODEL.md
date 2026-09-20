# data model

all client-side. types below are the store shape; `seed/seed.json` matches it.

```ts
type Skill = string; // from a fixed vocabulary, see seed.skills

type Volunteer = {
  id: string; name: string; initials: string; avatarColor: string;
  neighborhood?: string;
  learnGoals: Skill[];   // "i want to learn"
  brings: Skill[];       // "i can bring"
};

type Org = { id: string; name: string; initials: string; color: string; neighborhood: string; blurb?: string };

type Role = {
  id: string; orgId: string;
  title: string; image?: string;
  status: 'draft' | 'live' | 'done';
  date?: string;          // ISO date
  start?: string; end?: string; // "12:00", "15:00"
  hours?: number;
  neighborhood: string; address?: string; verify?: boolean;
  workType: 'On-site' | 'Hybrid' | 'Remote';
  spots: number;
  baseFilled: number;     // seats taken by people outside the demo cast, so bars aren't empty
  skillsTaught: Skill[];  // "you'll build" — the thing we match on
  skillsNeeded: Skill[];  // optional, matched against volunteer.brings
  impact?: string; description?: string;
  trainingProvided?: boolean; goodForGroups?: boolean; backgroundCheck?: boolean; minAge?: number;
};

type Application = {
  id: string; roleId: string; volunteerId: string;
  status: 'requested' | 'accepted' | 'declined' | 'logged' | 'confirmed' | 'no_show';
  loggedHours?: number; loggedSkills?: Skill[]; note?: string;
};

type Stamp = { id: string; volunteerId: string; roleId: string; orgId: string; hours: number; skills: Skill[]; date: string; image?: string };
```

## state machine (Application)

```
(none) --request--> requested --accept--> accepted --logShift--> logged --confirm--> confirmed  => creates Stamp
                        |                     |                     |
                        +--decline--> declined +--withdraw--> (deleted)  +--markNoShow--> no_show
requested --undo--> (deleted)
accepted/declined --undo (org)--> requested
```

rules:
- `filled(role) = role.baseFilled + count(applications where status in accepted|logged|confirmed)`
- `request` is blocked when `filled >= spots` (ui shows "full · join waitlist", no-op)
- `accept` is blocked when full
- `confirm` happens per shift for all ticked volunteers at once; unticked → `no_show`
- a `Stamp` is created only on `confirm`. profile totals derive from stamps, never stored:
  - shifts = stamps.length, hours = sum(stamps.hours)
  - verified skills = group stamps by skill → `{ skill, hours, confirmedBy: org names }`

org home counters derive too: "people want in" = requested count across live roles; "confirm a finished shift" = roles with any `logged` application.

## store actions

`setGoals(learn, brings)`, `request(roleId)`, `undoRequest(roleId)`, `withdraw(roleId)`, `accept(appId)`, `decline(appId)`, `undoDecision(appId)`, `logShift(appId, hours, skills, note)`, `confirmShift(roleId, presentAppIds)`, `postRole(role)`, `saveDraft(role)`, `setViewer(viewer)`, `resetDemo()`.

## match scoring

pure function, unit-tested. transparent on purpose — the ui shows the *reason*, not a number.

```ts
score(volunteer, role) =
    3 * |role.skillsTaught ∩ volunteer.learnGoals|
  + 2 * |role.skillsNeeded ∩ volunteer.brings|
  + 1 * (role.neighborhood === volunteer.neighborhood ? 1 : 0)
  - 100 * (role is full ? 1 : 0)      // full roles sink but stay visible
```

- discover sorts live roles by score desc, then date asc. highest score renders as the "top match" feature card.
- each card shows up to two `Learn · <skill>` tags, **matched skills first**.
- role page: "n match your goals" line under "you'll build" uses the same intersection.
- requests screen (org side): applicants sorted by the same score; "wants" = volunteer.learnGoals ∩ role.skillsTaught (fall back to first two goals), "brings" = volunteer.brings.
- feed subtitle: "matched to a, b and c" from the volunteer's goals (max 3).

## seed story

`seed/seed.json` is set up so that after a reset:
- gia has 2 stamps (belle isle conservancy 4 hrs, kintsugi village 2 hrs) → the detroit body garage stamp is the one earned live in the demo
- "paint the building!" has 4 of 7 filled with 2 other people already requesting → gia's request makes it 3
- "wall prep day" is done with logged hours waiting for org confirmation (so the org side has something to confirm even before gia logs)
- "opening day greeters" is a draft, which is what post-a-role opens prefilled

dates in the seed are relative to the showcase (sept 2026). if demoing later, shift them; nothing in the logic depends on "today".
