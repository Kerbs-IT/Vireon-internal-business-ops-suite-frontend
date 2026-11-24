import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface ActivityItem {
  id: number;
  action: string;
  subject_type: "task" | "project" | "leave" | "other";
  subject_id: number;
  subject_label: string;
  created_at: string;
  actor: { id: number; first_name: string; last_name: string } | null;
}

export const useRecentActivity = (limit = 10) =>
  useQuery({
    queryKey: ["activities", "recent", limit],
    queryFn: async () =>
      (await api.get<ActivityItem[]>("/activities", { params: { limit } })).data,
    staleTime: 30_000,
    refetchInterval: 60_000, // the feed stays fresh without a manual refresh
  });