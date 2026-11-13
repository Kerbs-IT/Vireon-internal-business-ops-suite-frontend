import api from "@/lib/api";
import type { EmployeeTaskOverview } from "@/types/employee";
import type { LeaveByMonth, TeamLeaveRequestType } from "@/types/leave";
import type { SummaryMetric } from "@/types/metric";
import type { ProjectCompletionReport } from "@/types/project";
import type { TasksNeedAttention } from "@/types/task";

import { keepPreviousData, useQuery } from "@tanstack/react-query";


interface MetricCards {
    taskCompleted: number;
    overdueTasks: number;
    pendingLeaveRequest: number;
    leaveDaysTaken: number;
}

type TaskByStatus = {
    'todo': number;
    'in_progress': number;
    'review': number;
    'done': number;
}
export interface ReportFilters {
  days: string;
  project: string;
  department: string;
}


// "All" means "no filter", so we send undefined and axios omits the param
const toParams = (f: ReportFilters) => ({
  days: f.days,
  project_id: f.project === "All" ? undefined : f.project,
  department_id: f.department === "All" ? undefined : f.department,
});

export const useMetricCards = (filters: ReportFilters) => {
  const params = toParams(filters);
  return useQuery({
    queryKey: ["reports", "metric-cards", params],
    queryFn: async () =>
      (await api.get<MetricCards>("/report/metric-card", { params })).data,
    placeholderData: keepPreviousData,
  });
};

// project completion
    
export const useProjectCompletion = (filters: ReportFilters) => {
  const { project_id, department_id } = toParams(filters);
  const params = { project_id, department_id };
  return useQuery({
    queryKey: ["reports", "project-completion", params],
    queryFn: async () =>
      (await api.get<ProjectCompletionReport[]>("/report/project-completion", { params })).data,
    placeholderData: keepPreviousData,
  });
};

export const useTaskByStatus = (filters: ReportFilters) => {
  const { project_id, department_id } = toParams(filters);
  const params = { project_id, department_id };
  return useQuery({
    queryKey: ["reports", "task-by-status", params],
    queryFn: async () =>
      (await api.get<TaskByStatus>("/report/task-by-status", { params })).data,
    placeholderData: keepPreviousData,
  });
};

    // employee with task completed

export const useEmployeeTaskOverview = (filters: ReportFilters) => {
  const { project_id, department_id } = toParams(filters);
  const params = { project_id, department_id };
  return useQuery({
    queryKey: ["reports", "employee-tasks-overview", params],
    queryFn: async () =>
      (await api.get<EmployeeTaskOverview[]>("/report/employee-tasks-overview", { params })).data,
    placeholderData: keepPreviousData,
  });
};


export const useLeaveOverview = (filters: ReportFilters) => {
  const { department_id } = toParams(filters);
  const params = { department_id };
  return useQuery({
    queryKey: ["reports", "leave", params],
    queryFn: async () =>
      (await api.get<TeamLeaveRequestType[]>("/report/leave", { params })).data,
    placeholderData: keepPreviousData,
  });
};

export const useLeaveByMonth = (
  filters: ReportFilters,
  year: number = new Date().getFullYear(),
) =>
  useQuery({
    queryKey: ["reports", "leave-by-month", year, filters.department],
    queryFn: async () =>
      (
        await api.get<LeaveByMonth[]>("/report/leave-by-month", {
          params: { year, department_id: toParams(filters).department_id },
        })
      ).data,
    placeholderData: keepPreviousData,
  });


export const useNeedAttention = (filters: ReportFilters) => {
  const { project_id, department_id } = toParams(filters);
  const params = { project_id, department_id };
  return useQuery({
    queryKey: ["reports", "need-attention", params],
    queryFn: async () =>
      (await api.get<TasksNeedAttention[]>("/report/need-attention", { params })).data,
    placeholderData: keepPreviousData,
  });
};

export const useSummaryMetrics = (filters: ReportFilters) => {
  const { days, project_id, department_id } = toParams(filters);

  return useQuery({
    queryKey: ["reports", "summary-metrics", days, project_id, department_id],
    queryFn: async () =>
      (
        await api.get<SummaryMetric[]>("/report/summary-metrics", {
          params: { days, project_id, department_id },
        })
      ).data,
    placeholderData: keepPreviousData,
  });
};