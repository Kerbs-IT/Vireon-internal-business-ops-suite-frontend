import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

interface ProjectMembers{
    id: number;
    first_name: string;
    last_name: string;
    pivot: {project_id:number,user_id:number};
   
}


interface Project{
    id: number;
    name: string;
    description: string;
    status: "active" | "completed" | "on_hold";
    end_date: string;
    created_by: number;
    members: ProjectMembers[];
    
}

export default function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(() => {
        setLoading(true);
        return api.get('/projects')
            .then((res) => setProjects(res.data))
            .catch((err) => setError(err.response?.data?.message ?? "Unable to fetch project list"))
            .finally(() => setLoading(false))
    },[])

    useEffect(() => {
        refetch()
    }, [refetch]);

    return { projects, loading, error, refetch };
}