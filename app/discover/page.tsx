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
import { toast } from "@/components/ui/Toast";
import { listPhrase, spotsLabel } from "@/lib/format";
import { filledCount, matchedLearnTags } from "@/lib/scoring";
import { discoverRoles, orgById, volunteerById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

const FILTERS = ["For you", "This week", "Near me", "Groups", "Remote"];

export default function DiscoverPage() {
  const hydrated = useHydrated();
  const state = useDemoStore();
  const [neighborhood, setNeighborhood] = useState<string | null>(null);
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : "v_gia";
  const volunteer = volunteerById(state, volunteerId);

  const roles = discoverRoles(state, volunteerId);
  const [topMatch, ...rest] = roles;
  const goals = volunteer ? [...volunteer.learnGoals, ...volunteer.brings] : [];
  const hasGoals = goals.length > 0;
  const neighborhoods = [...new Set(roles.map((r) => r.neighborhood))];

  // group the remaining roles by neighborhood, preserving match order (mobile)
  const groups = new Map<string, typeof rest>();
  for (const role of rest) {
    const list = groups.get(role.neighborhood) ?? [];
    list.push(role);
    groups.set(role.neighborhood, list);
  }

  const gridRoles = neighborhood
    ? rest.filter((r) => r.neighborhood === neighborhood)
    : rest;

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
          <Wordmark size={20} />
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search roles"
              onClick={() => toast("Search is coming soon")}
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
            onSubmit={(e) => {
              e.preventDefault();
              toast("Search is coming soon");
            }}
          >
            <SearchIcon size={18} className="text-muted" />
            <label htmlFor="q" className="sr-only">
              Search roles
            </label>
            <input
              id="q"
              type="search"
              placeholder="Search roles, orgs, skills"
              className="min-w-0 grow bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
            />
          </form>
        </div>

        <div className="-mr-6 flex gap-2 overflow-x-auto pr-6 [scrollbar-width:none] lg:mr-0 lg:flex-wrap lg:overflow-visible lg:pr-0">
          {FILTERS.map((label, i) => (
            <FilterChip
              key={label}
              label={label}
              on={i === 0 && !neighborhood}
              onClick={
                i === 0
                  ? () => setNeighborhood(null)
                  : () => toast("Filters are coming soon")
              }
            />
          ))}
          <div className="hidden gap-2 lg:flex">
            {neighborhoods.map((n) => (
              <FilterChip
                key={n}
                label={n}
                on={neighborhood === n}
                onClick={() => setNeighborhood(neighborhood === n ? null : n)}
              />
            ))}
          </div>
        </div>

        {hydrated && topMatch && (
          <FeatureRoleCard
            role={topMatch}
            org={orgById(state, topMatch.orgId)}
            tags={matchedLearnTags(topMatch, volunteer)}
            applications={state.applications}
          />
        )}

        {/* mobile: rows grouped by neighborhood */}
        {hydrated &&
          [...groups.entries()].map(([name, list]) => (
            <section key={name} className="flex flex-col gap-1 lg:hidden">
              <div className="flex items-baseline justify-between pb-1">
                <h2 className="font-display text-xl font-normal">{name}</h2>
                <button
                  type="button"
                  onClick={() => toast("Coming soon")}
                  className="text-sm font-semibold text-accent-ink"
                >
                  See all
                </button>
              </div>
              {list.map((role) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  org={orgById(state, role.orgId)}
                  learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                  spotsText={spotsLabel(role.spots - filledCount(role, state.applications))}
                />
              ))}
            </section>
          ))}

        {/* desktop: 3-up grid */}
        {hydrated && gridRoles.length > 0 && (
          <section className="hidden flex-col gap-4 lg:flex">
            <h2 className="font-display text-2xl font-normal">
              {neighborhood ?? "More near you"}
            </h2>
            <div className="grid grid-cols-3 gap-5">
              {gridRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  org={orgById(state, role.orgId)}
                  learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                  applications={state.applications}
                />
              ))}
            </div>
          </section>
        )}

        <TabBar />
      </main>
    </>
  );
}
