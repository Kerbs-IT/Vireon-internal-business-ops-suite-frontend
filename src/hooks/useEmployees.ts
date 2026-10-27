import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  role_id: number;
  position: string;
  date_hired: string;
  status: "active" | "inactive";
}

export default function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


   const refetch = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/employees");
      setEmployees(res.data.employees ?? res.data); // adjust to your API's shape
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, []);
    // get the list of employees
    useEffect(() => {
        refetch();
    }, [refetch]);
   
    
    
    return {employees,loading,error,refetch}
}