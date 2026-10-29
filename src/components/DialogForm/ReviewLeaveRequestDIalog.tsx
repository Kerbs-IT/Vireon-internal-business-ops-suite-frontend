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
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import type { ReactElement } from "react";

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role_id: number;
    department_id: number;
    position: string;
  };
}

interface ReviewLeaveRequestDialogProps {
  leaveRequest?: LeaveRequest;
  trigger: ReactElement;
}
export default function ReviewLeaveRequestDialog({
  leaveRequest,
  trigger,
}: ReviewLeaveRequestDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md ">
        <DialogHeader className="border-b ">
          <DialogTitle>Review Request</DialogTitle>
          <DialogDescription className="pb-2 text-xs">
            {leaveRequest.user?.first_name ?? "Guest"}{" "}
            {leaveRequest.user?.last_name?.charAt(0) ?? ""}. 's leave request
          </DialogDescription>
        </DialogHeader>
        <form action="">
          <div className="requester-info  p-2 mb-5 flex gap-2 bg-slate-100 rounded-md shadow">
            <div className="initial w-10 h-10 flex items-center justify-center rounded-full text-white text-xs font-medium bg-orange-500">
              {leaveRequest.user?.first_name?.charAt(0) ?? ""}
              {leaveRequest.user?.last_name?.charAt(0) ?? ""}
            </div>
            <div className="info">
              <h1 className="teammate-name font-bold">
                {leaveRequest.user?.first_name ?? ""}{" "}
                {leaveRequest.user?.last_name?.charAt(0) ?? ""}.
              </h1>
              <p className="text-slate-500 text-sm">
                {leaveRequest.user?.position ?? "none"} - IT Dept
              </p>
            </div>
          </div>
          {/* new section */}

          <div className="leave-info grid grid-cols-1 mb-5 gap-2 lg:grid-cols-3">
            <Field className="bg-slate-100 rounded-lg p-2 gap-0">
              <p className="text-slate-400 p-0 m-0">Type</p>
              <p className="p-0 m-0 capitalize">
                {leaveRequest.leave_type ?? "N/A"}
              </p>
            </Field>
            <Field className="bg-slate-100 rounded-lg p-2 gap-0">
              <p className="text-slate-400 p-0 m-0">Type</p>
              <p className="p-0 m-0 capitalize">
                {leaveRequest.duration ?? "N/A"} days
              </p>
            </Field>
            <Field className="bg-slate-100 rounded-lg p-2 gap-0">
              <p className="text-slate-400 p-0 m-0">Dates</p>
              <p className="p-0 m-0 capitalize">
                {leaveRequest.start_date ?? "N/A"} -{" "}
                {leaveRequest.end_date ?? "N/A"}
              </p>
            </Field>
          </div>
          <div className="reason mb-5">
            <Field>
              <FieldLabel>Reason</FieldLabel>
              <p className="text-wrap min-h-15 rounded p-2 bg-slate-100">
                {leaveRequest.reason}
              </p>
            </Field>
          </div>
          <Field>
            <FieldLabel>Comment (optional)</FieldLabel>
            <Textarea
              className="field-sizing-fixed w-full min-h-20 wrap-break-word py-1 px-3"
              placeholder="Add a note about your decision..."
            />
          </Field>
          <DialogFooter className="mt-4">
            <DialogClose
              render={
                <Button
                  variant="outline"
                  className="hover:cursor-pointer text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                >
                  Reject
                </Button>
              }
            />
            <Button
              type="submit"
              className="bg-green-500 p-2 hover:bg-green-600 hover:cursor-pointer hover:text-white"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
