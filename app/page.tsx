"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/chrome/Wordmark";
import Stamp from "@/components/profile/Stamp";
import { ArrowRightIcon } from "@/components/icons";
import { imageFor } from "@/lib/images";
import { metaDate } from "@/lib/format";
import { matchedLearnTags } from "@/lib/scoring";
import { discoverRoles, orgById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

const ORG_ID = "o_dbg";

export default function LandingPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const state = useDemoStore();
  const setViewer = useDemoStore((s) => s.setViewer);
  const hero = imageFor("hero.jpg")!;

  const postForOrg = () => {
    setViewer({ kind: "org", id: ORG_ID });
    router.push("/org");
  };

  // desktop floating card: the current top match; floating stamp: decorative
  const topMatch = discoverRoles(state, "v_gia")[0];
  const topMatchImage = topMatch ? imageFor(topMatch.image) : undefined;
  const decorativeStamp = state.stamps[state.stamps.length - 1];

  return (
    <>
      {/* desktop nav */}
      <nav
        aria-label="Main"
        className="hidden h-19 items-center justify-between px-12 lg:flex"
      >
        <Wordmark size={22} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={postForOrg}
            className="px-3.5 py-3 text-[15px] font-semibold text-muted"
          >
            For organizations
          </button>
          <Link
            href="/discover"
            className="flex h-11 items-center rounded-full border border-[rgba(31,26,23,0.12)] bg-card-soft px-6 text-[15px] font-semibold text-ink no-underline"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* mobile */}
      <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-6 px-6 pb-7 pt-6 lg:hidden">
        <div className="flex h-8 items-center justify-center">
          <Wordmark size={22} />
        </div>

        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          className="h-[296px] w-full rounded-hero object-cover shadow-photo"
        />

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[38px] font-normal leading-[1.1] tracking-[-0.6px]">
            Find where your heart is needed in Detroit.
          </h1>
          <p className="text-base leading-normal text-muted">
            Volunteer roles matched to what you want to learn and what your
            neighborhood needs done.
          </p>
        </div>

        <div className="grow" />

        <div className="flex flex-col gap-2.5">
          <Link
            href="/onboarding"
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white no-underline"
          >
            Get started
            <ArrowRightIcon size={18} strokeWidth={2.2} />
          </Link>
          <button
            type="button"
            onClick={postForOrg}
            className="flex h-13 items-center justify-center rounded-full border border-[rgba(31,26,23,0.10)] bg-white/70 text-[15px] font-semibold text-ink"
          >
            I&apos;m posting for an organization
          </button>
          <div className="pt-1.5 text-center text-sm text-muted">
            Already a member?{" "}
            <Link href="/discover" className="font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* desktop split hero */}
      <main className="mx-auto hidden w-full max-w-280 grid-cols-2 items-center gap-16 pb-14 pt-10 lg:grid">
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-[60px] font-normal leading-[1.08] tracking-[-0.8px]">
            Find where your heart is needed in Detroit.
          </h1>
          <p className="max-w-[460px] text-[19px] leading-normal text-muted">
            Volunteer roles matched to what you want to learn and what your
            neighborhood needs done.
          </p>
          <div className="flex gap-3 pt-1">
            <Link
              href="/onboarding"
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-white no-underline"
            >
              Get started
              <ArrowRightIcon size={18} strokeWidth={2.2} />
            </Link>
            <button
              type="button"
              onClick={postForOrg}
              className="flex h-14 items-center justify-center rounded-full border border-[rgba(31,26,23,0.12)] bg-card-soft px-6 text-[15px] font-semibold text-ink"
            >
              I&apos;m posting for an organization
            </button>
          </div>
        </div>

        <div className="relative h-[520px]">
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            priority
            className="absolute right-0 top-6 h-[420px] w-[480px] rotate-[1.5deg] rounded-[22px] object-cover shadow-[0_1px_2px_rgba(31,26,23,0.06),0_24px_56px_rgba(138,46,26,0.18)]"
          />
          {hydrated && topMatch && topMatchImage && (
            <Link
              href={`/roles/${topMatch.id}` as never}
              className="absolute bottom-5 left-0 flex w-75 items-center gap-3 rounded-card border border-line bg-white/92 p-3 text-ink no-underline shadow-[0_16px_40px_rgba(31,26,23,0.14)] backdrop-blur-[12px]"
            >
              <Image
                src={topMatchImage.src}
                alt={topMatchImage.alt}
                width={128}
                height={128}
                className="size-16 shrink-0 rounded-input object-cover"
              />
              <div className="flex flex-col gap-[3px]">
                <div className="text-xs font-medium text-muted">
                  {metaDate(topMatch.date)} · {topMatch.neighborhood}
                </div>
                <div className="text-[15px] font-semibold">{topMatch.title}</div>
                <div className="text-xs font-semibold text-accent-ink">
                  Learn · {matchedLearnTags(topMatch, undefined, 1)[0]}
                </div>
              </div>
            </Link>
          )}
          {hydrated && decorativeStamp && (
            <div className="absolute -right-2 -top-1">
              <Stamp
                stamp={decorativeStamp}
                orgName={orgById(state, decorativeStamp.orgId)?.name ?? ""}
                rotation={8}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
