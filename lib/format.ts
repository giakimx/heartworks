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

// "12:00" -> "12:00 PM"
export function formatTime(hhmm: string | undefined): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function timeRange(start?: string, end?: string): string {
  if (!start) return "";
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

// "Fri, Sep 18" — feed meta lines.
export function metaDate(iso: string | undefined): string {
  return formatDate(iso, { weekday: "short", month: "short", day: "numeric" });
}

function compactHour(hhmm: string): { text: string; pm: boolean } {
  const [h, m] = hhmm.split(":").map(Number);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return { text: m ? `${hour12}:${String(m).padStart(2, "0")}` : `${hour12}`, pm: h >= 12 };
}

// "12 to 3 PM", "9 AM to 1 PM" — the feed's compact range.
export function compactTimeRange(start?: string, end?: string): string {
  if (!start || !end) return "";
  const a = compactHour(start);
  const b = compactHour(end);
  const suffix = (pm: boolean) => (pm ? "PM" : "AM");
  if (a.pm === b.pm) return `${a.text} to ${b.text} ${suffix(b.pm)}`;
  return `${a.text} ${suffix(a.pm)} to ${b.text} ${suffix(b.pm)}`;
}

// "12:00 to 3:00 PM" — the role page's fuller range.
export function fullTimeRange(start?: string, end?: string): string {
  if (!start || !end) return "";
  const fmt = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")}`;
  };
  const pm = Number(end.split(":")[0]) >= 12 ? "PM" : "AM";
  return `${fmt(start)} to ${fmt(end)} ${pm}`;
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
