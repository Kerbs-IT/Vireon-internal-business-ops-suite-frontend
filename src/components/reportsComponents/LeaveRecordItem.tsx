import type { LeaveStatus,TeamLeaveRequestType } from "@/types/leave";

interface LeaveRecordItemProps {
  record: TeamLeaveRequestType;
  showStatus?: boolean; // show a status badge (pending / approved / ...)
  className?: string;
}

const statusStyles: Record<LeaveStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

// Parse in UTC so "2026-11-10T00:00:00Z" never shifts to the previous day
// for viewers in a negative-offset timezone.
const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" }).format(d);

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);

  if (s.getTime() === e.getTime()) {
    return fmt(s, { month: "short", day: "numeric" }); // Oct 14
  }
  if (
    s.getUTCMonth() === e.getUTCMonth() &&
    s.getUTCFullYear() === e.getUTCFullYear()
  ) {
    return `${fmt(s, { month: "short", day: "numeric" })}–${fmt(e, { day: "numeric" })}`; // Oct 13–17
  }
  return `${fmt(s, { month: "short", day: "numeric" })} – ${fmt(e, { month: "short", day: "numeric" })}`; // Oct 30 – Nov 2
}

export default function LeaveRecordItem({
  record,
  showStatus = false,
  className = "",
}: LeaveRecordItemProps) {
  const { user, leave_type, start_date, end_date, status } = record;

  const initials =
    `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();
  const displayName = `${user.first_name} ${user.last_name[0] ?? ""}.`;
  const typeLabel = leave_type.name.replace(/\s+leave$/i, ""); // "Vacation Leave" -> "Vacation"

  return (
    <li className={`flex items-center gap-4 ${className}`}>
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600"
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {displayName}
        </p>
        <p className="truncate text-sm text-slate-500">
          {typeLabel} · {formatDateRange(start_date, end_date)}
        </p>
      </div>

      {showStatus && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
        >
          {status}
        </span>
      )}
    </li>
  );
}
