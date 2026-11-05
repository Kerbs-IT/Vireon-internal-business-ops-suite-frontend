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
import type React from "react";
import { useEffect, useState } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "./RequestLeaveFormDialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { format, parseISO } from "date-fns";
import axios from "axios";
import api from "@/lib/api";
import { toast } from "@/components/ui/toast";
import useEmployees from "@/hooks/useEmployees";



interface ProjectMembers {
  id: number;
  first_name: string;
  last_name: string;
  pivot: { project_id: number; user_id: number };
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  end_date: string;
  created_by: number;
  members: ProjectMembers[];
}
// what the API sends

interface ProjectFormDialogProps {
  trigger: React.ReactElement;
  project?: Project;
  onSuccess?: () => void;
  // set to false if the trigger is not a real <button> (a div, a Link, a card)
  triggerIsButton?: boolean;
}

// keys must match the Laravel rule: Rule::in(['active', 'completed', 'on_hold'])
const statusItems = {
  active: "Active",
  on_hold: "On-hold",
  completed: "Completed",
};

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
}

// what the form holds
const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description must be at most 255 characters"),
  status: z.string().min(1, "Select a status"),
  end_date: z.date({ error: "Pick an end date" }),
  members: z.array(z.number()).min(1, "Select at least one member"),
});

type ProjectValue = z.infer<typeof projectSchema>;



const toDate = (value?: string | null) =>
  value ? parseISO(value.slice(0, 10)) : undefined;

const getDefaults = (project?: Project): Partial<ProjectValue> => ({
  name: project?.name ?? "",
  description: project?.description ?? "",
  status: project?.status ?? "active",
  end_date: toDate(project?.end_date),
  members: project?.members?.map((m) => m.id) ?? [],
});

function ProjectFormDialog({
  trigger,
  project,
  onSuccess,
  triggerIsButton = true,
}: ProjectFormDialogProps) {
  const isEditMode = !!project?.id;
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { employees } = useEmployees();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectValue>({
    resolver: zodResolver(projectSchema),
    defaultValues: getDefaults(project),
  });

  // refill the form every time the dialog opens
  useEffect(() => {
    if (open) reset(getDefaults(project));
  }, [open, project, reset]);

  function handleOpenChange(next: boolean) {
    // don't allow closing while a request is running
    if (submitting) return;
    setOpen(next);
  }

  async function onSubmit(values: ProjectValue) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        end_date: format(values.end_date, "yyyy-MM-dd"),
      };

      const res = isEditMode
        ? await api.put(`/projects/${project!.id}`, payload)
        : await api.post("/projects", payload);

      toast.add({
        type: "success",
        description:
          res.data.message ??
          (isEditMode ? "Project updated." : "Project created."),
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger}  />
      <DialogContent className="xl:max-w-lg lg:max-w-lg">
        <DialogHeader className="pb-5 border-b">
          <DialogTitle>
            {isEditMode ? "Edit Project" : "New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update ${project?.name} details`
              : "Create a project and invite your team"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Field className="mb-3">
            <FieldLabel>Project Name</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  className="p-2 rounded border border-slate-300"
                  placeholder="Enter project name.."
                />
              )}
            />
            <ErrorText message={errors.name?.message} />
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
                  className="p-2 rounded border field-sizing-fixed w-full min-h-20 wrap-break-word border-slate-300"
                  placeholder="What is this project about?"
                />
              )}
            />
            <ErrorText message={errors.description?.message} />
          </Field>

          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ?? "active")}
                    items={statusItems}
                  >
                    <SelectTrigger className="p-4.5 bg-white min-w-30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(statusItems).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorText message={errors.status?.message} />
            </Field>

            <Field>
              <FieldLabel>End Date</FieldLabel>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter the date"
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                )}
              />
              <ErrorText message={errors.end_date?.message} />
            </Field>
          </div>

          {/* team members */}
          <Field>
            <FieldLabel>Team members</FieldLabel>
            <Controller
              name="members"
              control={control}
              render={({ field }) => {
                const toggle = (id: number) =>
                  field.onChange(
                    field.value.includes(id)
                      ? field.value.filter((v) => v !== id)
                      : [...field.value, id],
                  );

                return (
                  <div className="flex flex-col w-full border rounded-md p-3 gap-2 overflow-y-auto max-h-50">
                    {employees.map((member) => {
                      const selected = field.value.includes(member.id);

                      return (
                        <button
                          key={member.id}
                          type="button"
                          role="checkbox"
                          aria-checked={selected}
                          onClick={() => toggle(member.id)}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded p-2 text-left transition-colors",
                            selected ? "bg-orange-50" : "hover:bg-slate-50",
                          )}
                        >
                          <div className="flex gap-3 items-center">
                            <div className="w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-medium bg-red-400">
                              {member.first_name.charAt(0)}
                              {member.last_name.charAt(0)}
                            </div>
                            <div className="team-info">
                              <span className="text-sm font-medium text-slate-700">
                                {member.first_name} {member.last_name.charAt(0)}
                                .
                              </span>
                              <p className="text-slate-400 text-xs">
                                {member.position ?? "none"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={cn(
                              "flex size-5 items-center justify-center rounded-full border",
                              selected
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "border-slate-300",
                            )}
                          >
                            {selected && <Check className="size-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
            <ErrorText message={errors.members?.message} />
          </Field>

          <DialogFooter className="mt-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
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
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectFormDialog;
