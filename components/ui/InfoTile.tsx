import type { ReactNode } from "react";

// 46px bordered square (calendar month/day or icon) + two-line text (Role, Ticket).

export function DateTile({ month, day }: { month: string; day: string }) {
  return (
    <div className="flex size-[46px] shrink-0 flex-col overflow-hidden rounded-tile border border-[rgba(31,26,23,0.12)] bg-card-soft text-center">
      <div className="bg-ink/7 text-[9px] font-bold uppercase leading-4 tracking-[0.6px] text-muted">
        {month}
      </div>
      <div className="text-[17px] font-semibold leading-7">{day}</div>
    </div>
  );
}

export function IconTile({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-[46px] shrink-0 items-center justify-center rounded-tile border border-[rgba(31,26,23,0.12)] bg-card-soft text-muted">
      {children}
    </div>
  );
}

export default function InfoTile({
  tile,
  title,
  sub,
}: {
  tile: ReactNode;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      {tile}
      <div className="flex flex-col gap-0.5">
        <div className="text-[13px] font-semibold">{title}</div>
        {sub && <div className="text-[11px] text-muted">{sub}</div>}
      </div>
    </div>
  );
}
