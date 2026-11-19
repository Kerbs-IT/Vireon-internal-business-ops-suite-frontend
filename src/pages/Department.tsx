import ArchiveToggle, {
  ConfirmRestoreDialog,
} from "@/components/ArchiveToggle";
import DepartmentFormDialog from "@/components/DialogForm/DepartmentFormDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import useDepartments from "@/hooks/useDepartments";
import useManagers from "@/hooks/useManagers";
import api from "@/lib/api";
import type { Department } from "@/types/leave";
import { Building, Building2, Pencil, Plus } from "lucide-react";
import { useState } from "react";

interface DepartmentFilter {
  archived: boolean;
}

export default function Department() {
  // for filters
  const [filters, setFilters] = useState<DepartmentFilter>({
    archived: false,
  });
  const { departments, loading, refetch, error } = useDepartments({
    archived: filters.archived,
  });
  const { managers } = useManagers();

  const [restoreTarget, setRestoreTarget] = useState<Department | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const openRestore = (department: Department) => {
    setRestoreError(null);
    setRestoreTarget(department);
  };

  //  function to handle the restore of th department
  const handleRestore = async () => {
    if (!restoreTarget) return;

    setRestoring(true);
    setRestoreError(null);
    try {
      await api.patch(`/departments/${restoreTarget.id}/restore`);

      toast.add({
        type: "success",
        description: `${restoreTarget.name} restored successfully`,
      });
      setRestoreTarget(null); // close the dialog
      refetch(); // the restored department leaves the Archived list
    } catch (err: any) {
      setRestoreError(
        err.response?.data?.message ?? "Unable to restore the department.",
      );
    } finally {
      setRestoring(false);
    }
  };
  return (
    <div className="page ">
      <div className="mb-2">
        <p className="text-md text-slate-500 mb-1">
          Manage your organization's structure
        </p>
        <div className="flex items-center justify-between w-full">
          <ArchiveToggle
            value={filters.archived}
            onChange={(v) => setFilters((prev) => ({ ...prev, archived: v }))}
          />
          <DepartmentFormDialog
            onSuccess={refetch}
            managers={managers}
            trigger={
              <Button className="bg-linear-to-r from-orange-600 to-orange-400 hover:cursor-pointer">
                <Plus></Plus>
                Add Department
              </Button>
            }
          />
        </div>
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
            {/* add skeleton loading */}
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  key={i}
                >
                  <td className="px-4 py-3">
                    <div className="dep-name flex gap-2 items-center">
                      <div className={`inline-block p-2 rounded-lg`}>
                        <Skeleton className="h-10 w-10 bg-slate-200" />
                      </div>

                      <Skeleton className="h-4 w-40 bg-slate-200" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20 bg-slate-200" />
                  </td>
                  <td className="px-4 py-3 ">
                    <Skeleton className="h-4 w-20 bg-slate-200" />
                  </td>
                  <td className="pr-6 py-3 text-end">
                    <Skeleton className="ml-auto size-5 bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-sm text-slate-400"
                >
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((dep) => (
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
                  <td className="px-4 py-3 text-sm text-slate-500">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-black text-lg leading-none">
                        {dep.employee_count ?? 0}
                      </span>
                      <span>people</span>
                    </div>
                  </td>
                  <td className="pr-6 py-3 text-end">
                    {filters.archived ? (
                      <button
                        type="button"
                        className="text-xs font-medium text-orange-600 hover:underline"
                        onClick={() => openRestore(dep)}
                      >
                        Restore
                      </button>
                    ) : (
                      <DepartmentFormDialog
                        department={dep}
                        onSuccess={refetch}
                        managers={managers}
                        trigger={
                          <button className="text-slate-400  hover:text-slate-600">
                            <Pencil className="w-4 h-4 inline" />
                          </button>
                        }
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmRestoreDialog
        open={!!restoreTarget}
        onOpenChange={(open) => !open && setRestoreTarget(null)}
        onConfirm={handleRestore}
        itemName={restoreTarget?.name}
        itemType="department"
        loading={restoring}
        error={restoreError}
      />
    </div>
  );
}
