# heartworks — demo build

two-sided volunteer marketplace for detroit. matches volunteers to org roles on **skills and goals**, not just availability. team zia, venture 313 buildathon, showcase **sept 22, 2026**. this repo is the clickable demo, not production.

read in this order:
1. `docs/PRODUCT.md` — what it is, who it's for, mvp feature list (source of truth for scope)
2. `docs/BUILD_PLAN.md` — stack, routes, build order, definition of done
3. `docs/DATA_MODEL.md` — entities, state machine, match scoring
4. `docs/DESIGN.md` — tokens, components, responsive rules
5. `docs/SCREENS.md` — every screen, its route, states, and which reference file to copy from
6. `design/screens/` — pixel reference for all 11 screens, mobile (390) and desktop (1280)
7. `seed/seed.json` — demo data. the story in the pitch depends on it.

## hard rules

- **demo first.** no auth, no backend, no database. one client-side store persisted to localStorage. a "reset demo" action restores `seed/seed.json`.
- **both sides share one store.** volunteer taps "i'm interested" → it shows up in the org's requests. org accepts → volunteer's role page flips to "you're going". org confirms shift → stamp appears on the volunteer profile. this loop is the entire pitch. if it breaks, nothing else matters.
- **match the reference screens.** spacing, radii, colors and type are exact in the inline styles of `design/screens/**`. port them to tokens in `docs/DESIGN.md`; don't reinterpret.
- **mobile-first, one codebase.** mobile layout below `lg` (1024px), desktop layout at `lg` and up. don't ship two apps.
- **no invented numbers in ui copy.** landing stats come from the store (`orgs.length`, `volunteers.length`) or get cut.
- accessibility as drawn: real `<button>`/`<a>`/`<label>`, 44px touch targets, `aria-pressed` on toggles, visible focus rings.
- copy stays as written in the reference screens (sentence case, plain, warm). don't add emoji.

## reading the reference files

`*.dc.html` files are design-canvas templates, not runnable pages. treat them as markup + exact styles:
- `{{ name }}` = a value from the `renderVals()` function in the `<script>` at the bottom of the same file
- `<sc-for list="{{ xs }}" as="x">` = map over a list; `<sc-if value="{{ flag }}">` = conditional
- `onClick="{{ fn }}"` = handler defined in `renderVals()`; the state logic there is the intended behavior, port it
- `<a href="Other.dc.html">` = navigation to that screen
- `{{accent}}` = the accent token (`#D9583B`)
- images point at `design/assets/*.jpg`. these are **low-res placeholders cropped from a mock**. wire them through seed data so real photos can replace them.

## known open items (don't silently "fix")

- `8635 Mack Ave` is not in little village. address/neighborhood in seed is flagged `"verify": true`.
- min age on the role page is a placeholder (`[MIN AGE]`). render only if the role has `minAge`.
- volunteer names other than gia are sample data.
