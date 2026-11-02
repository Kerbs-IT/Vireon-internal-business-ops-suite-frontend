import { useCallback, useEffect, useState } from "react";
import RequestLeaveFormDialog from "@/components/DialogForm/RequestLeaveFormDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import api from "@/lib/api";
import { CalendarDays, HeartPulse, Plus, TreePalm } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface LeaveRequest {
  id: number;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected";
  leave_type: { id: number; name: string } | null;
}

// icon depends on the leave type name
const typeIcons: Record<string, LucideIcon> = {
  "Sick Leave": HeartPulse,
  "Vacation Leave": TreePalm,
};

const statusStyles: Record<LeaveRequest["status"], string> = {
  pending: "bg-yellow-100 text-yellow-900 border-yellow-200",
  approved: "bg-green-100 text-green-900 border-green-200",
  rejected: "bg-red-100 text-red-900 border-red-200",
};

const parseDate = (date: string) => new Date(`${date.slice(0, 10)}T00:00:00`);

export const formatDate = (date: string) =>
  parseDate(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const countDays = (start: string, end: string) =>
  Math.round(
    (parseDate(end).getTime() - parseDate(start).getTime()) / 86400000,
  ) + 1;


function RequestSkeleton() {
  return (
    <div className="bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <Skeleton className="h-10 w-10 rounded-sm" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-52" />
        </div>
      </div>
      <Skeleton className="h-7 w-20 rounded-2xl" />
    </div>
  );
}

export default function MyRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/my-leave-request");
      setRequests(res.data.myRequests);
    } catch {
      toast.add({
        type: "error",
        description: "Failed to load your leave requests.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="page">
      <div className="header-part w-full flex items-center justify-between my-5">
        <h3 className="text-slate-500">
          Your leave history and upcoming time off
        </h3>
        <RequestLeaveFormDialog
          onSuccess={fetchRequests}
          trigger={
            <Button className="bg-orange-500 hover:bg-orange-600 hover:cursor-pointer">
              <Plus />
              Request leave
            </Button>
          }
        />
      </div>

      <div className="main-content w-full flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <RequestSkeleton key={i} />)
        ) : requests.length === 0 ? (
          <p className="text-center text-slate-500 py-10 bg-white rounded">
            No leave requests yet.
          </p>
        ) : (
          requests.map((req) => {
            const name = req.leave_type?.name ?? "Leave";
            const Icon = typeIcons[name] ?? CalendarDays;
            const days = countDays(req.start_date, req.end_date);

            return (
              <div
                key={req.id}
                className="item bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between"
              >
                <div className="left-side flex gap-3 items-center">
                  <Icon className="bg-orange-100 text-orange-500 rounded-sm h-10 w-10 p-2" />
                  <div className="info">
                    <h1 className="title font-bold">{name}</h1>
                    <h3 className="text-slate-500 text-sm">
                      {formatDate(req.start_date)} - {formatDate(req.end_date)}{" "}
                      · {days} {days === 1 ? "day" : "days"}
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-xs p-2 rounded-2xl border capitalize ${statusStyles[req.status]}`}
                >
                  {req.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
