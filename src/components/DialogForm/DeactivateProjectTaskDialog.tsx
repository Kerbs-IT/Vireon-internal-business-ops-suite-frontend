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

import type { Task } from "@/types/task";

interface DeactivateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onDeactivated: () => void;
}

export function DeactivateProjectTaskDialog({
  open,
  onOpenChange,
  task,
  onDeactivated,
}: DeactivateEmployeeDialogProps) {
    const [loading, setLoading] = useState(false);
    
      async function handleDeactivate() {
        setLoading(true);
        try {
            const res = await api.delete(`/tasks/${task.id}`);
            
            if (res.status === 200) {
                 toast.add({
                   type: "success",
                   description: res.data.message ?? "Project task deactivated.",
                 });
            }

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
            This will delete your project task.
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
            {loading ? "Archiving..." : "Archive"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
