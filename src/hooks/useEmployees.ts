import api from "@/lib/api";
import type { Employee } from "@/types/employee";
import { useCallback, useEffect, useState } from "react";



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