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
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Department } from "@/types/leave";
import React, { useState } from "react";
import { toast } from "../ui/toast";
import axios from "axios";
import type { Employee } from "@/types/employee";

interface ArchiveAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Department | Employee | undefined;
    onDeactivated: () => void;
    category: string;
    categoryLabel: string;
}

function ArchiveAlertDialog({
  open,
  onOpenChange,
  item,
  onDeactivated,
  category,
  categoryLabel,
}: ArchiveAlertDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDeactivate() {
    setLoading(true);
    try {
      const res = await api.delete(`/${category}/${item.id}`);

      if (res.status === 200) {
        toast.add({
          type: "success",
          description: res.data.message ?? `${categoryLabel} deactivated.`,
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
            This will delete a {categoryLabel}.
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

export default ArchiveAlertDialog;
