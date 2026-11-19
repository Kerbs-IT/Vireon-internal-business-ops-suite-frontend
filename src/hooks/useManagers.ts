import api from "@/lib/api";
import type { ManagerOption } from "@/types/employee";
import { useEffect, useState } from "react";



export default function useManagers() {
  const [managers, setManagers] = useState<ManagerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/managers")
      .then((res) => setManagers(res.data.managers))
      .catch((err) =>
        setError(err.response?.data?.message ?? "Failed to load managers"),
      )
      .finally(() => setLoading(false));
  }, []);

  return { managers, loading, error };
}