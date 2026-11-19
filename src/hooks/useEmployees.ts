import api from "@/lib/api";
import type { Employee } from "@/types/employee";
import { useCallback, useEffect, useRef, useState } from "react";

export interface EmployeeFilter {
  department: string; // department id, or "all"
  search: string;
  status: string;
}

const DEFAULT_FILTERS: EmployeeFilter = { department: "all", search: "", status : 'active' };

export default function useEmployees(filters: EmployeeFilter = DEFAULT_FILTERS) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // "all" and empty search are omitted, so axios doesn't send them
  const department = filters.department === "all" ? undefined : filters.department;
  const search = filters.search?.trim() || undefined;
  const status = filters.status || undefined;

  // only the latest request may update state
  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/employees", { params: { department, search,status } });
      if (id === requestId.current) {
        setEmployees(res.data.employees ?? res.data);
      }
    } catch (e: any) {
      if (id === requestId.current) {
        setError(e.response?.data?.message ?? "Failed to load employees.");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [department, search,status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { employees, loading, error, refetch };
}