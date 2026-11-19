import { useState, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  countDays,
  formatRange,
  statusStyles,
  type LeaveStatus,
} from "@/lib/leave";

export interface ViewableLeaveRequest {
  id: number;
  leave_type: { name: string } | null;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  review_comment?: string | null; // rename to your column
}

export default function ViewLeaveRequestDialog({
  leaveRequest,
  trigger,
}: {
  leaveRequest: ViewableLeaveRequest;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const days = countDays(leaveRequest.start_date, leaveRequest.end_date);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b">
          <DialogTitle className="flex items-center gap-2">
            Leave Request
            <span
              className={`text-xs px-2 py-1 rounded-2xl border capitalize font-normal ${statusStyles[leaveRequest.status]}`}
            >
              {leaveRequest.status}
            </span>
          </DialogTitle>
          <DialogDescription className="pb-2 text-xs">
            Your request details
          </DialogDescription>
        </DialogHeader>

        <div className="leave-info grid grid-cols-1 mb-5 gap-2 lg:grid-cols-3">
          <Field className="bg-slate-100 rounded-lg p-2 gap-0">
            <p className="text-slate-400 p-0 m-0">Type</p>
            <p className="p-0 m-0 capitalize">
              {leaveRequest.leave_type?.name ?? "N/A"}
            </p>
          </Field>
          <Field className="bg-slate-100 rounded-lg p-2 gap-0">
            <p className="text-slate-400 p-0 m-0">Duration</p>
            <p className="p-0 m-0">
              {days} {days === 1 ? "day" : "days"}
            </p>
          </Field>
          <Field className="bg-slate-100 rounded-lg p-2 gap-0">
            <p className="text-slate-400 p-0 m-0">Dates</p>
            <p className="p-0 m-0">
              {formatRange(leaveRequest.start_date, leaveRequest.end_date)}
            </p>
          </Field>
        </div>

        <Field className="mb-5">
          <FieldLabel>Reason</FieldLabel>
          <p className="text-wrap min-h-15 rounded p-2 bg-slate-100 break-words">
            {leaveRequest.reason}
          </p>
        </Field>

        {leaveRequest.status !== "pending" && (
          <Field>
            <FieldLabel>Manager's comment</FieldLabel>
            <p className="text-wrap min-h-15 rounded p-2 bg-slate-100 break-words">
              {leaveRequest.review_comment || "No comment provided."}
            </p>
          </Field>
        )}

        <DialogFooter className="mt-4">
          <DialogClose
            render={
              <Button type="button" variant="outline">
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
