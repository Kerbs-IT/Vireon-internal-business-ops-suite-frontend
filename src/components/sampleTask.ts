export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  text: string;
  created_at: string;
  user: Employee;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assigned_to: number;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  due_date: string; // Laravel sends dates as strings
  progress: number;
  created_at: string;
  updated_at: string;
  assignee: Employee | null; // from ->with('assignee')
  comments: TaskComment[]; // from ->with('comments.user')
}

const ana: Employee = { id: 1, first_name: "Ana", last_name: "Reyes", position: "Product Designer" };
const mika: Employee = { id: 2, first_name: "Mika", last_name: "Kato", position: "Senior Developer" };
const james: Employee = { id: 3, first_name: "James", last_name: "Lee", position: "Backend Engineer" };
const sofia: Employee = { id: 4, first_name: "Sofia", last_name: "Santos", position: "DevOps Engineer" };

export const tasks: Task[] = [
  {
    id: 1,
    project_id: 1,
    title: "Finalize mockups",
    description: "Wrap up the last round of dashboard mockups and export them for developer handoff.",
    assigned_to: 1,
    status: "todo",
    priority: "high",
    due_date: "2026-11-18",
    progress: 0,
    created_at: "2026-11-01T08:00:00.000000Z",
    updated_at: "2026-11-01T08:00:00.000000Z",
    assignee: ana,
    comments: [
      {
        id: 4,
        task_id: 1,
        user_id: 2,
        text: "Looks good so far. Please add the dark mode variants before handoff.",
        created_at: "2026-11-03T14:00:00.000000Z",
        user: mika,
      },
    ],
  },
  {
    id: 2,
    project_id: 1,
    title: "Competitor analysis",
    description: "Compare the analytics features of three competing products and summarize the gaps.",
    assigned_to: 2,
    status: "todo",
    priority: "medium",
    due_date: "2026-11-19",
    progress: 0,
    created_at: "2026-11-01T08:00:00.000000Z",
    updated_at: "2026-11-01T08:00:00.000000Z",
    assignee: mika,
    comments: [],
  },
  {
    id: 3,
    project_id: 1,
    title: "Stakeholder brief",
    description: "Prepare a one-page brief for stakeholders covering scope, timeline, and risks.",
    assigned_to: 3,
    status: "todo",
    priority: "low",
    due_date: "2026-11-21",
    progress: 0,
    created_at: "2026-11-01T08:00:00.000000Z",
    updated_at: "2026-11-01T08:00:00.000000Z",
    assignee: james,
    comments: [],
  },
  {
    id: 4,
    project_id: 1,
    title: "API integration",
    description:
      "Integrate the new analytics API with proper error handling and rate limiting. Coordinate with the backend team for endpoint documentation.",
    assigned_to: 2,
    status: "in_progress",
    priority: "high",
    due_date: "2026-11-20",
    progress: 65,
    created_at: "2026-11-01T08:00:00.000000Z",
    updated_at: "2026-11-04T09:30:00.000000Z",
    assignee: mika,
    comments: [
      {
        id: 1,
        task_id: 4,
        user_id: 1,
        text: "Backend team confirmed the new endpoints are ready for staging. Let's prioritize the error handling patterns first.",
        created_at: "2026-11-04T08:00:00.000000Z",
        user: ana,
      },
      {
        id: 2,
        task_id: 4,
        user_id: 2,
        text: "On it. I'll set up the retry logic with exponential backoff. Should have a draft by EOD.",
        created_at: "2026-11-04T09:00:00.000000Z",
        user: mika,
      },
      {
        id: 3,
        task_id: 4,
        user_id: 3,
        text: "Can we include the batch endpoint too? The marketing team needs bulk export functionality.",
        created_at: "2026-11-04T09:30:00.000000Z",
        user: james,
      },
    ],
  },
  {
    id: 5,
    project_id: 1,
    title: "Design system tokens",
    description: "Define color, spacing, and typography tokens and publish them to the shared library.",
    assigned_to: 1,
    status: "in_progress",
    priority: "medium",
    due_date: "2026-11-22",
    progress: 40,
    created_at: "2026-11-01T08:00:00.000000Z",
    updated_at: "2026-11-03T10:00:00.000000Z",
    assignee: ana,
    comments: [],
  },
  {
    id: 6,
    project_id: 1,
    title: "Copy review",
    description: "Review all interface text for tone and consistency.",
    assigned_to: 1,
    status: "review",
    priority: "medium",
    due_date: "2026-11-02", // overdue, to test your overdue styling
    progress: 80,
    created_at: "2026-10-28T08:00:00.000000Z",
    updated_at: "2026-11-02T10:00:00.000000Z",
    assignee: ana,
    comments: [],
  },
  {
    id: 7,
    project_id: 1,
    title: "User research",
    description: "Interview five users about how they use the current dashboard.",
    assigned_to: 4,
    status: "done",
    priority: "low",
    due_date: "2026-11-05",
    progress: 100,
    created_at: "2026-10-20T08:00:00.000000Z",
    updated_at: "2026-11-01T10:00:00.000000Z",
    assignee: sofia,
    comments: [],
  },
  {
    id: 8,
    project_id: 1,
    title: "Tech spec",
    description: "Write the technical specification for the new dashboard architecture.",
    assigned_to: 3,
    status: "done",
    priority: "high",
    due_date: "2026-11-06",
    progress: 100,
    created_at: "2026-10-20T08:00:00.000000Z",
    updated_at: "2026-11-02T10:00:00.000000Z",
    assignee: james,
    comments: [],
  },
];