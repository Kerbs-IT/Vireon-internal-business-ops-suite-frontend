import { ChevronDownIcon } from "lucide-react";
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
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "@/lib/api";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDepartments from "@/hooks/useDepartments";
import useRoles from "@/hooks/useRoles";
import { toast } from "../ui/toast";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  role_id: number;
  position: string;
  date_hired: string;
  status: "active" | "inactive";
}

interface EmployeeFormDialogProps {
  employee?: Employee;
  trigger: React.ReactElement;
  onSuccess?: () => void;
  departmentItems: DepartmentType[];
  roleItems: RoleType[];
}

interface DepartmentType {
  value: number;
  label: string;
}
interface RoleType {
  value: number;
  label: string;
}

const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  department_id: z.number().min(1, "Select a department"),
  role_id: z.string().min(1, "Select a role"),
  position: z.string().min(1, "Position is required"),
  date_hired: z.date({ error: "Pick a date" }),
  status: z.enum(["active", "inactive"]),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

// small helper so every field shows errors the same way, without
// repeating this JSX under all 8 fields by hand
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
}

export default function EmployeeFormDialog({
  employee,
  trigger,
  onSuccess,
  departmentItems,
  roleItems,
}: EmployeeFormDialogProps) {
  const isEditMode = !!employee;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: employee?.first_name ?? "",
      last_name: employee?.last_name ?? "",
      email: employee?.email ?? "",
      department_id: employee?.department_id ?? "",
      role_id: employee?.role_id?.toString() ?? "",
      position: employee?.position ?? "",
      date_hired: employee?.date_hired
        ? new Date(employee.date_hired)
        : undefined,
      status: employee?.status ?? "active",
    },
  });

  // fetch department data from te API
  const [disable, setDisable] = useState(false);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
      if (open) {
        reset({
          first_name: employee?.first_name ?? "",
          last_name: employee?.last_name ?? "",
          email: employee?.email ?? "",
          department_id: employee?.department_id ?? "",
          role_id: employee?.role_id?.toString() ?? "",
          position: employee?.position ?? "",
          date_hired: employee?.date_hired
            ? new Date(employee.date_hired)
            : undefined,
          status: employee?.status ?? "active",
        });
        // setError(null);
      }
    }, [open, employee, reset]);

  async function onSubmit(values: EmployeeFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        // avoid timezone shift (see #3)
        date_hired: format(values.date_hired, "yyyy-MM-dd"),
      };

      const res = isEditMode
        ? await api.put(`/employees/${employee.id}`, payload)
        : await api.post("/employees", payload);

      toast.add({
        type: res.data.email_sent === false ? "warning" : "success",
        description:
          res.data.message ??
          (isEditMode ? "Employee updated." : "Employee account created."),
      });

      setOpen(false);
      if (!isEditMode) reset(); // only clear after creating
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.status === 422) {
        Object.entries(error.response.data.errors).forEach(([field, msgs]) => {
          setError(field as any, { message: (msgs as string[])[0] });
        });
      }
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ??
          "Unable to save employee, please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-sm ">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isEditMode
            ? "Edit an employee account"
            : "Create a new team member account"}
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="first-name"
                      className="p-3 rounded border border-slate-300"
                      placeholder="Enter your first name.."
                    />
                  )}
                />
                <FieldError message={errors.first_name?.message} />
              </Field>

              <Field>
                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="last-name"
                      className="p-3 rounded border border-slate-300"
                      placeholder="Enter your last name.."
                    />
                  )}
                />
                <FieldError message={errors.last_name?.message} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="p-3 rounded border border-slate-300"
                  />
                )}
              />
              <FieldError message={errors.email?.message} />
            </Field>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="department-dropdown">
                  Department
                </FieldLabel>
                <Controller
                  name="department_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      items={departmentItems}
                    >
                      <SelectTrigger id="department-dropdown" className="p-5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {departmentItems.map((item) => (
                            <SelectItem
                              key={`${item.value}-department`}
                              value={item.value}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.department_id?.message} />
              </Field>

              <Field>
                <FieldLabel htmlFor="role-dropdown">Role</FieldLabel>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      items={roleItems}
                    >
                      <SelectTrigger id="role-dropdown" className="p-5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleItems.map((item) => (
                            <SelectItem
                              key={`${item.value}-role`}
                              value={String(item.value)}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.role_id?.message} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="position">Position</FieldLabel>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="position"
                    placeholder="e.g. Senior Developer"
                    className="p-3 rounded border border-slate-300"
                  />
                )}
              />
              <FieldError message={errors.position?.message} />
            </Field>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
              <Field>
                <FieldLabel>Date Hired</FieldLabel>
                <Controller
                  name="date_hired"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            data-empty={!field.value}
                            className="p-5 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ChevronDownIcon data-icon="inline-end" />
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError message={errors.date_hired?.message} />
              </Field>

              <Field>
                <FieldLabel htmlFor="status-dropdown">Status</FieldLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status-dropdown" className="p-5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem key="active-status" value="active">
                            Active
                          </SelectItem>
                          <SelectItem key="inactive-status" value="inactive">
                            Inactive
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.status?.message} />
              </Field>
            </div>
          </FieldGroup>

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
              disabled={submitting}
              className="bg-linear-to-r from-orange-600 border-0 outline-0 to-orange-400 p-2"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
