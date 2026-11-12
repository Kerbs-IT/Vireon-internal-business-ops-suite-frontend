import EmployeeWorkload from "@/components/reportsComponents/EmployeeWorkload";
import FilterSelect from "@/components/reportsComponents/FilterSelect";
import LeaveByMonthChart from "@/components/reportsComponents/LeaveByMonthChart";
import MetricCard from "@/components/reportsComponents/MetricCard";
import ProjectProgress from "@/components/reportsComponents/ProjectProgress";
import StatusBar from "@/components/reportsComponents/StatusBar";
import { Button } from "@/components/ui/button";
import useDepartments from "@/hooks/useDepartments";
import useEmployees from "@/hooks/useEmployees";
import useProjects from "@/hooks/useProjects";
import { useMemo } from "react";
// dummy data

const daysFilter = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  this_month: "This year",
};

const projectFilter = {
  All: "All projects",
  1: "Q1 project",
  2: "Q2 project",
  3: "Q3 project",
};
const departmentFilter = {
  All: "All employees",
};

const leaveByMonth = [
  { month: "Jun", approved: 8, pending: 2, rejected: 1 },
  { month: "Jul", approved: 6, pending: 1, rejected: 0 },
  { month: "Aug", approved: 10, pending: 3, rejected: 1 },
  { month: "Sep", approved: 7, pending: 2, rejected: 1 },
  { month: "Oct", approved: 9, pending: 3, rejected: 0 },
  { month: "Nov", approved: 5, pending: 2, rejected: 1 },
];

// dummy data
import type { Task } from "@/types/task";
import type { Project } from "@/types/project";
import NeedAttention from "@/components/reportsComponents/NeedAttention";
import LeaveRecordItem from "@/components/reportsComponents/LeaveRecordItem";
import SummaryMetricsTable from "@/components/reportsComponents/SummaryMetricsTable";

import {
  useEmployeeTaskOverview,
  useLeaveByMonth,
  useLeaveOverview,
  useMetricCards,
  useNeedAttention,
  useProjectCompletion,
  useSummaryMetrics,
  useTaskByStatus,
} from "@/hooks/useReports";
import { Skeleton } from "@/components/ui/skeleton";




function Reports() {
  const { departments } = useDepartments();
  const {
    data: metricCardData,
    isLoading,
    isError,
    refetch,
  } = useMetricCards();
  const {
    data: statusCounts,
    isLoading: taskByStatusLoading,
    isError: taskByStatusError,
  } = useTaskByStatus();
  const {
    data: employeeTaskOverview = [],
    isLoading: employeeTaskOverviewLoading,
    isError: employeeTaskOverviewError,
  } = useEmployeeTaskOverview();
  const departmentFilter = useMemo<Record<string, string>>(
    () => ({
      All: "All employees",
      ...Object.fromEntries(departments.map((d) => [String(d.id), d.name])),
    }),
    [departments],
  );
  const {
    data: projects = [],
    isLoading: projectCompletionLoading,
    isError: projectCompletionIsError,
  } = useProjectCompletion();

  const { data:leaveThisWeek = [], isLoading: leaveThisWeekLoading, isError: leaveThisWeekError } = useLeaveOverview();
  const {
    data: leaveByMonth = [],
    isLoading: leaveByMonthLoading,
    isError: leaveByMonthError,
  } = useLeaveByMonth();

  const {
    data: needAttention = [],
    isLoading: needAttentionLoading,
    isError: needAttentionError,
  } = useNeedAttention();

  const days = '30d';
  const { data: summaryMetrics = [], isLoading: summaryMetricsLoading } =
    useSummaryMetrics(days);
  return (
    <div className="page">
      <div className="header flex justify-between items-center mb-3">
        <div className="mb-2">
          <h1 className="text-xl mb-1 font-bold">Reports</h1>
          <p className="text-slate-400 text-xs">
            Oct 10 - Nov 9. 2026 - compared with te previous 30 days
          </p>
        </div>
        <div className="mb-2 flex gap-2">
          <FilterSelect list={daysFilter} defaultValue="30d" />
          <FilterSelect list={projectFilter} defaultValue="All" />
          <FilterSelect list={departmentFilter} defaultValue="All" />
          <Button className="p-4.5">Export CSV</Button>
        </div>
      </div>
      <div className="cards grid grid-cols-4 gap-2 mb-2">
        <MetricCard
          label="Tasks completed"
          value={metricCardData?.taskCompleted ?? "-"}
          rating={8}
        />
        <MetricCard
          label="Overdue tasks"
          value={metricCardData?.overdueTasks ?? "-"}
          rating={2}
        />
        <MetricCard
          label="Leave awaiting approval"
          value={metricCardData?.pendingLeaveRequest ?? "-"}
          rating={8}
        />
        <MetricCard
          label="Leave days taken"
          value={metricCardData?.leaveDaysTaken}
          rating={4}
        />
      </div>
      <div className="mb-2 grid grid-col2-1 xl:grid-cols-2 lg:grid-cols-2 gap-2 md:grid-cols-2">
        {/* task completion by project */}
        <div className="flex flex-col gap-2 bg-white min-h-70 p-5 overflow-y-auto rounded-2xl w-full border">
          <h1 className="text-xl font-bold mb-3">Task completion by project</h1>
          {projects &&
            projects.map((project) => (
              <ProjectProgress key={project.id} project={project} />
            ))}
        </div>
        <div className="rounded-2xl border bg-white p-5">
          {taskByStatusLoading ? (
            <div>
              <Skeleton className="w-50 h-5 mb-5" />
              <Skeleton className="w-full h-5 mb-4" />
              <Skeleton className="w-100 h-4" />
            </div>
          ) : (
            <div>
              <h2 className="mb-4 text-[15px] font-semibold">
                Tasks by status
              </h2>
              <StatusBar counts={statusCounts} />
            </div>
          )}
        </div>
      </div>
      <div className="mb-2 grid grid-col2-1 xl:grid-cols-2 lg:grid-cols-2 gap-2 md:grid-cols-2">
        {employeeTaskOverviewLoading ? (
          <div className="flex flex-col gap-2 bg-white min-h-50  p-5 overflow-y-auto rounded-2xl w-full border ">
            <Skeleton className="h-4 w-90 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mb-2">
                <div className="mb-2 flex justify-between">
                  <Skeleton className="h-3 w-50 mb-2" />
                  <Skeleton className="h-3 w-20 mb-2" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 bg-white min-h-50  p-5 overflow-y-auto rounded-2xl w-full border ">
            <h1 className="text-xl font-bold mb-3">Wordload by employee</h1>
            {employeeTaskOverviewLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              employeeTaskOverview
                .slice(0, 4)
                .map((employee) => (
                  <EmployeeWorkload key={employee.id} employee={employee} />
                ))
            )}
          </div>
        )}
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-[15px] font-semibold">
            Leave Request by Month
          </h2>

          {leaveByMonthLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : leaveByMonthError ? (
            <p className="py-24 text-center text-sm text-red-500">
              Unable to load leave data.
            </p>
          ) : (
            <LeaveByMonthChart data={leaveByMonth} />
          )}
        </div>
      </div>
      {/* needs attention */}
      <div className="mb-2 grid grid-col2-1 xl:grid-cols-2 lg:grid-cols-2 gap-2  md:grid-cols-2">
        <div className="left bg-white min-h-50 p-5 overflow-y-auto rounded-2xl w-full border">
          <h1 className="font-bold mb-2 text-xl border-b-2 border-slate-300">
            Needs Attention
          </h1>

          {needAttentionLoading ? (
            <div className="space-y-4 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : needAttentionError ? (
            <p className="py-10 text-center text-sm text-red-500">
              Unable to load tasks.
            </p>
          ) : needAttention.length > 0 ? (
            needAttention.map((task) => (
              <NeedAttention key={task.id} task={task} days={3} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">
              No tasks need attention
            </p>
          )}
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Who is out this week</h2>
          {leaveThisWeekLoading ? (
            <ul className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </li>
              ))}
            </ul>
          ) : leaveThisWeek.length > 0 ? (
            <ul className="space-y-5">
              {leaveThisWeek.map((leave) => (
                <LeaveRecordItem key={leave.id} record={leave} />
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center py-25 text-center text-sm text-slate-400">
              There's no employee on leave this week
            </div>
          )}
        </div>
      </div>
      <div className="mb-2 w-full">
        <SummaryMetricsTable
          metrics={summaryMetrics}
          loading={summaryMetricsLoading}
          changeHeader={`vs previous ${days.replace("d", "")} days`}
        />
      </div>
    </div>
  );
}

export default Reports;
