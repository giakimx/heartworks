// seed.json references logical image keys (from the design placeholders).
// This is the single place that maps them to the real photos in /public/images,
// so photos stay swappable without touching seed data.

export type ImageEntry = { src: string; width: number; height: number; alt: string };

const IMAGES: Record<string, ImageEntry> = {
  "mural.jpg": {
    src: "/images/mural.jpg",
    width: 1496,
    height: 1184,
    alt: "Volunteers painting the Detroit Body Garage building",
  },
  "park.jpg": {
    src: "/images/park.png",
    width: 616,
    height: 684,
    alt: "Volunteers cleaning up a neighborhood park",
  },
  "cat.jpg": {
    src: "/images/cat.png",
    width: 864,
    height: 684,
    alt: "A cat waiting to be adopted",
  },
  "garden.jpg": {
    src: "/images/garden.png",
    width: 616,
    height: 684,
    alt: "Wildflowers in a community garden",
  },
  "hero.jpg": {
    src: "/images/hero.jpg",
    width: 1206,
    height: 1416,
    alt: "A group of Detroit neighbors cheering together",
  },
  // Event photos via Openverse (CC / public domain) — see public/images/CREDITS.md
  "evt-boardup.jpg": {
    src: "/images/evt-boardup.jpg",
    width: 1600,
    height: 1067,
    alt: "Cleanup volunteers handing out supplies",
  },
  "evt-tutor.jpg": {
    src: "/images/evt-tutor.jpg",
    width: 1600,
    height: 1043,
    alt: "A volunteer reading with a classroom of kids",
  },
  "evt-baskets.jpg": {
    src: "/images/evt-baskets.jpg",
    width: 1600,
    height: 1200,
    alt: "Volunteers loading donation boxes",
  },
  "evt-harvest.jpg": {
    src: "/images/evt-harvest.jpg",
    width: 1600,
    height: 1200,
    alt: "Rows of crops at an urban farm",
  },
  "evt-stem.jpg": {
    src: "/images/evt-stem.jpg",
    width: 1204,
    height: 1600,
    alt: "A student-built robot on a workbench",
  },
  "evt-greet.jpg": {
    src: "/images/evt-greet.jpg",
    width: 1600,
    height: 1200,
    alt: "The view across the water from the Detroit Riverwalk",
  },
  "evt-plant.jpg": {
    src: "/images/evt-plant.jpg",
    width: 1600,
    height: 933,
    alt: "Volunteers planting a new garden bed",
  },
  "evt-market.jpg": {
    src: "/images/evt-market.jpg",
    width: 1067,
    height: 1600,
    alt: "Fresh produce stacked at a market stall",
  },
  "evt-trail.jpg": {
    src: "/images/evt-trail.jpg",
    width: 1600,
    height: 1068,
    alt: "Volunteers clearing a fallen log from a trail",
  },
  "evt-build.jpg": {
    src: "/images/evt-build.jpg",
    width: 1600,
    height: 1200,
    alt: "Two smiling volunteers with paint cans at a build site",
  },
};

export function imageFor(key: string | undefined): ImageEntry | undefined {
  return key ? IMAGES[key] : undefined;
}

// Org icons for the avatar circles; orgs without one fall back to the
// colored initials circle.
const ORG_ICONS: Record<string, string> = {
  o_dbg: "/images/org-dbg.png",
};

export function orgIconFor(orgId: string | undefined): string | undefined {
  return orgId ? ORG_ICONS[orgId] : undefined;
}

// Photo carousels for org profile pages.
const ORG_PHOTOS: Record<string, ImageEntry[]> = {
  o_dbg: [
    {
      src: "/images/org-dbg-1.jpg",
      width: 1302,
      height: 1046,
      alt: "Inside the Detroit Body Garage gym",
    },
    {
      src: "/images/org-dbg-2.jpg",
      width: 1600,
      height: 1095,
      alt: "Detroit Body Garage members training together",
    },
    {
      src: "/images/org-dbg-3.jpg",
      width: 1072,
      height: 836,
      alt: "The Detroit Body Garage community",
    },
  ],
};

export function orgPhotosFor(orgId: string | undefined): ImageEntry[] {
  return (orgId && ORG_PHOTOS[orgId]) || [];
}
