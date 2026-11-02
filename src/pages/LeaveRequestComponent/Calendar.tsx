import { cn } from "cn";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "@/components/ui/toast";

type LeaveType = { id: number; name: string };

type Leave = {
  id: number;
  leave_type: LeaveType | null;
  start_date: string;
  end_date: string;
  user: { first_name: string; last_name: string } | null;
};

// Tailwind needs full class names written out, so don't build them dynamically
const PALETTE = [
  "bg-red-500",
  "bg-indigo-400",
  "bg-green-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-purple-500",
];
const FALLBACK_COLOR = "bg-slate-400";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const colorFor = (typeId?: number) =>
  typeId == null ? FALLBACK_COLOR : PALETTE[(typeId - 1) % PALETTE.length];

export default function Calendar() {
  const [month, setMonth] = useState(new Date());
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // leave types: fetched once
  useEffect(() => {
    api
      .get<LeaveType[]>("/leave-types")
      .then((res) => setLeaveTypes(res.data))
      .catch(() =>
        toast.add({
          type: "error",
          description: "Failed to load leave types.",
        }),
      );
  }, []);

  // leaves: fetched every time the visible month changes
  const fetchLeaves = useCallback(async (m: Date) => {
    try {
      const res = await api.get<Leave[]>("/leave-calendar", {
        params: {
          start: format(startOfMonth(m), "yyyy-MM-dd"),
          end: format(endOfMonth(m), "yyyy-MM-dd"),
        },
      });
      setLeaves(res.data);
    } catch {
      toast.add({ type: "error", description: "Failed to load leaves." });
    }
  }, []);

  useEffect(() => {
    fetchLeaves(month);
  }, [month, fetchLeaves]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const leavesOn = (day: Date) =>
    leaves.filter((leave) =>
      isWithinInterval(day, {
        start: parseISO(leave.start_date.slice(0, 10)),
        end: parseISO(leave.end_date.slice(0, 10)),
      }),
    );

  return (
    <div className="rounded-2xl mt-5 border bg-white p-4">
      <div className="mb-4 calendar-nav flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <h2 className="text-sm font-semibold">
            {format(month, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* legend built from the real leave types */}
        <div className="flex flex-wrap gap-2">
          {leaveTypes.map((type) => (
            <div
              key={type.id}
              className="item text-xs capitalize flex items-center gap-1"
            >
              <span
                className={cn(
                  "inline-block rounded-full h-3 w-3",
                  colorFor(type.id),
                )}
              />
              {type.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-slate-500 mb-3">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          if (!isSameMonth(day, month)) {
            return <div key={day.toISOString()} />;
          }

          const onLeave = leavesOn(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "relative h-24 rounded-xl border border-slate-200 p-2 text-xs text-slate-700 transition-colors hover:bg-slate-50",
                isToday(day) &&
                  "border-2 border-orange-500 font-semibold text-orange-600",
                onLeave.length > 0 && "bg-slate-100 hover:bg-slate-200",
              )}
            >
              {format(day, "d")}

              {onLeave.length > 0 && (
                <div className="absolute bottom-2 right-2 flex items-center -space-x-1">
                  {onLeave.slice(0, 3).map((l) => (
                    <span
                      key={l.id}
                      title={`${l.user?.first_name ?? ""} ${l.user?.last_name ?? ""} (${l.leave_type?.name ?? "Leave"})`}
                      className={cn(
                        "size-3 rounded-full ring-2 ring-white",
                        colorFor(l.leave_type?.id),
                      )}
                    />
                  ))}
                  {onLeave.length > 3 && (
                    <span className="pl-2 text-[10px] text-slate-500">
                      +{onLeave.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
