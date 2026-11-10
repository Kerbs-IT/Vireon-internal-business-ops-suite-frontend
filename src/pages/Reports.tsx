import EmployeeWorkload from "@/components/reportsComponents/EmployeeWorkload";
import FilterSelect from "@/components/reportsComponents/FilterSelect";
import LeaveByMonthChart from "@/components/reportsComponents/LeaveByMonthChart";
import MetricCard from "@/components/reportsComponents/MetricCard";
import ProjectProgress from "@/components/reportsComponents/ProjectProgress";
import StatusBar from "@/components/reportsComponents/StatusBar";
import { Button } from "@/components/ui/button";
import useDepartments from "@/hooks/useDepartments";
import useEmployees from "@/hooks/useEmployees";
import useProjects from "@/hooks/useProjects";
import { useMemo } from "react";
// dummy data
import { dummyLeaves } from "@/data/dummyLeaves";

const daysFilter = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  this_month: "This year",
};

const projectFilter = {
  All: "All projects",
  1: "Q1 project",
  2: "Q2 project",
  3: "Q3 project",
};
const departmentFilter = {
  All: "All employees",
};
const statusCounts = {
  todo: 12,
  in_progress: 11,
  review: 7,
  done: 9,
};
const leaveByMonth = [
  { month: "Jun", approved: 8, pending: 2, rejected: 1 },
  { month: "Jul", approved: 6, pending: 1, rejected: 0 },
  { month: "Aug", approved: 10, pending: 3, rejected: 1 },
  { month: "Sep", approved: 7, pending: 2, rejected: 1 },
  { month: "Oct", approved: 9, pending: 3, rejected: 0 },
  { month: "Nov", approved: 5, pending: 2, rejected: 1 },
];

// dummy data
import type { Task } from "@/types/task";
import type { Project } from "@/types/project";
import NeedAttention from "@/components/reportsComponents/NeedAttention";
import LeaveRecordItem from "@/components/reportsComponents/LeaveRecordItem";
import SummaryMetricsTable from "@/components/reportsComponents/SummaryMetricsTable";
import { dummyMetrics } from "@/data/dummyMetrics";

const projects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Revamp the company website",
    status: "active",
    end_date: "2026-12-15",
    created_by: 1,
    members: [], // fill in once you share the ProjectMembers type
  },
  {
    id: 2,
    name: "Mobile App Launch",
    description: "Ship v1 of the mobile app",
    status: "on_hold",
    end_date: "2027-01-30",
    created_by: 1,
    members: [],
  },
];

const employees = [
  {
    id: 1,
    first_name: "Maria",
    last_name: "Santos",
    position: "Project Manager",
  },
  {
    id: 2,
    first_name: "Juan",
    last_name: "Dela Cruz",
    position: "Backend Developer",
  },
  {
    id: 3,
    first_name: "Ana",
    last_name: "Reyes",
    position: "Frontend Developer",
  },
];

export const dummyTasks: Task[] = [
  {
    id: 1,
    project_id: 1,
    project: projects[0],
    title: "Design homepage mockup",
    description: "Create a Figma mockup for the new homepage layout.",
    assigned_to: 3,
    status: "done",
    priority: "high",
    due_date: "2026-11-05",
    progress: 100,
    created_at: "2026-10-20T08:00:00Z",
    updated_at: "2026-11-04T14:30:00Z",
    assignee: employees[2],
    comments: [
      {
        id: 1,
        task_id: 1,
        user_id: 1,
        comments: "Looks great, approved!",
        created_at: "2026-11-04T15:00:00Z",
        user: {
          id: 1,
          first_name: "Maria",
          last_name: "Santos",
          position: "Project Manager",
        },
      },
    ],
  },
  {
    id: 2,
    project_id: 1,
    project: projects[0],
    title: "Build REST API for products",
    description: "Implement CRUD endpoints with validation and pagination.",
    assigned_to: 2,
    status: "in_progress",
    priority: "high",
    due_date: "2026-11-20",
    progress: 60,
    created_at: "2026-10-25T09:15:00Z",
    updated_at: "2026-11-08T10:00:00Z",
    assignee: employees[1],
    comments: [
      {
        id: 2,
        task_id: 2,
        user_id: 2,
        comments: "Index and show endpoints are done, working on store/update.",
        created_at: "2026-11-08T10:05:00Z",
        user: {
          id: 2,
          first_name: "Juan",
          last_name: "Dela Cruz",
          position: "Backend Developer",
        },
      },
      {
        id: 3,
        task_id: 2,
        user_id: 1,
        comments: "Please add rate limiting too.",
        created_at: "2026-11-08T11:20:00Z",
        user: {
          id: 1,
          first_name: "Maria",
          last_name: "Santos",
          position: "Project Manager",
        },
      },
    ],
  },
  {
    id: 3,
    project_id: 1,
    project: projects[0],
    title: "Implement responsive navbar",
    description: "Build navbar with mobile hamburger menu using Tailwind.",
    assigned_to: 3,
    status: "review",
    priority: "medium",
    due_date: "2026-11-12",
    progress: 90,
    created_at: "2026-10-28T13:00:00Z",
    updated_at: "2026-11-09T16:45:00Z",
    assignee: employees[2],
    comments: [],
  },
  {
    id: 4,
    project_id: 2,
    project: projects[1],
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated tests and deployment.",
    assigned_to: 2,
    status: "todo",
    priority: "low",
    due_date: "2026-12-01",
    progress: 0,
    created_at: "2026-11-01T07:30:00Z",
    updated_at: "2026-11-01T07:30:00Z",
    assignee: employees[1],
    comments: [],
  },
];

function Reports() {
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const departmentFilter = useMemo<Record<string, string>>(
    () => ({
      All: "All employees",
      ...Object.fromEntries(departments.map((d) => [String(d.id), d.name])),
    }),
    [departments],
  );
  const { projects } = useProjects();
  return (
    <div className="page">
      <div className="header flex justify-between items-center mb-3">
        <div className="mb-2">
          <h1 className="text-xl mb-1 font-bold">Reports</h1>
          <p className="text-slate-400 text-xs">
            Oct 10 - Nov 9. 2026 - compared with te previous 30 days
          </p>
        </div>
        <div className="mb-2 flex gap-2">
          <FilterSelect list={daysFilter} defaultValue="30d" />
          <FilterSelect list={projectFilter} defaultValue="All" />
          <FilterSelect list={departmentFilter} defaultValue="All" />
          <Button className="p-4.5">Export CSV</Button>
        </div>
      </div>
      <div className="cards grid grid-cols-4 gap-2 mb-2">
        <MetricCard label="Tasks completed" value={150} rating={8} />
        <MetricCard label="Overdue tasks" value={6} rating={2} />
        <MetricCard label="Leave awaiting approval" value={4} rating={8} />
        <MetricCard label="Leave days taken" value={23} rating={4} />
      </div>
      <div className="mb-2 grid grid-col2-1 xl:grid-cols-2 lg:grid-cols-2 gap-2 md:grid-cols-2">
        {/* task completion by project */}
        <div className="flex flex-col gap-2 bg-white min-h-70 p-5 overflow-y-auto rounded-2xl w-full border">
          <h1 className="text-xl font-bold mb-3">Task completion by project</h1>
          {projects &&
            projects.map((project) => (
              <ProjectProgress project={project} value={20} />
            ))}
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-[15px] font-semibold">Tasks by status</h2>
          <StatusBar counts={statusCounts} />
        </div>
      </div>
      <div
        className="mb-2 grid grid-col2-1 xl:grid-cols-2 lg:grid-cols-2 gap-2 md:grid-cols-2"
        md:grid-cols-2
      >
        <div className="flex flex-col gap-2 bg-white min-h-50  p-5 overflow-y-auto rounded-2xl w-full border ">
          {employees.slice(0, 4).map((employee) => (
            <EmployeeWorkload employee={employee} value={3} />
          ))}
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-[15px] font-semibold">
            Leave Request by Month
          </h2>
          <LeaveByMonthChart data={leaveByMonth} />
        </div>
      </div>
      {/* needs attention */}
      <div className="mb-2 grid grid-col2-1 xl:grid-cols-2 lg:grid-cols-2 gap-2  md:grid-cols-2">
        <div className="left bg-white min-h-50  p-5 overflow-y-auto rounded-2xl w-full border">
          <h1 className="font-bold mb-2 text-xl border-b-2 border-slate-300">
            Needs Attention
          </h1>
          {dummyTasks.map((task) => (
            <NeedAttention task={task} days={3} />
          ))}
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Who is out this week</h2>
          <ul className="space-y-5">
            {dummyLeaves.map((leave) => (
              <LeaveRecordItem key={leave.id} record={leave} />
            ))}
          </ul>
        </div>
          </div>
          <div className="mb-2 w-full">
              <SummaryMetricsTable metrics={dummyMetrics}/>
          </div>
    </div>
  );
}

export default Reports;
