import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Calendar, CircleAlert, FolderKanban, Users2 } from "lucide-react";
import TaskStatusBar from "@/components/DashboardComponents/TaskStatusBar";
import { LeaveUsageChart } from "@/components/DashboardComponents/LeaveUsageChart";
import RecentActivity from "@/components/DashboardComponents/RecentActivity";
import { useDashboardCharts } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface statCard{
    icon: React.ReactNode;
    label: string;
    value?: number;
    color: string;
}

const colorMap: Record<string, string> = {
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
};



function Dashboard() {
    const auth = useContext(AuthContext);
    const userName = auth?.user ? (`${auth?.user?.first_name} ${auth?.user?.last_name.charAt(0)}.`) : 'Guest';
    const { data, isLoading, isError } = useDashboardCharts();

    const statItems: statCard[] = [
      {
        icon: <Calendar />,
        label: "Pending Leave",
        value: data?.stats.pendingLeave ?? 0,
        color: "orange",
      },
      {
        icon: <CircleAlert />,
        label: "Overdue Task",
        value: data?.stats.overdueTasks ?? 0,
        color: "orange",
      },
      {
        icon: <FolderKanban />,
        label: "Active Projects",
        value: data?.stats.activeProjects ?? 0,
        color: "blue",
      },
      {
        icon: <Users2 />,
        label: "Team Members",
        value: data?.stats.teamMembers ?? 0,
        color: "green",
      },
    ];
    // console.log(auth.user);
    return (
      <>
        <div className="page flex flex-1 flex-col">
          <div className="top-part bg-linear-to-r from-orange-100 to-blue-100 p-4 rounded-2xl mb-3">
            <h3 className="font-bold  italic text-orange-800">Good morning</h3>
            <h1 className="font-bold text-2xl 3xl">{userName}</h1>
            <p className="text-gray-500 font-sm">
              You have (3) pending works and 2 tasks due today.
            </p>
          </div>
          <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="stat-item-con shadow bg-white p-4 rounded-2xl"
              >
                <div
                  className={`icon inline-block ${colorMap[item.color]} p-2 rounded-lg`}
                >
                  {item.icon}
                </div>

                {isLoading ? (
                  <Skeleton className="my-2 h-7 w-12" />
                ) : (
                  <h2 className="font-bold text-2xl">
                    {isError ? "-" : item.value}
                  </h2>
                )}

                <h4 className="text-gray-400 text-sm">{item.label}</h4>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 mb-2">
            {isLoading ? (
              <>
                <Skeleton className="h-64 rounded-2xl bg-white" />
                <Skeleton className="h-64 rounded-2xl bg-white" />
              </>
            ) : isError || !data ? (
              <p className="col-span-full py-10 text-center text-sm text-red-500">
                Unable to load charts.
              </p>
            ) : (
              <>
                <TaskStatusBar counts={data.tasksByStatus} />
                <LeaveUsageChart usage={data.leaveUsage} />
              </>
            )}
          </div>
          <div className="w-full rounded-md bg-white">
            <RecentActivity />
          </div>
        </div>
      </>
    );
}

export default Dashboard;