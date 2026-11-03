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
import { Field, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "./RequestLeaveFormDialog";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: Date;
  end_date: Date;
    created_by: number;
    members?: [];
}
interface ProjectFormDialogProps {
  trigger: React.ReactElement;
  project?: Project;
}
const statusItems = {
  all: "All Status",
  active: "Active",
  "on-hold": "On-hold",
  completed: "Completed",
};
function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
}
// zod schema
const projectSchema = z.object({
  name: z.string().max(10, { error: "Maximum lengt is 10 words" }),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(255, "Description must be at most 255 characters"),
  status: z.string(),
  end_date: z.date(),
  members: z.array(z.number()).min(1, "Select at least one member"),
});

type ProjectValue = z.infer<typeof projectSchema>;

const team_sample_data = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    position: "Project Manager",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    position: "Frontend Developer",
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Johnson",
    position: "Backend Developer",
  },
  
];
function ProjectFormDialog({ trigger, project }: ProjectFormDialogProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
      watch,
    setValue,
    reset,
  } = useForm<ProjectValue>({
      resolver: zodResolver(projectSchema),
      defaultValues: {
          name: project?.name?? undefined,
          description: project?.description ?? undefined,
          status: project?.status ?? 'active',
          end_date: project?.end_date ?? undefined,
          members: project?.members ?? [],

      },
  });
  const [status, setStatus] = useState("active");
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="xl:max-w-lg lg:max-w-lg">
        <DialogHeader className="pb-5 border-b">
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {project
              ? `Update ${project.name} details`
              : "Create a project and invite your team "}
          </DialogDescription>
        </DialogHeader>
        <form action="">
          <Field className="mb-3">
            <FieldLabel className="">Project Name</FieldLabel>
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
          {/* description */}
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
                  placeholder="What is this project about?"
                />
              )}
            />
            <ErrorText message={errors.description?.message} />
          </Field>
          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-2">
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val)}
                items={statusItems}
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
                    {Object.entries(statusItems).map(([value, label]) => (
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
              <FieldLabel>Start Date</FieldLabel>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      // clear end date if it's now before the start date

                      setValue("end_date", undefined as never);
                    }}
                    placeholder="Mar 25, 2026"
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
                    {team_sample_data.map((member) => {
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
                              {member.first_name?.charAt(0)}
                              {member.last_name?.charAt(0)}
                            </div>
                            <div className="team-info">
                              <span className="text-sm font-medium text-slate-700">
                                {member.first_name}{" "}
                                {member.last_name?.charAt(0)}.
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

          <DialogFooter>
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
              
              className="bg-linear-to-r from-orange-600 border-0 outline-0 to-orange-400 p-2"
            >
            Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default ProjectFormDialog;
