import { useState, type ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
  Dialog,
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
import { toast } from "@/components/ui/toast";
import api from "@/lib/api";
import { countDays } from "@/pages/LeaveRequestComponent/MyRequests";

interface LeaveRequest {
  id: number;
  leave_type: { name: string } | null;
  start_date: string;
  end_date: string;
  reason: string;
  user: {
    first_name: string;
    last_name: string;
    position: string;
    department: { name: string } | null;
  } | null;
}

interface ReviewLeaveRequestDialogProps {
  leaveRequest: LeaveRequest;
  trigger: ReactElement;
  onSuccess?: () => void;
}

const reviewSchema = z.object({
  comment: z.string().max(255, "Comment maximum length is 255 characters"),
});

type ReviewValues = z.infer<typeof reviewSchema>;
type ReviewAction = "approve" | "reject";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
}

// "Mar 25 - 28, 2026" / "Mar 25 - Apr 2, 2026" / "Mar 25, 2026"
function formatRange(start: string, end: string) {
  const s = parseISO(start.slice(0, 10));
  const e = parseISO(end.slice(0, 10));

  if (start.slice(0, 10) === end.slice(0, 10)) return format(s, "MMM d, yyyy");
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${format(s, "MMM d")} - ${format(e, "d, yyyy")}`;
  }
  return `${format(s, "MMM d")} - ${format(e, "MMM d, yyyy")}`;
}

export default function ReviewLeaveRequestDialog({
  leaveRequest,
  trigger,
  onSuccess,
}: ReviewLeaveRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<ReviewAction | null>(
    null,
  );
  const submitting = submittingAction !== null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { comment: "" },
  });

  function handleOpenChange(next: boolean) {
    // don't allow closing mid-request
    if (submitting) return;
    setOpen(next);
    if (!next) reset();
  }

  async function submitReview(action: ReviewAction, values: ReviewValues) {
    setSubmittingAction(action);
    try {
      const res = await api.put(
        `/leave-requests/${leaveRequest.id}/${action}`,
        { comment: values.comment || null },
      );

      toast.add({
        type: "success",
        description:
          res.data.message ??
          (action === "approve"
            ? "Leave request approved."
            : "Leave request rejected."),
      });

      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      let description = "Something went wrong.";
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        description =
          (data?.errors && Object.values<string[]>(data.errors)[0]?.[0]) ||
          data?.message ||
          description;
      }
      toast.add({ type: "error", description });
    } finally {
      setSubmittingAction(null);
    }
  }

  const user = leaveRequest.user;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b">
          <DialogTitle>Review Request</DialogTitle>
          <DialogDescription className="pb-2 text-xs">
            {user?.first_name ?? "Guest"} {user?.last_name?.charAt(0) ?? ""}.'s
            leave request
          </DialogDescription>
        </DialogHeader>

        {/* Enter / Approve button submits as approve */}
        <form onSubmit={handleSubmit((v) => submitReview("approve", v))}>
          <div className="requester-info p-2 mb-5 flex gap-2 bg-slate-100 rounded-md shadow">
            <div className="initial w-10 h-10 flex items-center justify-center rounded-full text-white text-xs font-medium bg-orange-500">
              {user?.first_name?.charAt(0) ?? ""}
              {user?.last_name?.charAt(0) ?? ""}
            </div>
            <div className="info">
              <h1 className="teammate-name font-bold">
                {user?.first_name ?? ""} {user?.last_name?.charAt(0) ?? ""}.
              </h1>
              <p className="text-slate-500 text-sm">
                {user?.position ?? "none"} - {user?.department?.name ?? "none"}
              </p>
            </div>
          </div>

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
                {countDays(leaveRequest.start_date, leaveRequest.end_date)} days
              </p>
            </Field>
            <Field className="bg-slate-100 rounded-lg p-2 gap-0">
              <p className="text-slate-400 p-0 m-0">Dates</p>
              <p className="p-0 m-0">
                {formatRange(leaveRequest.start_date, leaveRequest.end_date)}
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
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="field-sizing-fixed w-full min-h-20 wrap-break-word py-1 px-3"
                  placeholder="Add a note about your decision..."
                />
              )}
            />
            <ErrorText message={errors.comment?.message} />
          </Field>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={handleSubmit((v) => submitReview("reject", v))}
              className="hover:cursor-pointer text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
            >
              {submittingAction === "reject" ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-green-500 p-2 hover:bg-green-600 hover:cursor-pointer hover:text-white"
            >
              {submittingAction === "approve" ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
