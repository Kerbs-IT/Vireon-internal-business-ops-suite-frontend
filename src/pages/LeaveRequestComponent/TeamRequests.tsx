
import ReviewLeaveRequestDialog from "@/components/DialogForm/ReviewLeaveRequestDIalog";
import { Button } from "@/components/ui/button";
import { useTeamLeaveRequest } from "@/hooks/useTeamLeaveRequest";
import { countDays, formatDate } from "./MyRequests";
import { Skeleton } from "@/components/ui/skeleton";

function ReviewRequestSkeleton() {
  return (
    <div className="item bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between">
      <div className="left-side flex gap-3 items-start">
        <div className="initial w-7 h-7 flex items-center justify-center rounded-full ">
          <Skeleton className="h-10 w-10 rounded-sm" />
        </div>
        <div className="info pb">      
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-4 w-50 mb-2" />
          <Skeleton className="h-4 w-50" />
        </div>
      </div>
      <div className="right-side flex items-center justify-center gap-1">
        <Skeleton className="h-6 w-15" />
        <Skeleton className="h-6 w-15" />
      </div>
    </div>
  );
}

export default function TeamRequests() {

  const { teamLeaveRequests,loading:teamLeaveLoading } = useTeamLeaveRequest();
  return (
    <div className="page">
      <div className="mb-3 header-part flex items-center justify-between mt-5">
        <p className="text-slate-500 text-sm">
          Pending approvals from your team
        </p>
        <span className="bg-orange-200 text-orange-600 rounded-lg py-1 px-2 text-xs text-center">
          {teamLeaveRequests? teamLeaveRequests.length : '0'} pending
        </span>
      </div>
      {/* main content */}
      <div className="main-content flex flex-col gap-1">
        {teamLeaveLoading
          ? Array.from({ length: 3 }).map((_, i) => <ReviewRequestSkeleton key={i}/>)
          : teamLeaveRequests.length === 0 ? (
            <p className="text-center text-slate-500 py-10 bg-white rounded">
              No Team Leave requests pending yet.
          </p>
          ):
          
          teamLeaveRequests.map((item) => (
              <div
                key={`$team-request-${item.id}`}
                className="item bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between"
              >
                <div className="left-side flex gap-3 items-start">
                  <div className="initial w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-medium bg-orange-500">
                    {item.user?.first_name?.charAt(0) ?? ""}
                    {item.user?.last_name?.charAt(0) ?? ""}
                  </div>
                  <div className="info">
                    <h1 className="teammate-name font-bold">
                      {item.user?.first_name ?? ""}{" "}
                      {item.user?.last_name?.charAt(0) ?? ""}.
                    </h1>
                    <h1 className="info-summary mb-2 text-xs text-slate-400">
                      {item.leave_type.name ?? "none"}{" "}
                      <span className="text-slate-600">|</span>{" "}
                      {formatDate(item.start_date) ?? "—"} -{" "}
                      {formatDate(item.end_date) ?? "—"}{" "}
                      <span className="text-slate-600">|</span>{" "}
                      {countDays(item.start_date, item.end_date) ?? "0"} days
                    </h1>
                    <h3 className="text-slate-500 text-xs ">
                      {item.reason ?? "—"}
                    </h3>
                  </div>
                </div>
                <div className="right-side flex items-center justify-center gap-1">
                  <ReviewLeaveRequestDialog
                    trigger={
                      <Button className="border-green-400 text-green-400 text-xs bg-white hover:bg-green-400 hover:text-white hover:cursor-pointer ">
                        Approved
                      </Button>
                    }
                    leaveRequest={item}
                  />

                  <Button className="border-red-400 text-red-400 text-xs bg-white hover:bg-red-400 hover:text-white hover:cursor-pointer">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
