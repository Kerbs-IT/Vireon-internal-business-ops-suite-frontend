export interface department {
  id: number;
  name: string;
  'manager_id':number
}
export interface role{
   id: number;
  name: string;
}

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
  department?: department | undefined;
  role?: role | undefined;
}

export interface EmployeeTaskOverview extends Employee {
  total_tasks_count: number;
  completed_tasks_count: number;
  overdue_tasks_count: number;
}

export type ManagerOption = Pick<Employee, "id" | "first_name" | "last_name"> & {
  position?: string;
};