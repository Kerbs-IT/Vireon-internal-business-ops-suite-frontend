import { useState } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Pencil, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";



interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: Task) => void;
  onAddComment?: (taskId: number, text: string) => Promise<void> | void;
  currentUserInitials?: string;
}

const STATUS_LABEL: Record<Task["status"], string> = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const PRIORITY_STYLE: Record<Task["priority"], string> = {
  high: "bg-orange-100 text-orange-600",
  medium: "bg-blue-100 text-blue-600",
  low: "bg-slate-100 text-slate-500",
};

// Tailwind needs full class names, so keep them written out
const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-sky-500",
];

const initials = (first?: string, last?: string) =>
  `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase();

const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

function Avatar({
  id,
  first,
  last,
  className,
}: {
  id: number;
  first?: string;
  last?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-xs font-medium text-white",
        avatarColor(id),
        className,
      )}
    >
      {initials(first, last)}
    </div>
  );
}

export default function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  onEdit,
  onAddComment,
  currentUserInitials = "ME",
}: TaskDetailSheetProps) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

 async function handleSend() {
   const text = comment.trim();
   if (!task || !text || sending) return;

   setSending(true);
   try {
     await onAddComment?.(task.id, text);
     setComment("");
   } catch {
     // the error toast was already shown in addComment
   } finally {
     setSending(false);
   }
 }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        {/* gradient accent bar */}
        <div className="h-1 w-full shrink-0 bg-linear-to-r from-red-500 to-orange-400" />

        {task && (
          <>
            {/* header */}
            <SheetHeader className="relative gap-2 border-b p-4 pr-24">
              <div className="flex gap-2">
                <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] leading-none text-orange-600">
                  {STATUS_LABEL[task.status]}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[10px] capitalize leading-none",
                    PRIORITY_STYLE[task.priority],
                  )}
                >
                  {task.priority} priority
                </span>
              </div>
              <SheetTitle className="text-xl">{task.title}</SheetTitle>
              <SheetDescription className="sr-only">
                Task details and comments
              </SheetDescription>

              {/* edit button, sits to the left of the built-in close X */}
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Edit task"
                  onClick={() => onEdit(task)}
                  className="absolute top-3 right-12 text-slate-500"
                >
                  <Pencil className="size-4" />
                </Button>
              )}
            </SheetHeader>

            {/* scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 p-4">
                {/* assignee + due date */}
                <div className="flex items-center justify-between">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        id={task.assignee.id}
                        first={task.assignee.first_name}
                        last={task.assignee.last_name}
                        className="size-10"
                      />
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {task.assignee.first_name}{" "}
                          {task.assignee.last_name.charAt(0)}.
                        </p>
                        <p className="text-xs text-slate-400">
                          {task.assignee.position}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Unassigned</p>
                  )}

                  <div className="text-right">
                    <p className="text-xs text-slate-400">Due</p>
                    <p className="text-sm font-medium">
                      {format(
                        parseISO(task.due_date.slice(0, 10)),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </div>
                </div>

                {/* description *Medium/}
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="mb-1 text-xs font-medium text-slate-700">
                    Description
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {task.description || "No description provided."}
                  </p>
                </div>

                {/* progress */}
                <Progress value={task.progress}>
                  <ProgressLabel className="text-xs font-medium text-slate-700">
                    Progress
                  </ProgressLabel>
                  <ProgressValue className="text-xs text-slate-500" />
                </Progress>
              </div>

              {/* comments */}
              <div className="border-t p-4">
                <div className="mb-4 flex items-center gap-2">
                  <h4 className="text-xs font-medium text-slate-700">
                    Comments
                  </h4>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] leading-none text-slate-500">
                    {task.comments?.length}
                  </span>
                </div>

                {task.comments?.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-400">
                    No comments yet. Start the conversation.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {task.comments.map((c) => (
                      <li key={c.id} className="flex gap-3">
                        <Avatar
                          id={c.user.id}
                          first={c.user.first_name}
                          last={c.user.last_name}
                          className="size-8 text-[10px]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium">
                              {c.user.first_name} {c.user.last_name.charAt(0)}.
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDistanceToNow(new Date(c.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="wrap-break-word text-sm text-slate-600">
                            {c.comments}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* pinned comment input */}
            <div className="flex shrink-0 gap-3 border-t bg-white p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-medium text-white">
                {currentUserInitials}
              </div>
              <div className="relative flex-1">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter sends, Shift+Enter makes a new line
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Add a comment..."
                  className="min-h-16 resize-none pr-11 text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  aria-label="Send comment"
                  disabled={!comment.trim() || sending}
                  onClick={handleSend}
                  className="absolute right-2 bottom-2 size-7 bg-linear-to-r from-red-500 to-orange-400 text-white"
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
