"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/chrome/Wordmark";
import { ArrowRightIcon } from "@/components/icons";
import { imageFor } from "@/lib/images";
import { useDemoStore } from "@/lib/store";

const ORG_ID = "o_dbg";

export default function LandingPage() {
  const router = useRouter();
  const setViewer = useDemoStore((s) => s.setViewer);
  const hero = imageFor("hero.jpg")!;

  const postForOrg = () => {
    setViewer({ kind: "org", id: ORG_ID });
    router.push("/org");
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-6 px-6 pb-7 pt-6">
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
  );
}
