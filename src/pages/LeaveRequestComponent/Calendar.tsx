import { cn } from "cn";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, isToday, isWithinInterval, parseISO, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react"

type Leave = {
  id: number;
  leave_type: "vacation" | "sick" | "personal";
  start_date: string; // "YYYY-MM-DD"
  end_date: string;
  user: { first_name: string; last_name: string };
};

const SAMPLE_LEAVES: Leave[] = [
  {
    id: 1,
    leave_type: "vacation",
    start_date: "2026-10-05",
    end_date: "2026-10-07",
    user: { first_name: "James", last_name: "Lee" },
  },
  {
    id: 2,
    leave_type: "sick",
    start_date: "2026-10-06",
    end_date: "2026-10-06",
    user: { first_name: "Ana", last_name: "Reyes" },
  },
  {
    id: 3,
    leave_type: "personal",
    start_date: "2026-10-28",
    end_date: "2026-11-02", // crosses into next month on purpose
    user: { first_name: "Mark", last_name: "Cruz" },
  },
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOT_COLOR: Record<Leave["leave_type"], string> = {
  vacation: "bg-red-500",
  sick: "bg-indigo-400",
  personal: "bg-green-500",
};

export default function Calendar({ leaves = SAMPLE_LEAVES }: { leaves?: Leave[] }) {
    const [month, setMonth] = useState(new Date());


    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(month));
        
        const end = endOfWeek(endOfMonth(month));
        return eachDayOfInterval({ start, end });
    }, [month]);

    const leavesOn = (day: Date) =>
      leaves.filter((leave) =>
        isWithinInterval(day, {
          start: parseISO(leave.start_date),
          end: parseISO(leave.end_date),
        }),
      );


    return (
      <div className="rounded-2xl mt-5 border bg-white p-4">
        <div className="mb-4 calendar-nav flex items-center justify-between">
          <div className=" flex items-center">
            <button
              type="button"
              onClick={() => setMonth(subMonths(month, 1))}
              className="rounded-md p-1 hover:bg-slate-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <h2 className=" text-sm font-semibold">
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
          {/* right side */}
          <div className="flex gap-2">
            <div className="item text-xs capitalize  flex items-center gap-1">
              <span className="inline-block  rounded-full h-3 w-3 bg-red-500"></span>
              vacation
            </div>
            <div className="item text-xs capitalize  flex items-center gap-1">
              <span className="inline-block  rounded-full h-3 w-3 bg-indigo-400"></span>
              sick
            </div>
            <div className="item text-xs capitalize  flex items-center gap-1">
              <span className="inline-block capitalize  rounded-full h-3 w-3 bg-green-500"></span>
              personal
            </div>
          </div>
        </div>

        {/* date indicator */}
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
                  "relative h-24 rounded-xl border border-slate-100 p-2 text-xs text-slate-700 transition-colors hover:bg-slate-50",
                  isToday(day) &&
                    "border-2 border-orange-500 font-semibold text-orange-600",
                  onLeave.length > 0 && "bg-red-100 hover:bg-red-200",
                )}
              >
                {format(day, "d")}

                {onLeave.length > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center -space-x-1">
                    {onLeave.slice(0, 3).map((l) => (
                      <span
                        key={l.id}
                        title={`${l.user.first_name} ${l.user.last_name} (${l.leave_type})`}
                        className={cn(
                          "size-3 rounded-full ring-2 ring-white",
                          DOT_COLOR[l.leave_type],
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