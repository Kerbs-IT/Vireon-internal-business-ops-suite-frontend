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
  manager: Manager | null;
  employee_count?: number;
}

export default function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(() => {
    setLoading(true);
    return api
      .get("/departments")
      .then((res) => setDepartments(res.data.departments))
      .catch((err) =>
        setError(err.response?.data?.message ?? "Failed to load departments")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, refetch: fetchDepartments };
}