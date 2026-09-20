"use client";

import Link from "next/link";
import TabBar from "@/components/chrome/TabBar";
import Wordmark from "@/components/chrome/Wordmark";
import { SearchIcon } from "@/components/icons";
import FeatureRoleCard from "@/components/roles/FeatureRoleCard";
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
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : "v_gia";
  const volunteer = volunteerById(state, volunteerId);

  const roles = discoverRoles(state, volunteerId);
  const [topMatch, ...rest] = roles;
  const goals = volunteer ? [...volunteer.learnGoals, ...volunteer.brings] : [];
  const hasGoals = goals.length > 0;

  // group the remaining roles by neighborhood, preserving match order
  const groups = new Map<string, typeof rest>();
  for (const role of rest) {
    const list = groups.get(role.neighborhood) ?? [];
    list.push(role);
    groups.set(role.neighborhood, list);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-32 pt-3">
      <div className="flex h-12 items-center justify-between">
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

      <div className="flex flex-col gap-1">
        <h1 className="font-display text-4xl font-normal leading-[1.1] tracking-[-0.5px]">
          Detroit
        </h1>
        {hydrated && (
          <div className="text-[15px] text-muted">
            {hasGoals ? (
              <>Matched to {listPhrase(goals)}</>
            ) : (
              <>
                Roles near you ·{" "}
                <Link href="/onboarding" className="font-semibold">
                  pick your goals
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="-mr-6 flex gap-2 overflow-x-auto pr-6 [scrollbar-width:none]">
        {FILTERS.map((label, i) => (
          <FilterChip
            key={label}
            label={label}
            on={i === 0}
            onClick={i === 0 ? undefined : () => toast("Filters are coming soon")}
          />
        ))}
      </div>

      {hydrated && topMatch && (
        <FeatureRoleCard
          role={topMatch}
          org={orgById(state, topMatch.orgId)}
          tags={matchedLearnTags(topMatch, volunteer)}
          applications={state.applications}
        />
      )}

      {hydrated &&
        [...groups.entries()].map(([neighborhood, list]) => (
          <section key={neighborhood} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between pb-1">
              <h2 className="font-display text-xl font-normal">{neighborhood}</h2>
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

      <TabBar />
    </main>
  );
}
