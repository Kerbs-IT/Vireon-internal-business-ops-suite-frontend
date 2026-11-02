import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

interface TeamLeaveRequestType {
    user_id: number;
    leave_type_id: number;
    start_date: Date;
    end_date: Date;
    reason: string;
    status: string;
    approved_by: number;
    approved_at: Date;
    comment: string;
}

export function useTeamLeaveRequest() {
    const [teamLeaveRequests, setTeamLeaveRequests] = useState<TeamLeaveRequestType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const refetch = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/team-leave-requests');
            setTeamLeaveRequests(res.data);
        } catch (e : any) {
            setError(e.response.data?.message ?? "Failed to load the team leave requests.");
        } finally {
            setLoading(false);
        }
    },[]);

    // useEFfect for refetching if there is call or changes
    useEffect(() => {
        refetch();
    }, [refetch]);
    
    return { teamLeaveRequests, loading, error, refetch };
}