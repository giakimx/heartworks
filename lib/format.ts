// Date/label formatting. Seed dates are bare ISO strings ("2026-09-18");
// they must format in UTC or Detroit renders them a day early.

const UTC = { timeZone: "UTC" } as const;

export function formatDate(
  iso: string | undefined,
  opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" }
): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", { ...opts, ...UTC }).format(new Date(iso));
}

export function shortDate(iso: string | undefined): string {
  return formatDate(iso, { month: "short", day: "numeric" });
}

export function weekday(iso: string | undefined): string {
  return formatDate(iso, { weekday: "long" });
}

export function monthAbbrev(iso: string | undefined): string {
  return formatDate(iso, { month: "short" });
}

export function dayOfMonth(iso: string | undefined): string {
  return formatDate(iso, { day: "numeric" });
}

// "Fri, Sep 18" — feed meta lines.
export function metaDate(iso: string | undefined): string {
  return formatDate(iso, { weekday: "short", month: "short", day: "numeric" });
}

// 24-hour "12:00 - 15:00", used everywhere a time range appears.
export function timeRange(start?: string, end?: string): string {
  if (!start) return "";
  return end ? `${start} - ${end}` : start;
}

// "12:00 - 15:00 (3 hours)" — the role page's date tile.
export function timeRangeWithHours(
  start?: string,
  end?: string,
  hours?: number
): string {
  const range = timeRange(start, end);
  if (!range) return "";
  return hours ? `${range} (${hours} ${hours === 1 ? "hour" : "hours"})` : range;
}

export function spotsLabel(spotsLeft: number): string {
  if (spotsLeft <= 0) return "Full · join waitlist";
  if (spotsLeft === 1) return "1 spot left";
  return `${spotsLeft} spots left`;
}

export function firstName(name: string): string {
  return name.split(" ")[0];
}

// "a, b and c" (max 3), for the feed subtitle.
export function listPhrase(items: string[], max = 3): string {
  const xs = items.slice(0, max).map((s) => s.toLowerCase());
  if (xs.length === 0) return "";
  if (xs.length === 1) return xs[0];
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}
