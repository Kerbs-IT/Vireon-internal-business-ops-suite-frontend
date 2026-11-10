export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Department {
  id: number;
  name: string;
  manager_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface LeaveUser {
  id: number;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  role_id: number;
  department_id: number | null;
  position: string;
  date_hired: string;
  status: string; // e.g. "active"
  department?: Department | null;
}

export interface LeaveType {
  id: number;
  name: string;
  default_days: number;
  created_at: string;
  updated_at: string;
}

// Dates are ISO strings because that's what Laravel's JSON returns, not Date objects.
export interface TeamLeaveRequestType {
  id: number;
  user_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  approved_by: number | null;
  approved_at: string | null;
  comments: string | null; // the API key is "comments", not "comment"
  created_at: string;
  updated_at: string;
  user: LeaveUser;
  leave_type: LeaveType;
}