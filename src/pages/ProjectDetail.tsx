import ProjectTaskFormDialog from "@/components/DialogForm/ProjectTaskFormDialog";
import { Button } from "@/components/ui/button";
import { Progress, ProgressValue } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { tasks as initialTasks, type Task } from "../components/sampleTask";
import TaskDetailSheet from "../components/sheet/TaskDetailSheet";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
};

const members: Member[] = [
  { id: 1, first_name: "Ana", last_name: "Reyes" },
  { id: 2, first_name: "Mark", last_name: "Cruz" },
  { id: 3, first_name: "James", last_name: "Lee" },
  { id: 4, first_name: "Sofia", last_name: "Santos" },
  { id: 5, first_name: "Carlo", last_name: "Dizon" },
];

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-sky-500",
];

// Tailwind needs full class names written out, so don't build them dynamically
const COLUMNS: {
  key: Task["status"];
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

// stand-in for the logged-in user until you use your AuthContext
const CURRENT_USER = {
  id: 1,
  first_name: "Ana",
  last_name: "Reyes",
  position: "Product Designer",
};

function TaskCard({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (task: Task) => void;
}) {
  const isDone = task.status === "done";
  const dueDate = parseISO(task.due_date.slice(0, 10));
  const overdue = !isDone && dueDate < startOfToday();
  const assignee = task.assignee;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(task)}
      className="mb-3 w-full cursor-pointer rounded-md bg-white p-2 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className={`text-sm ${isDone ? "line-through text-slate-400" : ""}`}>
          {task.title}
        </p>
        <span
          className={`rounded px-2 py-1 text-xs capitalize ${PRIORITY_STYLE[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          title={
            assignee
              ? `${assignee.first_name} ${assignee.last_name}`
              : "Unassigned"
          }
          className={`flex size-6 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-white ${
            AVATAR_COLORS[task.assigned_to % AVATAR_COLORS.length]
          }`}
        >
          {assignee
            ? `${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}`
            : "?"}
        </div>
        <p className={`text-sm ${overdue ? "text-red-500" : "text-slate-300"}`}>
          {overdue ? "Overdue" : format(dueDate, "MMM d")}
        </p>
      </div>
    </div>
  );
}

function ProjectDetail() {
  const MAX = 3;
  const visible = members.slice(0, MAX);
  const extra = members.length - MAX;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

  // always read the task from the list, so a new comment shows up immediately
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  function openTask(task: Task) {
    setSelectedTaskId(task.id);
    setSheetOpen(true);
  }

  // local only for now. Replace the body with api.post(...) when the backend exists
  async function addComment(taskId: number, text: string) {
    const newComment = {
      id: Date.now(),
      task_id: taskId,
      user_id: CURRENT_USER.id,
      text,
      created_at: new Date().toISOString(),
      user: CURRENT_USER,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t,
      ),
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 bg-orange-50 rounded-md p-3">
        <div className="mb-1 grid grid-cols-1 xl:grid-cols-2">
          <div className="left">
            <div className="mb-2 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 p-2 rounded-full text-xs">
                Active
              </span>
              <p className="text-slate-500 text-xs">Due Mar 28, 2026</p>
            </div>
            <h1 className="text-3xl font-bold">Q1 Product Launch</h1>
            <p className="text-wrap w-full line-clamp-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus
              tempore porro repellat at voluptates a iusto odio sapiente harum,
              voluptatibus, distinctio, in eligendi expedita mollitia quae
              temporibus! Hic, cumque accusamus.
            </p>
          </div>
          <div className="right flex gap-2 items-center xl:justify-end md:justify-start">
            <div className="flex -space-x-1">
              {visible.map((m, i) => (
                <div
                  key={m.id}
                  title={`${m.first_name} ${m.last_name}`}
                  className={`flex size-6 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                >
                  {m.first_name.charAt(0)}
                  {m.last_name.charAt(0)}
                </div>
              ))}
              {extra > 0 && (
                <div className="flex size-6 items-center justify-center rounded-full bg-white border border-white text-xs text-black ring-2 ring-white">
                  +{extra}
                </div>
              )}
            </div>
            <ProjectTaskFormDialog
              trigger={
                <Button className="bg-linear-to-r from-orange-600 to-orange-400 hover:cursor-pointer">
                  <Plus />
                  Add Task
                </Button>
              }
            />
          </div>
        </div>
        {/* progress bar */}
        <Progress value={56} className="mb-3 w-full">
          <ProgressValue />
        </Progress>
      </div>

      {/* board */}
      <div className="mb-2 grid gap-2 grid-cols-1 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);

          return (
            <section key={col.key}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${col.dot}`}
                  />
                  <h3 className={`text-xs leading-none pt-px ${col.text}`}>
                    {col.label}
                  </h3>
                </div>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full pt-px text-xs leading-none ${col.badge}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <div className="tasks min-h-100 rounded-md bg-white p-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onOpen={openTask} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <TaskDetailSheet
        task={selectedTask}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onEdit={() => {
          setSheetOpen(false); // close the sheet
          setEditOpen(true); // open the edit dialog
        }}
        onAddComment={addComment}
        currentUserInitials="AR"
      />

      {selectedTask && (
        <ProjectTaskFormDialog
          key={selectedTask.id}
          task={selectedTask}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
}

export default ProjectDetail;
