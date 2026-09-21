import Link from "next/link";
import Wordmark from "@/components/chrome/Wordmark";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-6 px-6 pb-7 pt-6">
      <div className="flex h-8 items-center justify-center">
        <Link href="/discover" aria-label="Heartworks feed">
          <Wordmark size={22} />
        </Link>
      </div>
      <div className="grow" />
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-[34px] font-normal leading-[1.1] tracking-[-0.5px]">
          This page wandered off.
        </h1>
        <p className="text-base leading-normal text-muted">
          The role you&apos;re looking for may have been filled or unpublished.
        </p>
      </div>
      <Link
        href="/discover"
        className="flex h-14 items-center justify-center rounded-full bg-ink text-base font-semibold text-white no-underline"
      >
        See open roles
      </Link>
      <div className="grow" />
    </main>
  );
}
