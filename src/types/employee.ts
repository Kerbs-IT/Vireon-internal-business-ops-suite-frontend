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