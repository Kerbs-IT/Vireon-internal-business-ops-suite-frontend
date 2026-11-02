import React, { type ReactElement, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface LeaveType {
  id: number;
  name: string;
}

interface RequestLeaveFormDialogProps {
  trigger: ReactElement;
  onSuccess?: () => void;
}

const leaveSchema = z
  .object({
    leave_type_id: z.number({ error: "Select a leave type" }),
    start_date: z.date({ error: "Pick a start date" }),
    end_date: z.date({ error: "Pick an end date" }),
    reason: z
      .string()
      .min(1, "Reason is required")
      .max(255, "Max 255 characters"),
  })
  .refine((v) => v.end_date >= v.start_date, {
    message: "End date can't be before start date",
    path: ["end_date"],
  });

type LeaveFormValues = z.infer<typeof leaveSchema>;

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
}

type DatePickerProps = {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder: string;
  disabled?: (date: Date) => boolean;
};

function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal shadow-none hover:bg-slate-50",
              value ? "text-slate-900" : "text-slate-400",
            )}
          />
        }
      >
        {value ? format(value, "MMM dd, yyyy") : placeholder}
        <CalendarIcon className="size-6 text-slate-400" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={disabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function RequestLeaveFormDialog({
  trigger,
  onSuccess,
}: RequestLeaveFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leave_type_id: undefined,
      start_date: undefined,
      end_date: undefined,
      reason: "",
    },
  });

  const startDate = watch("start_date");

  // fetch leave types each time the dialog opens, reset the form when it closes
  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    let cancelled = false;
    setLoadingTypes(true);
    api
      .get<LeaveType[]>("/leave-types")
      .then((res) => {
        if (!cancelled) setLeaveTypes(res.data);
      })
      .catch(() => {
        toast.add({
          type: "error",
          description: "Failed to load leave types.",
        });
      })
      .finally(() => {
        if (!cancelled) setLoadingTypes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, reset]);

  async function onSubmit(values: LeaveFormValues) {
    setSubmitting(true);
    try {
      const res = await api.post("/leaveRequests", {
        leave_type_id: values.leave_type_id,
        // yyyy-MM-dd in local time, avoids the UTC off-by-one-day problem
        start_date: format(values.start_date, "yyyy-MM-dd"),
        end_date: format(values.end_date, "yyyy-MM-dd"),
        reason: values.reason,
      });

      toast.add({
        type: "success",
        description: res.data.message ?? "Leave request submitted.",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      let description = "Something went wrong.";
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        // Laravel 422: first validation error, otherwise the message
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a new time-off request</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Field className="mb-5">
            <FieldLabel>Leave Type</FieldLabel>
            <Controller
              name="leave_type_id"
              control={control}
              render={({ field }) => (
                <div className="buttons flex flex-wrap gap-1">
                  {loadingTypes
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-28 rounded-md" />
                      ))
                    : leaveTypes.map((type) => (
                        <Button
                          key={type.id}
                          type="button"
                          onClick={() => field.onChange(type.id)}
                          className={cn(
                            "py-2 px-3 border hover:bg-orange-200 hover:text-orange-600",
                            field.value === type.id
                              ? "bg-orange-200 text-orange-600 border-orange-300"
                              : "bg-slate-100 border-slate-200 text-black",
                          )}
                        >
                          {type.name}
                        </Button>
                      ))}
                </div>
              )}
            />
            <ErrorText message={errors.leave_type_id?.message} />
          </Field>

          <div className="dates grid grid-cols-2 gap-6 mb-5">
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      // clear end date if it's now before the start date
                      const end = watch("end_date");
                      if (date && end && end < date)
                        setValue("end_date", undefined as never);
                    }}
                    placeholder="Mar 25, 2026"
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                )}
              />
              <ErrorText message={errors.start_date?.message} />
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
                    placeholder="Mar 28, 2026"
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                )}
              />
              <ErrorText message={errors.end_date?.message} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Reason</FieldLabel>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Textarea
                className="field-sizing-fixed w-full m-h-20 wrap-break-word"
                  {...field}  
                  placeholder="Briefly describe your reason for leave..."
                />
              )}
            />
            <ErrorText message={errors.reason?.message} />
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
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
