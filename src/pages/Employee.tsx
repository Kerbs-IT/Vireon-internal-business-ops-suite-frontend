import EmployeeFormDialog from "@/components/DialogForm/EmployeeFormDialog";
import AddEmployee from "@/components/DialogForm/EmployeeFormDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useDepartments from "@/hooks/useDepartments";
import useEmployees from "@/hooks/useEmployees";
import useRoles from "@/hooks/useRoles";
import { Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";

interface DepartmentType {
  value: number;
  label: string;
}


export default function Employee() {
  const { departments, loading, error } = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    "all-department",
  );
  const {
    employees,
    refetch,
    loading: employeesLoading,
    error: employeesError,
  } = useEmployees();

  // fetch the roles here and remove the other fetch in the form to lessen the time consumed which affect the speed of the app
  const { roles } = useRoles();

  const departmentItems: DepartmentType[] = departments.map((item) => ({
    value: item.id,
    label: item.name,
  }));

   const roleItems = roles.map((item) => ({
     value: item.id,
     label: item.name,
   }));


  return (
    <div className="employee-page p-4">
      <div className="mb-2 filter-con flex justify-between">
        <div className="left-side grid grid-cols-1 xl:grid-cols-2 gap-2 w-2/4">
          <div className="search relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="search-bar"
              placeholder="Search by name or email.."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 "
            />
          </div>
          <div className="departments-dropdown">
            <Select
              items={departmentItems}
              onValueChange={setSelectedDepartment}
              value={selectedDepartment ?? ""}
            >
              <SelectTrigger
                id="checkout-exp-month-ts6"
                className="p-4.5 bg-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem key="all-department" value="All-Department">
                    All Department
                  </SelectItem>
                  {departmentItems.map((item) => (
                    <SelectItem
                      key={`${item.value}-department`}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="right-side">
          <EmployeeFormDialog
            onSuccess={refetch}
            trigger={
              <Button className="bg-linear-to-r from-orange-600 to-orange-400 hover:cursor-pointer">
                <Plus></Plus>
                Add Employee
              </Button>
            }
            departmentItems={departmentItems}
            roleItems={roleItems}
          />
        </div>
      </div>
      {/* main content the employees table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse ">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide pl-6 py-3">
                Name
              </th>
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Email
              </th>
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Department
              </th>
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Position
              </th>
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Status
              </th>
              <th className="text-end text-xs font-medium text-slate-400 uppercase tracking-wide pr-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {/* add skeletong loading here */}
            {
               employeesLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="pl-6 py-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-7 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                <td className="pr-6 py-3 text-end"><Skeleton className="ml-auto size-4" /></td>
              </tr>
            ))
          ) : employeesError ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-red-500">
                {employeesError}
              </td>
            </tr>
          ) : employees.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                No employees found.
              </td>
            </tr>
          ) :
              
             ( employees.map((emp) => (
              <tr
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                key={`employee-${emp.id}`}
              >
                <td className="pl-6 py-3">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-medium bg-red-400`}
                    >
                      {emp.first_name
                        ? `${emp.first_name.charAt(0)} ${emp.last_name ? emp.last_name.charAt(0) : ""}`
                        : "Guest"}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {emp.first_name
                        ? `${emp.first_name} ${emp.last_name?.charAt(0) ? `${emp.last_name?.charAt(0)}.` : ""}`
                        : "Guest"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {emp.email}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 capitalize">
                  {emp.department?.name ?? "none"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 capitalize">
                  {emp.role?.name ?? "none"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium  ${
                      emp.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="pr-6 py-3 text-end">
                  <EmployeeFormDialog
                    employee={emp}
                    onSuccess={refetch}
                    trigger={
                      <button className="text-slate-400  hover:text-slate-600">
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                    }
                    departmentItems={departmentItems}
                    roleItems={roleItems}
                  />
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
