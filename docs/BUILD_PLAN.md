# build plan

## stack

- next.js (app router) + typescript
- tailwind css, tokens from `docs/DESIGN.md` wired into the tailwind theme
- zustand + `persist` middleware (localStorage) for the single demo store
- fonts via `next/font/google`: Young Serif (display), Instrument Sans (ui)
- icons: inline stroke svgs copied from the reference files (24 viewBox, stroke 2–2.4, round caps). no icon library needed.
- deploy: vercel

no auth, no api routes, no db. if a later version needs persistence, the store's actions are the api surface to move server-side (supabase is the expected target).

## routes

| route | screen | mobile ref | desktop ref |
|---|---|---|---|
| `/` | landing | `Main` | `DLanding` |
| `/onboarding` | goals picker | `Onboarding` | `DGoals` |
| `/discover` | match feed | `Feed` | `DFeed` |
| `/roles/[id]` | role detail. states: open / requested / accepted / full | `Role` + `Going` | `DRole` + `DGoing` |
| `/shifts` | my shifts (accepted + awaiting log). simple list, reuse feed row | — | — |
| `/shifts/[id]/log` | log hours + skills | `LogShift` | `DLogShift` |
| `/profile` | stamps + verified skills | `Profile` | `DProfile` |
| `/org` | org home | `OrgHome` | `DOrgHome` |
| `/org/roles/new` | post a role | `PostRole` | `DPostRole` |
| `/org/roles/[id]/requests` | accept / decline | `Requests` | `DRequests` |
| `/org/shifts/[id]/confirm` | confirm attendance | `OrgConfirm` | `DOrgConfirm` |

`/roles/[id]` when the viewer's application is `accepted` renders the "you're going" layout (`Going`) instead of the request card.

## demo chrome

- a small fixed "demo" pill (bottom-left, low contrast) with: **view as volunteer (gia)** / **view as org (detroit body garage)** / **reset demo**. this replaces auth. it's the only ui not in the reference screens.
- current viewer is `store.viewer = { kind: 'volunteer', id } | { kind: 'org', id }`.

## build order

1. scaffold, tokens, fonts, gradient background, base components (`docs/DESIGN.md` § components)
2. store + seed + match scoring (`docs/DATA_MODEL.md`), with unit tests for the state machine and scoring
3. volunteer path: landing → onboarding → discover → role (open → requested)
4. org path: org home → requests (accept/decline)
5. close the loop: accepted state on role page → log shift → org confirm → stamp on profile
6. post a role (new role appears in discover, scored against gia's goals)
7. desktop layouts at `lg`
8. polish: focus states, empty states, reset demo, 404

ship after step 5 if time runs out. steps 6–8 are upgrades.

## definition of done (the pitch script)

run this click path on a phone-width viewport with a fresh reset, no console errors:

1. landing → get started → pick goals → show my matches
2. "paint the building!" is the top match and shows *why* (learn tags matching chosen goals)
3. open it → i'm interested → request sent
4. switch to org → org home shows a request count that includes gia → open requests → accept gia → fill bar moves 4→5 of 7
5. switch to volunteer → role page says "you're going, gia" and 5 of 7
6. log shift (3 hrs, mural painting + teamwork)
7. switch to org → confirm shift → gia is listed with her reported hours → confirm
8. switch to volunteer → profile shows a new detroit body garage stamp, hours and verified skills updated

## out of scope for the demo

search results page, notifications/sms, waitlist logic beyond the label, export, share, calendar/directions (buttons render, no-op with a toast), multi-org accounts, the full volunteer application form in `PRODUCT.md`.
