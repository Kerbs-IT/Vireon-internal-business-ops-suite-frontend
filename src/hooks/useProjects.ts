import api from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProjectMembers {
  id: number;
  first_name: string;
  last_name: string;
  pivot: { project_id: number; user_id: number };
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  end_date: string;
  created_by: number;
  members: ProjectMembers[];
}

export interface ProjectFilter {
  status: string;
  search: string;
}

const DEFAULT_FILTERS: ProjectFilter = { status: "all", search: "" };

export default function useProjects(filters: ProjectFilter = DEFAULT_FILTERS) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // "all" and empty search are omitted, so axios doesn't send them
  const status = filters.status === "all" ? undefined : filters.status;
  const search = filters.search?.trim() || undefined;

  // only the latest request may update state (avoids out-of-order responses)
  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<Project[]>("/projects", {
        params: { status, search },
      });
      if (id === requestId.current) setProjects(res.data);
    } catch (err: any) {
      if (id === requestId.current) {
        setError(err.response?.data?.message ?? "Unable to fetch project list");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { projects, loading, error, refetch };
}