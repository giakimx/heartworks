"use client";

import Link from "next/link";
import { useState } from "react";
import TabBar from "@/components/chrome/TabBar";
import { VolunteerTopNav } from "@/components/chrome/TopNav";
import Wordmark from "@/components/chrome/Wordmark";
import { SearchIcon } from "@/components/icons";
import FeatureRoleCard from "@/components/roles/FeatureRoleCard";
import RoleCard from "@/components/roles/RoleCard";
import RoleRow from "@/components/roles/RoleRow";
import { FilterChip } from "@/components/ui/Chip";
import { listPhrase, spotsLabel } from "@/lib/format";
import { filledCount, matchedLearnTags } from "@/lib/scoring";
import { discoverRoles, orgById, searchRoles, volunteerById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

const FILTERS = ["For you", "This week", "Near me", "Groups", "Remote"];

// browse tile icon fills, cycled (the avatar palette from the design system)
const TILE_COLORS = ["#F2B8A0", "#C9B8E8", "#A9D4B8", "#F3D48A"];

// Within the next 7 days of the viewer's "today" (parsed at local noon so
// bare ISO dates don't shift a day).
function isThisWeek(iso?: string): boolean {
  if (!iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${iso}T12:00:00`);
  const days = (date.getTime() - today.getTime()) / 86_400_000;
  return days >= 0 && days <= 7;
}

const EMPTY_HINTS: Record<string, string> = {
  "This week": "Nothing scheduled in the next seven days.",
  "Near me": "No roles in your neighborhood right now.",
  Groups: "No group-friendly roles open right now.",
  Remote: "Every open role is on-site right now.",
};

export default function DiscoverPage() {
  const hydrated = useHydrated();
  const state = useDemoStore();
  // one active filter at a time; null = the default "For you" feed
  const [filter, setFilter] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : "v_gia";
  const volunteer = volunteerById(state, volunteerId);

  const searching = query.trim().length > 0;
  const results = searchRoles(state, volunteerId, query);

  const roles = discoverRoles(state, volunteerId);
  const [topMatch, ...rest] = roles;
  const goals = volunteer ? [...volunteer.learnGoals, ...volunteer.brings] : [];
  const hasGoals = goals.length > 0;

  // browse tiles: live-role counts per taught skill and per neighborhood
  const skillCounts = state.skills.learn
    .map((skill): [string, number] => [
      skill,
      roles.filter((r) => r.skillsTaught.includes(skill)).length,
    ])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  const neighborhoodCounts = [...new Set(roles.map((r) => r.neighborhood))].map(
    (name): [string, number] => [
      name,
      roles.filter((r) => r.neighborhood === name).length,
    ]
  );

  const filtered = !filter
    ? []
    : roles.filter((role) => {
        if (filter === "This week") return isThisWeek(role.date);
        if (filter === "Near me")
          return !!volunteer?.neighborhood && role.neighborhood === volunteer.neighborhood;
        if (filter === "Groups") return !!role.goodForGroups;
        if (filter === "Remote") return role.workType === "Remote";
        return role.neighborhood === filter; // desktop neighborhood chips
      });

  const subtitle = hasGoals ? (
    <>Matched to {listPhrase(goals)}</>
  ) : (
    <>
      Roles near you ·{" "}
      <Link href="/onboarding" className="font-semibold">
        pick your goals
      </Link>
    </>
  );

  return (
    <>
      <VolunteerTopNav />
      <main className="mx-auto flex w-full max-w-120 flex-col gap-5 px-6 pb-32 pt-3 lg:max-w-260 lg:gap-8 lg:px-0 lg:pb-14 lg:pt-6">
        <div className="flex h-12 items-center justify-between lg:hidden">
          <Link href="/" aria-label="Heartworks home">
            <Wordmark size={20} />
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search roles"
              aria-expanded={searchOpen}
              onClick={() => {
                if (searchOpen) setQuery("");
                setSearchOpen(!searchOpen);
              }}
              className="flex size-11 items-center justify-center text-ink"
            >
              <SearchIcon size={22} />
            </button>
            <Link
              href="/profile"
              aria-label="Your profile"
              className="flex size-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white no-underline"
            >
              {volunteer?.name[0] ?? "G"}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <h1 className="font-display text-4xl font-normal leading-[1.1] tracking-[-0.5px] lg:text-[52px] lg:leading-[1.08] lg:tracking-[-0.8px]">
              Detroit
            </h1>
            {hydrated && <div className="text-[15px] text-muted lg:text-base">{subtitle}</div>}
          </div>
          <form
            className="hidden h-12 w-75 items-center gap-2.5 rounded-full border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 lg:flex"
            onSubmit={(e) => e.preventDefault()}
          >
            <SearchIcon size={18} className="text-muted" />
            <label htmlFor="q" className="sr-only">
              Search roles
            </label>
            <input
              id="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles, orgs, skills"
              className="min-w-0 grow bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
            />
          </form>
        </div>

        {searchOpen && (
          <div className="flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-[rgba(255,255,255,0.8)] px-4 lg:hidden">
            <SearchIcon size={18} className="text-muted" />
            <label htmlFor="q-mobile" className="sr-only">
              Search roles
            </label>
            <input
              id="q-mobile"
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles, orgs, skills"
              className="min-w-0 grow bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
            />
          </div>
        )}

        {hydrated && searching && (
          <section className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between pb-1">
              <h2 className="font-display text-xl font-normal lg:text-2xl">Results</h2>
              <div className="text-[13px] text-muted">
                {results.length} {results.length === 1 ? "role" : "roles"}
              </div>
            </div>
            {results.map((role) => (
              <RoleRow
                key={role.id}
                role={role}
                org={orgById(state, role.orgId)}
                learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                spotsText={spotsLabel(filledCount(role, state.applications), role.spots)}
              />
            ))}
            {results.length === 0 && (
              <div className="flex flex-col gap-1 border-t border-line py-4 text-[15px] text-muted">
                <div>Nothing matches &ldquo;{query.trim()}&rdquo; yet.</div>
                <div className="text-[13px]">
                  Try a skill, an org or a neighborhood — like mural painting,
                  gardening or Corktown.
                </div>
              </div>
            )}
          </section>
        )}

        <div className={`-mr-6 flex gap-2 overflow-x-auto pr-6 [scrollbar-width:none] lg:mr-0 lg:flex-wrap lg:overflow-visible lg:pr-0 ${searching ? "hidden" : ""}`}>
          <FilterChip label="For you" on={!filter} onClick={() => setFilter(null)} />
          {FILTERS.slice(1).map((label) => (
            <FilterChip
              key={label}
              label={label}
              on={filter === label}
              onClick={() => setFilter(filter === label ? null : label)}
            />
          ))}
        </div>

        {/* active filter: one flat list for both layouts */}
        {hydrated && !searching && filter && (
          <section className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between pb-1">
              <h2 className="font-display text-xl font-normal lg:text-2xl">{filter}</h2>
              <div className="text-[13px] text-muted">
                {filtered.length} {filtered.length === 1 ? "role" : "roles"}
              </div>
            </div>
            <div className="flex flex-col gap-1 lg:hidden">
              {filtered.map((role) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  org={orgById(state, role.orgId)}
                  learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                  spotsText={spotsLabel(filledCount(role, state.applications), role.spots)}
                />
              ))}
            </div>
            {filtered.length > 0 && (
              <div className="hidden grid-cols-3 gap-5 pt-2 lg:grid">
                {filtered.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    org={orgById(state, role.orgId)}
                    learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                    applications={state.applications}
                  />
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="flex flex-col gap-1 border-t border-line py-4 text-[15px] text-muted">
                <div>{EMPTY_HINTS[filter] ?? `No roles in ${filter} right now.`}</div>
                <button
                  type="button"
                  onClick={() => setFilter(null)}
                  className="self-start text-[13px] font-semibold text-accent-ink"
                >
                  See all roles
                </button>
              </div>
            )}
          </section>
        )}

        {hydrated && !searching && !filter && topMatch && (
          <FeatureRoleCard
            role={topMatch}
            org={orgById(state, topMatch.orgId)}
            tags={matchedLearnTags(topMatch, volunteer)}
            applications={state.applications}
          />
        )}

        {/* popular events: one compact list, two columns on desktop */}
        {hydrated && !searching && !filter && rest.length > 0 && (
          <section className="flex flex-col gap-1 lg:gap-2">
            <h2 className="pb-1 font-display text-xl font-normal lg:text-2xl">
              Popular events
            </h2>
            <div className="flex flex-col gap-1 lg:grid lg:grid-cols-2 lg:gap-x-12">
              {rest.map((role) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  org={orgById(state, role.orgId)}
                  learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                  spotsText={spotsLabel(filledCount(role, state.applications), role.spots)}
                />
              ))}
            </div>
          </section>
        )}

        {/* browse by skills */}
        {hydrated && !searching && !filter && skillCounts.length > 0 && (
          <section className="flex flex-col gap-3 lg:gap-4">
            <h2 className="font-display text-xl font-normal lg:text-2xl">
              Browse by skills
            </h2>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-4">
              {skillCounts.map(([skill, count], i) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    setQuery(skill);
                    setSearchOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-card border border-line bg-card p-3.5 text-left shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-ink/70"
                    style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}
                  >
                    {skill[0]}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-ink">
                      {skill}
                    </span>
                    <span className="text-[13px] text-muted">
                      {count} {count === 1 ? "event" : "events"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* browse by neighborhood */}
        {hydrated && !searching && !filter && neighborhoodCounts.length > 0 && (
          <section className="flex flex-col gap-3 lg:gap-4">
            <h2 className="font-display text-xl font-normal lg:text-2xl">
              Browse by neighborhood
            </h2>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-4">
              {neighborhoodCounts.map(([name, count], i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFilter(name)}
                  className="flex items-center gap-3 rounded-card border border-line bg-card p-3.5 text-left shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-ink/70"
                    style={{
                      background: TILE_COLORS[(i + 2) % TILE_COLORS.length],
                    }}
                  >
                    {name[0]}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-ink">
                      {name}
                    </span>
                    <span className="text-[13px] text-muted">
                      {count} {count === 1 ? "event" : "events"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        <TabBar />
      </main>
    </>
  );
}
