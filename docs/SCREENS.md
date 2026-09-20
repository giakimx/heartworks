# screens

reference files live in `design/screens/mobile/*.dc.html` (390px) and `design/screens/desktop/D*.dc.html` (1280px). live canvas (both pages, clickable): https://claude.ai/artifact/LpWJjoG7txeXLgmYZ4kEsh

"data" = what comes from the store instead of the hard-coded copy in the reference.

## volunteer

### 1. landing — `/` — `Main` / `DLanding`
- cta "get started" → `/onboarding`. "i'm posting for an organization" → sets viewer to org → `/org`. "sign in" → `/discover` (demo: no auth).
- data: stats pill = orgs count + volunteers count from the store. if that looks silly with seed sizes, hide the pill.
- desktop: split hero; floating role card = current top match; floating stamp = decorative.

### 2. goals — `/onboarding` — `Onboarding` / `DGoals`
- two chip groups from `seed.skills` (`learn` and `bring` vocab). multi-select, toggle.
- footer: "n selected" / "pick at least one to tune your feed". cta → `setGoals` → `/discover`. skip allowed.
- progress bar is cosmetic (step 2 of 3); steps 1 and 3 don't exist in the demo.

### 3. match feed — `/discover` — `Feed` / `DFeed`
- subtitle "matched to x, y and z" from goals. no goals → "roles near you" + a link back to `/onboarding`.
- top match = highest score. others: mobile grouped by neighborhood as rows; desktop 3-up grid.
- each role: date · org, title, up to 2 learn tags (matched first), spots label: `n spots left` / `1 spot left` / `full · join waitlist`.
- filter chips: "for you" (default sort). others can be visual only for the demo, except neighborhood chips on desktop if cheap.
- mobile tab bar: discover / my shifts / community(profile).

### 4. role — `/roles/[id]` — `Role` + `Going` / `DRole` + `DGoing`
states by the viewer's application:
- **none/open**: "i'm interested" + "the org confirms your spot. no commitment until they do."
- **requested**: "request sent" + "we'll text you when {org} replies." + undo. (the "preview: org accepts" link in the reference is canvas-only — **don't build it**; use the demo viewer switch.)
- **accepted**: render the `Going` layout: check badge, "you're going, {firstName}.", "{org} saved you a spot. {filled} of {spots} are in.", ticket, add to calendar / directions / bring a friend (no-op toasts), "can't make it?" → withdraw (confirm first). after the shift date, or always in the demo, show "log your shift" → `/shifts/[id]/log` (replaces the canvas-only "preview: after the shift" link).
- **logged**: "hours sent to {org} for confirmation."
- **confirmed**: "stamped." + link to `/profile`.
- **declined**: soft note + "see other roles" → `/discover`.
- **full** (and no application): disabled-looking "join waitlist" no-op.
- content blocks: date tile, location tile, you'll build (tags + "n match your goals"), community impact, about, facts grid (work type, training, groups, min age — only those that are set).

### 5. log shift — `/shifts/[id]/log` — `LogShift` / `DLogShift`
- title "how was {weekday}?". hours stepper (1–12, default role.hours). skill chips = role.skillsTaught + "something else". optional one-line note.
- cta → `logShift` → `/profile` with a pending row ("waiting on {org} to confirm") — the stamp appears only after org confirmation.

### 6. profile — `/profile` — `Profile` / `DProfile`
- title "{firstName}'s community". stats: shifts / hours / skills (derived).
- stamps newest first + "find your next stamp" slot → `/discover`. desktop adds faint empty slots to fill the wall to 6.
- verified skills list: skill, "confirmed by {org}", hours.
- export / share buttons: no-op toast "coming soon".

### my shifts — `/shifts` (no reference; keep trivial)
- list of the viewer's applications in `requested | accepted | logged`, using the feed row component with a status tag. empty state → link to discover.

## org

### o1. org home — `/org` — `OrgHome` / `DOrgHome`
- subtitle "{neighborhood} · n things need you" (n = number of visible action cards).
- action cards (hide when zero): "people want in" (requested count, → requests for the role with the most) and "confirm a finished shift" (→ confirm for first role with logged hours).
- your roles: live, needs-confirming, drafts. mobile rows; desktop table (role / when / filled / requests / status).
- "post a role" → `/org/roles/new`.

### o2. post a role — `/org/roles/new` — `PostRole` / `DPostRole`
- fields: title, date, time, volunteers needed (stepper), skills they'll gain (chips, this is what's matched), skills that help (chips), where (segmented + address), community impact, requirement checks.
- opens prefilled from the draft role if one exists. "save draft" / "post role" → `/org`.
- validation: title + at least one skill gained to post. inline, friendly.
- desktop: live preview card on the right reflecting title, work type, learn tags, spots.
- a posted role must show up in `/discover` immediately, scored against the volunteer's goals.

### o3. requests — `/org/roles/[id]/requests` — `Requests` / `DRequests`
- header: role · date, fill bar + "n of m filled" / "n spots open" / "full".
- applicant cards sorted by match: initials avatar, history ("n stamps · h verified hours" or "new to heartworks"), wants, brings.
- accept / "not this time" → state pill with undo. accept disabled when full.

### o4. confirm shift — `/org/shifts/[id]/confirm` — `OrgConfirm` / `DOrgConfirm`
- rows = applications in `logged` for the role (plus `accepted` with no log, shown as "hasn't logged yet", unticked by default).
- everyone pre-ticked; row is one big toggle. summary "{h} verified hours go on {n} profiles as stamps." cta "confirm n volunteers" → `confirmShift` → `/org`.

## canvas-only things to ignore
- `{{accent}}` tweak props, `data-props`, `$preview`, `hint-*` attributes
- "preview: …" links (they exist because canvas artboards don't share state; the real app does)
- fixed heights on root containers (artboards are fixed-size; real pages flow)
