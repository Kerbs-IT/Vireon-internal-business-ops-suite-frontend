import api from "@/lib/api";
import type { EmployeeTaskOverview } from "@/types/employee";
import type { LeaveByMonth, TeamLeaveRequestType } from "@/types/leave";
import type { SummaryMetric } from "@/types/metric";
import type { ProjectCompletionReport } from "@/types/project";
import type { TasksNeedAttention } from "@/types/task";

import { useQuery } from "@tanstack/react-query";


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




export const useMetricCards = () =>
    useQuery({
        queryKey: ["reports", "metric-cards"],
        queryFn: async () => (await api.get<MetricCards>("/report/metric-card")).data,
    });

// project completion
    
export const useProjectCompletion = () =>
    useQuery({
        queryKey: ["reports", "project-completion"],
        queryFn: async () =>
            (await api.get<ProjectCompletionReport[]>("/report/project-completion")).data,
    });
export const useTaskByStatus = () =>
    useQuery({
         queryKey: ["reports", "task-by-status"],
        queryFn: async () =>
            (await api.get<TaskByStatus>("/report/task-by-status")).data,
    });

    // employee with task completed

export const useEmployeeTaskOverview = () =>
    useQuery({
         queryKey: ["reports", "employee-tasks-overview"],
        queryFn: async () =>
            (await api.get<EmployeeTaskOverview[]>("/report/employee-tasks-overview")).data,
    });

export const useLeaveOverview = () =>
    useQuery({
         queryKey: ["reports", "leave"],
        queryFn: async () =>
            (await api.get<TeamLeaveRequestType[]>("/report/leave")).data,
});

export const useLeaveByMonth = (year?: number) =>
    useQuery({
        queryKey: ["reports", "leave-by-month", year],
        queryFn: async () =>
            (await api.get<LeaveByMonth[]>("/report/leave-by-month", { params: { year } })).data,
    });


export const useNeedAttention = () =>
    useQuery({
        queryKey: ["reports", "need-attention"],
        queryFn: async () =>
            (await api.get<TasksNeedAttention[]>("/report/need-attention")).data,
});

export const useSummaryMetrics = (days: string = "30d") =>
    useQuery({
        queryKey: ["reports", "summary-metrics", days],
        queryFn: async () =>
            (await api.get<SummaryMetric[]>("/report/summary-metrics", { params: { days } })).data,
    });