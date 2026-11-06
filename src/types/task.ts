export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
}

export type TaskComment = {
  id: number;
  task_id: number;
  user_id: number;
  comments: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    position?: string;
  };
};

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assigned_to: number;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  due_date: string;
  progress?: number; // optional until the backend sends it
  created_at: string;
  updated_at: string;
  assignee: Employee | null;
  comments: TaskComment[];
}