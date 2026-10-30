import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import type React from "react";
import { toast } from "../ui/toast";
import { useState } from "react";
import axios from "axios";

interface Employee {
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

interface DeactivateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onDeactivated: () => void;
}

export function DeactivateEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onDeactivated,
}: DeactivateEmployeeDialogProps) {
    const [loading, setLoading] = useState(false);
    
      async function handleDeactivate() {
        setLoading(true);
        try {
          const res = await api.post(`/deactivate/${employee.id}`);

          toast.add({
            type: "success",
            description: res.data.message ?? "Employee account deactivated.",
          });

          onDeactivated();
        } catch (error) {
          toast.add({
            type: "error",
            description:
              axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "Something went wrong.",
          });
        } finally {
          setLoading(false);
        }
      }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate your employee account and remove employee
            access to the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDeactivate}
          >
            {loading ? "Deactivating..." : "Deactivate"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
