// src/hooks/useDepartments.ts
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

interface Manager {
  id: number;
  first_name: string;
  last_name: string;
}

interface Department {
  id: number;
  name: string;
  manager_id: number;
  manager: Manager | null;
  employee_count?: number;
}
interface DepartmentFilter{
  archived: boolean;
}

const DEFAULT_FILTERS: DepartmentFilter = {archived: false };

export default function useDepartments(filters:DepartmentFilter = DEFAULT_FILTERS) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const archived = filters.archived ? 1 : undefined; 

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    return api
      .get("/departments",{params:{archived}})
      .then((res) => setDepartments(res.data.departments))
      .catch((err) =>
        setError(err.response?.data?.message ?? "Failed to load departments")
      )
      .finally(() => setLoading(false));
  }, [archived]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, refetch: fetchDepartments };
}