import api from "@/lib/api";
import type { Task } from "@/types/task";
import { useCallback, useEffect, useState } from "react";

export default function useProjectTask(id:number) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const refetch = useCallback(async () => {
        setLoading(true);
        api.get(`/projects/${id}/tasks`)
            .then((res) => setTasks(res.data))
            .catch((err) => setError(err.response?.data?.message ?? "Unable to fetch project tasks"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refetch()
    },[refetch])


    return { tasks, loading, error, refetch };

}