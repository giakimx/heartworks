# design

direction: simple, luma-like, warm and welcoming. ivory ground, one soft glow at the top of every page, glassy white cards, near-black pill buttons, serif display over clean sans. machine-readable tokens: `design/tokens.json`, `design/tokens.css`.

## color

| token | value | use |
|---|---|---|
| `ground` | `#FBF6F1` | page background |
| `ink` | `#1F1A17` | text, primary buttons, selected chips |
| `muted` | `#6B5F58` | secondary text, inactive nav (5.6:1 on ground) |
| `accent` | `#D9583B` | heart logo, progress fill, success badge, stamp image border. **never small text** (3.6:1) |
| `accent-ink` | `#8A2E1A` | links, learn tags text, stamp hours |
| `accent-tint` | `#FBE3D9` | learn tag background, request count badge |
| `ok-ink` / `ok-tint` | `#1E6B40` / `#E3F1E7` | accepted state, "live" status |
| `line` | `rgba(31,26,23,0.08)` | card borders, row dividers |
| `line-strong` | `rgba(31,26,23,0.14)` | input + secondary button borders |
| `card` | `rgba(255,255,255,0.85)` | cards (0.75 for chips/secondary buttons) |
| `stamp-paper` | `#FFFDF9` | stamps |
| avatar fills | `#F2B8A0 #C9B8E8 #A9D4B8 #F3D48A`, org `#E9A23B` | initials avatars |

page glow (the "subtle gradient"), applied to the page root, fixed to the top, does not scroll-repeat:

```css
/* mobile */
background:
  radial-gradient(120% 420px at 0% 0%,  #FBD9CB 0%, rgba(251,217,203,0) 70%),
  radial-gradient(100% 380px at 100% 0%, #F7D4DD 0%, rgba(247,212,221,0) 70%),
  radial-gradient(90% 300px at 50% 0%,  #FCEBCB 0%, rgba(252,235,203,0) 75%),
  #FBF6F1;
/* desktop (lg+) */
background:
  radial-gradient(60% 560px at 0% 0%,  #FBD9CB 0%, rgba(251,217,203,0) 70%),
  radial-gradient(55% 520px at 100% 0%, #F7D4DD 0%, rgba(247,212,221,0) 70%),
  radial-gradient(50% 400px at 50% 0%,  #FCEBCB 0%, rgba(252,235,203,0) 75%),
  #FBF6F1;
```

## type

- display: **Young Serif** 400, letter-spacing −0.4 to −0.8px, line-height 1.08–1.15. page titles, role titles, big numerals, stamp org names, wordmark ("heartworks", lowercase).
- ui: **Instrument Sans** 400/500/600/700.

| role | mobile | desktop |
|---|---|---|
| hero h1 | 38 | 60 |
| page h1 | 30–36 | 40–52 |
| section h2 (serif) | 20 | 24 |
| card title (serif) | 20–22 | 24–34 |
| row title (sans 600) | 17 | 16–18 |
| body | 16 / 1.5 | 17 / 1.55 |
| meta | 13–14, `muted`, 500 | 14–15 |
| eyebrow label | 13, 600, uppercase, +0.4px, `muted` | same |
| tag | 12–13, 600 | 13 |

## shape, depth, spacing

- radii: pill `999px` (buttons, chips, tags, nav), cards `20px`, feature cards/images `24–28px` (desktop hero `32px`), inputs + fact tiles `14px`, thumbs `14–16px`, tiles `12px`
- card shadow: `0 1px 2px rgba(31,26,23,.04), 0 12px 32px rgba(31,26,23,.06)`
- photo shadow (warm): `0 1px 2px rgba(31,26,23,.06), 0 18px 40px rgba(138,46,26,.14)`
- glass: `backdrop-filter: blur(12px)` on floating pills / mobile tab bar
- mobile page padding `24px`, vertical rhythm `20–22px` between blocks
- desktop: content `max-width 1040px` centered; short tasks (goals, log shift, confirm, accepted) in a `600–720px` centered column/card; top nav `76px`, `48px` side padding

## components

build these once, then compose screens. exact styles are in the reference files named.

- **Button** — primary: ink pill, white text, 52–56px. secondary: `card` fill, `line-strong` border. text button: `accent-ink`, 600. (`Main`, `Going`)
- **Chip (toggle)** — 44px pill. on = ink fill/white text, off = white 0.75/`line` border. `aria-pressed`. (`Onboarding`)
- **FilterChip** — 40px version for the feed. (`Feed`)
- **Tag** — `accent-tint` pill, `accent-ink` text, "Learn · skill". (`Feed`, `Role`)
- **Card** — glass card, 20px radius. (`Role` register card)
- **ProgressBar** — 6px, `accent` fill on 10% ink track, with "n spots left". (`Role`, `Requests`)
- **AvatarStack / InitialsAvatar** — 28px overlapped with 2px white ring; 40–48px initials. (`Role`, `Requests`)
- **InfoTile** — 46–48px bordered square (calendar month/day or icon) + two-line text. (`Role`)
- **RoleRow** — meta / title / learn+spots, 76px thumb right, top divider. (`Feed`)
- **RoleCard** — image-top card for the desktop grid. (`DFeed`)
- **FeatureRoleCard** — top match. stacked on mobile (`Feed`), horizontal 480px image on desktop (`DFeed`)
- **Stepper** — 44–48px round −/+ with serif numeral. (`LogShift`, `PostRole`)
- **Segmented** — 3-up pill switch in a 7% ink track. (`PostRole`)
- **Field** — eyebrow label + 52px input, 14px radius. (`PostRole`)
- **CheckTile** — label-wrapped checkbox tile. (`PostRole`)
- **ActionCard** — org home attention item: badge + title + sub + chevron. (`OrgHome`)
- **ApplicantCard** — avatar, history, wants/brings, accept/decline → state pill with undo. (`Requests`)
- **AttendanceRow** — full-row toggle button with round check. (`OrgConfirm`)
- **Ticket** — accepted-state card with dashed divider. (`Going`)
- **Stamp** — see below. (`Profile`)
- **TabBar** (mobile, floating glass pill: discover / my shifts / community) and **TopNav** (desktop; volunteer + org variants). (`Feed`, `DFeed`, `DOrgHome`)

### stamp

the signature element. generated from data, no per-org illustration needed.

- 154×196px (11×14 and 14×14 multiples of the 14px perforation pitch — keep multiples of 14 if resized)
- perforated edge: `background: radial-gradient(circle, transparent 4px, #FFFDF9 4.5px) -7px -7px / 14px 14px;`
- inner panel inset 7px, solid `#FFFDF9`, padding 7px: image 126×112 with 1.5px `accent` border, org name (serif 13), then `neighborhood · date` (11, muted) and `N HRS` (11, 700, `accent-ink`)
- `filter: drop-shadow(0 8px 14px rgba(31,26,23,.16))`, random-but-stable rotation between −5° and 6° (seed from stamp id)
- mobile: scattered collage (absolute positions in `Profile`). desktop: a row "wall" with a dashed **find your next stamp** slot and faint empty slots (`DProfile`)
- nice-to-have: when a stamp is newly created, animate it in (scale 1.15→1, rotate settle, 400ms). respect `prefers-reduced-motion`.

## responsive rules

- below `lg`: mobile layouts, floating tab bar on discover / shifts / profile, back chevrons in page headers
- `lg`+: top nav replaces tab bar and back chevrons (role page keeps an "all roles" text link)
- role page: single column → two columns (440px sticky left: photo + request card; right: content)
- feed: rows grouped by neighborhood → feature card + 3-up grid, neighborhoods become filter chips
- requests: stacked cards → 3-up grid; post a role: single column → form + live preview card (sticky)
- between 640 and 1024 use the mobile layout in a centered 480px column. don't design a third layout.

## motion

minimal. 150ms ease-out on chip/button state, progress bar width 300ms, the stamp entrance above. nothing else.
