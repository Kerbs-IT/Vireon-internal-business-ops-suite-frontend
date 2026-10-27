import api from "@/lib/api";
import { useEffect, useState } from "react";

interface ManagerOption {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
}

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