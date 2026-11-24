import { formatDistanceToNow, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRecentActivity,
  type ActivityItem,
} from "@/hooks/useRecentActivity";

const AVATAR_COLORS = [
  "bg-indigo-400",
  "bg-green-500",
  "bg-red-400",
  "bg-orange-400",
  "bg-sky-500",
  "bg-violet-500",
];

const VERBS: Record<string, Record<string, string>> = {
  task: {
    created: "created task",
    completed: "completed task",
    moved: "moved task",
  },
  project: {
    created: "created project",
    completed: "completed project",
    archived: "archived project",
    restored: "restored project",
  },
  // leave labels are generic on purpose (no dates or types), so there is no highlighted target
  leave: {
    submitted: "submitted a leave request",
    updated: "updated a leave request",
    approved: "approved a leave request",
    rejected: "rejected a leave request",
  },
};

function describe(a: ActivityItem) {
  const verb =
    VERBS[a.subject_type]?.[a.action] ?? `${a.action} ${a.subject_type}`;
  const target = a.subject_type === "leave" ? null : a.subject_label;
  return { verb, target };
}

const actorName = (a: ActivityItem) =>
  a.actor
    ? `${a.actor.first_name} ${a.actor.last_name?.charAt(0) ?? ""}.`
    : "Someone";

const initials = (a: ActivityItem) =>
  a.actor
    ? `${a.actor.first_name.charAt(0)}${a.actor.last_name?.charAt(0) ?? ""}`
    : "?";

export default function RecentActivity() {
  const { data = [], isLoading, isError } = useRecentActivity(10);

  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Recent Activity</h2>

      {isLoading ? (
        <ul className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="py-8 text-center text-sm text-red-500">
          Unable to load recent activity.
        </p>
      ) : data.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No recent activity yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {data.map((a) => {
            const { verb, target } = describe(a);
            return (
              <li key={a.id} className="flex items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white ${
                    AVATAR_COLORS[(a.actor?.id ?? 0) % AVATAR_COLORS.length]
                  }`}
                >
                  {initials(a)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-slate-700">
                    {actorName(a)} {verb}{" "}
                    {target && (
                      <span className="text-orange-500">{target}</span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatDistanceToNow(parseISO(a.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
