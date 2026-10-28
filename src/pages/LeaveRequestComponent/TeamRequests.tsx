import RequestLeaveFormDialog from "@/components/DialogForm/RequestLeaveFormDialog";
import ReviewLeaveRequestDialog from "@/components/DialogForm/ReviewLeaveRequestDIalog";
import { Button } from "@/components/ui/button";

const leaveReuest = [
  {
    id: 1,

    leave_type: "vacation",
    start_date: "Mar 25, 2026",
    end_date: "Mar 28, 2026",
    duration: 4,
    reason: "Family trip to Colorado",
    user: {
      id: 1,
      first_name: "James",
      last_name: "Lourdes",
      email: "james@gmail.com",
      role_id: 1,
      department_id: 1,
      position: "Software Engineer",
    },
  },
  {
    id: 2,

    leave_type: "Sick",
    start_date: "Jan 25, 2026",
    end_date: "Jan 28, 2026",
    duration: 4,
    reason: "Doctor Appointment",
    user: {
      first_name: "Andrew",
      last_name: "Mendoza",
      email: "james@gmail.com",
      role_id: 1,
      department_id: 1,
      position: "Software Engineer",
    },
  },
  {
    id: 3,
    first_name: "Marie",
    last_name: "Garcia",
    leave_type: "Personal",
    start_date: "Jan 25, 2026",
    end_date: "Jan 28, 2026",
    duration: 4,
    reason: "Moving day",
    user: {
      first_name: "Marie",
      last_name: "Garcia",
      email: "james@gmail.com",
      role_id: 1,
      department_id: 1,
      position: "Software Engineer",
    },
  },
];

export default function TeamRequests() {
  return (
    <div className="page">
      <div className="header-part flex items-center justify-between mt-5">
        <p className="text-slate-500 text-sm">
          Pending approvals from your team
        </p>
        <span className="bg-orange-200 text-orange-600 rounded-lg py-1 px-2 text-xs text-center">
          3 pending
        </span>
      </div>
      {/* main content */}
      <div className="main-content flex flex-col gap-1">
        {leaveReuest.map((item) => (
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
                  {item.leave_type ?? "none"}{" "}
                  <span className="text-slate-600">|</span>{" "}
                  {item.start_date ?? "—"} - {item.end_date ?? "—"}{" "}
                  <span className="text-slate-600">|</span>{" "}
                  {item.duration ?? "0"} days
                </h1>
                <h3 className="text-slate-500 text-xs ">
                  {item.reason ?? "—"}
                </h3>
              </div>
            </div>
            <div className="right-side flex items-center justify-center gap-1">
              <ReviewLeaveRequestDialog
                trigger={
                 ( <Button className="border-green-400 text-green-400 text-xs bg-white hover:bg-green-400 hover:text-white hover:cursor-pointer ">
                    Approved
                  </Button>)
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
