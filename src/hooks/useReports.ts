import api from "@/lib/api";

import { useQuery } from "@tanstack/react-query";


interface MetricCards {
    taskCompleted: number;
    overdueTasks: number;
    pendingLeaveRequest: number;
    leaveDaysTaken: number;
}

export const useMetricCards = () =>
    useQuery({
        queryKey: ["reports", "metric-cards"],
        queryFn: async () => (await api.get<MetricCards>("/report/metric-card")).data,
    });

