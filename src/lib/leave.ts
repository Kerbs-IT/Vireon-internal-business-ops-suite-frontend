import { format, parseISO } from "date-fns";

export type LeaveStatus = "pending" | "approved" | "rejected";

export const statusStyles: Record<LeaveStatus, string> = {
  pending: "bg-yellow-100 text-yellow-900 border-yellow-200",
  approved: "bg-green-100 text-green-900 border-green-200",
  rejected: "bg-red-100 text-red-900 border-red-200",
};

const parseDate = (date: string) => new Date(`${date.slice(0, 10)}T00:00:00`);

export const formatDate = (date: string) =>
  parseDate(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const countDays = (start: string, end: string) =>
  Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / 86400000) + 1;

// "Mar 25 - 28, 2026" / "Mar 25 - Apr 2, 2026" / "Mar 25, 2026"
export function formatRange(start: string, end: string) {
  const s = parseISO(start.slice(0, 10));
  const e = parseISO(end.slice(0, 10));
  if (start.slice(0, 10) === end.slice(0, 10)) return format(s, "MMM d, yyyy");
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${format(s, "MMM d")} - ${format(e, "d, yyyy")}`;
  }
  return `${format(s, "MMM d")} - ${format(e, "MMM d, yyyy")}`;
}