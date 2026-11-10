import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { format, parseISO, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type Status = Task["status"];

// Tailwind needs full class names written out
const COLUMNS: {
  key: Status;
  label: string;
  dot: string;
  text: string;
  badge: string;
}[] = [
  {
    key: "todo",
    label: "Todo",
    dot: "bg-slate-500",
    text: "text-slate-500",
    badge: "bg-slate-300 text-slate-700",
  },
  {
    key: "in_progress",
    label: "In Progress",
    dot: "bg-orange-500",
    text: "text-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    key: "review",
    label: "Review",
    dot: "bg-blue-700",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    key: "done",
    label: "Done",
    dot: "bg-green-700",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
  },
];

const PRIORITY_STYLE: Record<Task["priority"], string> = {
  high: "bg-orange-100 text-orange-500",
  medium: "bg-blue-100 text-blue-500",
  low: "bg-slate-100 text-slate-500",
};

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-sky-500",
];

/* ---------- the card's look (used by the real card and the drag overlay) ---------- */

function CardContent({ task }: { task: Task }) {
  const isDone = task.status === "done";
  const dueDate = parseISO(task.due_date.slice(0, 10));
  const overdue = !isDone && dueDate < startOfToday();
  const a = task.assignee;

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className={cn("text-sm", isDone && "text-slate-400 line-through")}>
          {task.title}
        </p>
        <span
          className={cn(
            "rounded px-2 py-1 text-xs capitalize",
            PRIORITY_STYLE[task.priority],
          )}
        >
          {task.priority}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          title={a ? `${a.first_name} ${a.last_name}` : "Unassigned"}
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-white",
            AVATAR_COLORS[task.assigned_to % AVATAR_COLORS.length],
          )}
        >
          {a ? `${a.first_name.charAt(0)}${a.last_name.charAt(0)}` : "?"}
        </div>
        <p
          className={cn("text-sm", overdue ? "text-red-500" : "text-slate-400")}
        >
          {overdue ? "Overdue" : format(dueDate, "MMM d")}
        </p>
      </div>
    </>
  );
}

/* ---------- a card you can pick up ---------- */

function DraggableCard({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task)}
      className={cn(
        "mb-3 w-full cursor-grab touch-none rounded-md bg-white p-2 shadow-sm transition hover:shadow-md",
        isDragging && "opacity-40", // the original stays as a faded placeholder
      )}
    >
      <CardContent task={task} />
    </div>
  );
}

/* ---------- a column you can drop into ---------- */

function DroppableColumn({
  id,
  children,
}: {
  id: Status;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "tasks min-h-100 rounded-md p-3 transition-colors",
        isOver ? "bg-orange-50 ring-2 ring-orange-200" : "bg-white",
      )}
    >
      {children}
    </div>
  );
}

/* ---------- the board ---------- */

interface KanbanBoardProps {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onMove: (taskId: number, newStatus: Status) => void;
}

export default function KanbanBoard({
  tasks,
  onOpen,
  onMove,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  // the card must move 8px before a drag starts, so a normal click still opens the sheet
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(e: DragStartEvent) {
    setActiveId(Number(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over) return; // dropped outside any column

    const task = tasks.find((t) => t.id === Number(e.active.id));
    const newStatus = e.over.id as Status;
    if (!task || task.status === newStatus) return; // same column, nothing to do

    onMove(task.id, newStatus);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="mb-2 grid grid-cols-1 gap-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);

          return (
            <section key={col.key}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn("inline-block h-3 w-3 rounded-full", col.dot)}
                  />
                  <h3 className={cn("pt-px text-xs leading-none", col.text)}>
                    {col.label}
                  </h3>
                </div>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full pt-px text-xs leading-none",
                    col.badge,
                  )}
                >
                  {columnTasks.length}
                </span>
              </div>

              <DroppableColumn id={col.key}>
                {columnTasks.map((task) => (
                  <DraggableCard key={task.id} task={task} onOpen={onOpen} />
                ))}
              </DroppableColumn>
            </section>
          );
        })}
      </div>

      {/* the card that follows the cursor, rendered above everything so nothing clips it */}
      <DragOverlay>
        {activeTask ? (
          <div className="w-full cursor-grabbing rounded-md bg-white p-2 shadow-xl ring-1 ring-orange-200">
            <CardContent task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
