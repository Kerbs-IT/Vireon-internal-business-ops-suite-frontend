export interface ProjectMembers {
  id: number;
  first_name: string;
  last_name: string;
  pivot: { project_id: number; user_id: number };
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  end_date: string;
  created_by: number;
  members: ProjectMembers[];
}