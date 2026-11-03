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

interface ProjectTask {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assigned_to: number;
  status: string;
  priority: string;
  due_date: Date;
}

interface ProjectTaskFormDialogProps {
  task?: ProjectTask;
  trigger: React.ReactElement;
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
  project_id: z.number(),
  title: z
    .string()
    .min(10, "Title must be at leash 10 characters")
    .max(50, "Title must be at leash 50 characters"),
  description: z
    .string()
    .min(20, "Title must be at leash 20 characters")
    .max(255, "Title must be at leash 255 characters"),
  assigned_to: z.number(),
  status: z.string(),
  priority: z.string(),
  due_date: z.date(),
});

type taskValue = z.infer<typeof taskSchema>;

function ProjectTaskFormDialog({ trigger, task }: ProjectTaskFormDialogProps) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<taskValue>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      project_id: task?.project_id ?? undefined,
      title: task?.title ?? undefined,
      description: task?.description ?? undefined,
      assigned_to: task?.assigned_to ?? undefined,
      status: task?.status ?? undefined,
      priority: task?.priority ?? undefined,
      due_date: task?.due_date ?? undefined,
    },
  });
  const [priority, setPriority] = useState("");
    const { employees } = useEmployees();
    const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-3 border-b ">
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {task ? task.title : "Create new task to the project"}
          </DialogDescription>
        </DialogHeader>
        <form action="">
          <Field className="mb-3">
            <FieldLabel>Task Title</FieldLabel>
            <input
              type="text"
              name="title"
              className="p-2 rounded border border-slate-300"
              placeholder="Enter task title..."
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
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val)}
                items={priorityItems}
              >
                <SelectTrigger
                  id="checkout-exp-month-ts6"
                  className="p-4.5 bg-white min-w-30"
                  value="All-status"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(priorityItems).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorText message={errors.status?.message} />
            </Field>
            <Field>
              <FieldLabel>Due Date</FieldLabel>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      // clear end date if it's now before the start date

                      setValue("due_date", undefined as never);
                    }}
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
                  list={employees}
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
          <DialogFooter className="mt-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="hover:cursor-pointer"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectTaskFormDialog;
