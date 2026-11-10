// src/components/reports/StatusBar.tsx
import { cn } from "@/lib/utils";

interface Segment {
  key: string;
  label: string;
  value: number;
  color: string; // a full Tailwind class, written out
}

const SEGMENTS: Omit<Segment, "value">[] = [
  { key: "todo", label: "Todo", color: "bg-stone-300" },
  { key: "in_progress", label: "In Progress", color: "bg-orange-600" },
  { key: "review", label: "Review", color: "bg-blue-300" },
  { key: "done", label: "Done", color: "bg-blue-700" },
];

interface StatusBarProps {
  counts: Record<string, number>; // { todo: 12, in_progress: 11, review: 7, done: 9 }
}

export default function StatusBar({ counts }: StatusBarProps) {
  const segments = SEGMENTS.map((s) => ({ ...s, value: counts[s.key] ?? 0 }));
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div>
      {/* the bar */}
      <div
        role="img"
        aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}
        className="flex h-3.5 w-full gap-0.5 overflow-hidden rounded-full bg-stone-100"
      >
        {total > 0 &&
          segments
            .filter((s) => s.value > 0)
            .map((s) => (
              <div
                key={s.key}
                title={`${s.label}: ${s.value}`}
                className={cn("h-full transition-all", s.color)}
                style={{ width: `${(s.value / total) * 100}%` }}
              />
            ))}
      </div>

      {/* the legend */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li
            key={s.key}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <span className={cn("size-3 rounded-[3px]", s.color)} />
            {s.label} {s.value}
          </li>
        ))}
      </ul>

      {total === 0 && (
        <p className="mt-3 text-sm text-slate-500">No tasks in this period.</p>
      )}
    </div>
  );
}
