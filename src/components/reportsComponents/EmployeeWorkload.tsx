import { Progress, ProgressLabel, ProgressValue } from "../ui/progress";
import type { EmployeeTaskOverview } from "@/types/employee";

interface EmployeeWorkloadProps {
  employee: EmployeeTaskOverview;
}

function EmployeeWorkload({ employee }: EmployeeWorkloadProps) {
  const fullName =
    `${employee.first_name ?? ""} ${employee.last_name?.charAt(0) ?? ""}`.trim() ||
    "Unknown";

  const done = employee.completed_tasks_count;
  const total = employee.total_tasks_count;
  const overdue = employee.overdue_tasks_count;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Progress value={percentage} className="mb-3 w-full">
      <ProgressLabel className="capitalize flex gap-2 items-center">
        <span className="text-black text-sm">{fullName}</span>
        <span className="text-xs text-slate-500">
          {employee.position ?? ""}
        </span>
      </ProgressLabel>
      <ProgressValue className="text-slate-600">
        {() => `${done}/${total} · ${overdue} overdue`}
      </ProgressValue>
    </Progress>
  );
}

export default EmployeeWorkload;
