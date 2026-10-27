import api from "@/lib/api";
import { useEffect, useState } from "react"

interface Roles{
    id: number;
    name:string
}

export default function useRoles(){

    const [roles, setRoles] = useState<Roles[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get("/roles")
            .then((res) => setRoles(res.data.roles))
            .catch((error) => setError(error.response?.data?.message ?? "Failed to load roles"))
            .finally(() => (setLoading(false)));
    }, []);

    return {roles,loading,error}
}