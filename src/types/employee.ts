export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  role_id: number;
  position: string;
  date_hired: string;
  status: "active" | "inactive";
}

export interface EmployeeTaskOverview extends Employee {
  total_tasks_count: number;
  completed_tasks_count: number;
  overdue_tasks_count: number;
}