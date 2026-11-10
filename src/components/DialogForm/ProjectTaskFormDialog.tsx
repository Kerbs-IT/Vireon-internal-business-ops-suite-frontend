import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

import { DatePicker } from "./RequestLeaveFormDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import ErrorText from "./ErrorText";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DropDownCombobox from "../DropDownCombobox";
import useEmployees from "@/hooks/useEmployees";
import { Button } from "../ui/button";
import { cn } from "cn";
import type { ProjectMembers } from "@/types/project";
import api from "@/lib/api";
import { toast } from "../ui/toast";
import axios from "axios";
import { format, parseISO } from "date-fns";
import type { Task } from "@/types/task";
import { Trash2 } from "lucide-react";
import { DeactivateProjectTaskDialog } from "./DeactivateProjectTaskDialog";

interface ProjectTask {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assigned_to: number;
  status: string;
  priority?: string;
  due_date: Date;
}

interface ProjectTaskFormDialogProps {
  projectId?: number;
  task?: Task;
  trigger?: React.ReactElement;
  open?: boolean; // present = controlled by the parent
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  members: ProjectMembers[];
}

const priorityItems = {
  high: "High",
  low: "Low",
  medium: "Medium",
};

const status = {
  todo: "Todo",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};
const taskSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 20 characters")
    .max(255, "Description must be at most 255 characters"),
  assigned_to: z.number({ error: "Select a team member" }),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().min(1, "Pick a due date"),
});


type taskValue = z.infer<typeof taskSchema>;

function ProjectTaskFormDialog({
  projectId,
  trigger,
  task,
  open,
  onOpenChange,
  onSuccess,
  members,
}: ProjectTaskFormDialogProps) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<taskValue>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      assigned_to: task?.assigned_to,
      status: task?.status ?? "todo",
      priority: task?.priority ?? "medium",
      due_date: task?.due_date?.slice(0, 10) ?? "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!task;

  // use the parent's state if it gave one, otherwise keep our own
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  // for deactivating
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  async function onSubmit(values: taskValue) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        project_id: projectId ?? undefined,
      };

      const res = isEditMode
        ? await api.put(`/tasks/${task.id}`, payload)
        : await api.post("/tasks", payload);

      toast.add({
        type: "success",
        description:
          res.data.message ??
          (isEditMode ? "Project Task updated." : "Project Task created."),
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      let description = "Something went wrong.";
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        // Laravel 422: show the first validation error, otherwise the message
        description =
          (data?.errors && Object.values<string[]>(data.errors)[0]?.[0]) ||
          data?.message ||
          description;
      }
      toast.add({ type: "error", description });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-3 border-b ">
            <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? task.title : "Create new task to the project"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field className="mb-3">
              <FieldLabel>Task Title</FieldLabel>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="title"
                    className="p-2 rounded border border-slate-300"
                    placeholder="Enter task title..."
                  />
                )}
              />
            </Field>

            <Field className="mb-3">
              <FieldLabel>Description</FieldLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    className="p-2 rounded border field-sizing-fixed w-full m-h-20 wrap-break-word border-slate-300"
                    placeholder="add details about this task.."
                  />
                )}
              />
            </Field>
            <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-2">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val ?? "medium")}
                      items={priorityItems}
                    >
                      <SelectTrigger className="p-4.5 bg-white min-w-30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(priorityItems).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorText message={errors.priority?.message} />
                <ErrorText message={errors.status?.message} />
              </Field>
              <Field>
                <FieldLabel>Due Date</FieldLabel>
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? parseISO(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      placeholder="Mar 25, 2026"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  )}
                />

                <ErrorText message={errors.due_date?.message} />
              </Field>
            </div>
            <Field className="mb-4 w-full">
              <FieldLabel>Assignee</FieldLabel>
              <Controller
                name="assigned_to"
                control={control}
                render={({ field }) => (
                  <DropDownCombobox
                    list={members}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeHolder="Select Team Member"
                  />
                )}
              />
              <ErrorText message={errors.assigned_to?.message} />
            </Field>
            <Field className="mb-5">
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="buttons flex flex-wrap gap-1">
                    {Object.entries(status).map(([key, value]) => (
                      <Button
                        key={key}
                        type="button"
                        onClick={() => field.onChange(key)}
                        className={cn(
                          "py-2 px-3 border hover:bg-orange-200 hover:text-orange-600",
                          field.value === key
                            ? "bg-orange-200 text-orange-600 border-orange-300"
                            : "bg-slate-100 border-slate-200 text-black",
                        )}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                )}
              />
              <ErrorText message={errors.status?.message} />
            </Field>
            <DialogFooter className="mt-4 flex-row items-center sm:justify-between">
              <div className="left">
                {task && (
                  <button
                    type="button"
                    onClick={() => setDeactivateOpen(true)}
                    className="text-red-500 flex items-center justify-center gap-1 text-xs transition duration-300 ease-in-out hover:cursor-pointer hover:bg-red-50 p-1.5 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="leading-none pb-0">Archive</span>
                  </button>
                )}
              </div>
              <div className="right flex flex-row gap-2">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="hover:cursor-pointer"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  }
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-linear-to-r from-orange-600 border-0 outline-0 to-orange-400 p-2"
                >
                  {submitting
                    ? `${task ? "Saving..." : "Submitting..."}`
                    : `${task ? "Save" : "Create"} Task`}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {
        task && (
          <DeactivateProjectTaskDialog 
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            task={task}
            onDeactivated={() => {
              setDeactivateOpen(false);
              setOpen(false);
              onSuccess?.()
            }}
          />
        )
      }
    </>
  );
}

export default ProjectTaskFormDialog;
