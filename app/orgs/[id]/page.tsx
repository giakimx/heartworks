"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { VolunteerTopNav } from "@/components/chrome/TopNav";
import { BackIcon, ExportIcon, GlobeIcon } from "@/components/icons";
import { toast } from "@/components/ui/Toast";
import RoleRow from "@/components/roles/RoleRow";
import { OrgAvatar } from "@/components/ui/Avatar";
import { spotsLabel } from "@/lib/format";
import { orgPhotosFor, type ImageEntry } from "@/lib/images";
import { filledCount, matchedLearnTags } from "@/lib/scoring";
import { orgById, volunteerById } from "@/lib/selectors";
import { useDemoStore, useHydrated } from "@/lib/store";

function PhotoCarousel({ photos }: { photos: ImageEntry[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (photos.length === 0) return null;
  return (
    <div className="relative">
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-feature shadow-photo [scrollbar-width:none]"
        aria-label="Photos"
      >
        {photos.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority={i === 0}
            className="h-[250px] w-full shrink-0 snap-center object-cover lg:h-[340px]"
          />
        ))}
      </div>
      <div
        className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5"
        aria-hidden="true"
      >
        {photos.map((_, i) => (
          <div
            key={i}
            className={`size-1.5 rounded-full transition-colors duration-150 ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function OrgProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const state = useDemoStore();

  const org = orgById(state, id);
  if (!org) return null;

  const photos = orgPhotosFor(org.id);
  const openRoles = state.roles.filter(
    (r) => r.orgId === org.id && r.status === "live"
  );
  const volunteerId = state.viewer.kind === "volunteer" ? state.viewer.id : "v_gia";
  const volunteer = volunteerById(state, volunteerId);

  return (
    <>
      <VolunteerTopNav />
      <main className="mx-auto flex min-h-dvh w-full max-w-120 flex-col gap-5 px-6 pb-8 pt-3 lg:min-h-0 lg:max-w-170 lg:pb-14 lg:pt-6">
        <div className="flex h-11 items-center justify-between">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="-ml-2.5 flex size-11 items-center justify-center text-ink lg:invisible"
          >
            <BackIcon size={24} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Share this organization"
            onClick={() => toast("Org sharing is coming soon")}
            className="-mr-2.5 flex size-11 items-center justify-center text-ink"
          >
            <ExportIcon size={22} />
          </button>
        </div>

        {hydrated && (
          <>
            <PhotoCarousel photos={photos} />

            <div className="flex items-center gap-3.5">
              <OrgAvatar org={org} size={48} />
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-[26px] font-normal leading-[1.1] tracking-[-0.4px] lg:text-[34px]">
                  {org.name}
                </h1>
                <div className="text-[13px] text-muted">
                  {org.neighborhood} neighborhood
                </div>
              </div>
            </div>

            {org.blurb && (
              <p className="text-[15px] leading-normal text-ink">{org.blurb}</p>
            )}

            {org.website && (
              <a
                href={`https://${org.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 self-start text-[15px] font-semibold no-underline"
              >
                <GlobeIcon size={16} />
                {org.website} ↗
              </a>
            )}

            <section className="flex flex-col gap-2 pt-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.4px] text-muted opacity-80">
                Open roles
              </h2>
              {/* no section divider here: the first role row draws its own */}
              {openRoles.map((role) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  learnTag={matchedLearnTags(role, volunteer, 1)[0]}
                  spotsText={spotsLabel(
                    filledCount(role, state.applications),
                    role.spots
                  )}
                />
              ))}
              {openRoles.length === 0 && (
                <div className="py-3 text-sm text-muted">
                  Nothing open right now. Check back soon.
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
