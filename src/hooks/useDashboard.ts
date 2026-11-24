import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface DashboardCharts {
  year: number;
  stats: {
    pendingLeave: number;
    overdueTasks: number;
    activeProjects: number;
    teamMembers: number;
  };
  tasksByStatus: { todo: number; in_progress: number; review: number; done: number };
  leaveUsage: { name: string; days: number }[];
}

export const useDashboardCharts = (year?: number) =>
  useQuery({
    queryKey: ["dashboard", "charts", year ?? "current"],
    queryFn: async () =>
      (await api.get<DashboardCharts>("/dashboard", { params: { year } })).data,
    staleTime: 60_000,
  });