import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import useManagers from "@/hooks/useManagers";
import ManagerCombobox from "../ManagerCombobox";
import api from "@/lib/api";

interface Department {
  id: number;
  name: string;
  manager: { id: number; first_name: string; last_name: string } | null;
}

interface DepartmentFormDialogProps {
  department?: Department;
  trigger: React.ReactElement;
  onSuccess: () => void; // tells the parent page to refetch the list
}

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  manager_id: z.number().nullable(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
}

export default function DepartmentFormDialog({
  department,
  trigger,
  onSuccess,
}: DepartmentFormDialogProps) {
  const isEditMode = !!department;
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { managers } = useManagers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name ?? "",
      manager_id: department?.manager?.id ?? null,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: department?.name ?? "",
        manager_id: department?.manager?.id ?? null,
      });
      setSubmitError(null);
    }
  }, [open, department, reset]);

  async function onSubmit(values: DepartmentFormValues) {
    setSubmitError(null);
    try {
      if (isEditMode) {
        await api.put(`/departments/${department.id}`, values);
      } else {
        await api.post("/departments", values);
      }
      onSuccess(); // tell Department.tsx to refetch
      setOpen(false); // close the dialog
      reset(); // clear the form for next time it opens
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message ?? "Something went wrong. Try again.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Department" : "Add Department"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isEditMode
            ? "Edit an organizational unit"
            : "Create an organizational unit"}
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <FieldLabel htmlFor="department-name">Department Name</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="department-name"
                  className="p-3 rounded border border-slate-300 w-full"
                  placeholder="e.g. Human Resource"
                />
              )}
            />
            <FieldError message={errors.name?.message} />
          </Field>

          <Field className="mt-4">
            <FieldLabel>Manager</FieldLabel>
            <Controller
              name="manager_id"
              control={control}
              render={({ field }) => (
                <ManagerCombobox
                  managers={managers}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                />
              )}
            />
            <FieldError message={errors.manager_id?.message} />
          </Field>

          {submitError && (
            <p className="text-sm text-destructive mt-3">{submitError}</p>
          )}

          <DialogFooter className="mt-4">
            <DialogClose
              render={
                <Button variant="outline" className="hover:cursor-pointer">
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r hover:cursor-pointer from-orange-600 border-0 outline-0 to-orange-400 p-2"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
