// seed.json references logical image keys (from the design placeholders).
// This is the single place that maps them to the real photos in /public/images,
// so photos stay swappable without touching seed data.

export type ImageEntry = { src: string; width: number; height: number; alt: string };

const IMAGES: Record<string, ImageEntry> = {
  "mural.jpg": {
    src: "/images/mural.png",
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
    src: "/images/hero.png",
    width: 1206,
    height: 1416,
    alt: "A group of Detroit neighbors cheering together",
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
