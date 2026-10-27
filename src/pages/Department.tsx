import DepartmentFormDialog from "@/components/DialogForm/DepartmentFormDialog";
import { Button } from "@/components/ui/button";
import useDepartments from "@/hooks/useDepartments";
import { Building, Building2, Pencil, Plus } from "lucide-react";

export default function Department() {
  const { departments, loading, refetch } = useDepartments();

  return (
    <div className="page ">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-md text-slate-500">
          Manage your organization's structure
        </p>
        <DepartmentFormDialog
          onSuccess={refetch}
          trigger={
            <Button className="bg-linear-to-r from-orange-600 to-orange-400 hover:cursor-pointer">
              <Plus></Plus>
              Add Department
            </Button>
          }
        />
      </div>
      {/* main content */}
      <div className="bg-white w-full rounded-xl shadow-xs">
        <table className="w-full border-collapse ">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide pl-6 py-3">
                Department Name
              </th>
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Manager
              </th>
              <th className="text-start text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Employees
              </th>

              <th className="text-end text-xs font-medium text-slate-400 uppercase tracking-wide pr-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {departments.map((dep) => (
              <tr
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                key={`department-${dep.id}`}
              >
                <td className="px-4 py-3 text-sm text-slate-500">
                  <div className="dep-name flex gap-2 items-center">
                    <div
                      className={`icon inline-block bg-orange-50 text-orange-500 p-2 rounded-lg`}
                    >
                      <Building2 />
                    </div>

                    <h3>{dep.name}</h3>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 capitalize">
                  {dep.manager?.first_name ?? "none"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500  flex items-center justify-start gap-1 ">
                  <h3 className="font-bold text-black text-lg">{dep.employee_count ?? "0"}</h3>
                  people
                </td>
                <td className="pr-6 py-3 text-end">
                  <DepartmentFormDialog
                    department={dep}
                    onSuccess={refetch}
                    trigger={
                      <button className="text-slate-400  hover:text-slate-600">
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
