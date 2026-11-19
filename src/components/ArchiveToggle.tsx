import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  itemName?: string; // e.g. the project name
  itemType?: string; // "project", "task", "department"...
  loading?: boolean;
  error?: string | null;
}

export default function ArchiveToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const base = "px-3 py-1.5 rounded-md text-sm transition";
  const on = "bg-slate-900 text-white";
  const off = "text-slate-500 hover:bg-slate-100";
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        className={`${base} ${!value ? on : off}`}
        onClick={() => onChange(false)}
      >
        Active
      </button>
      <button
        type="button"
        className={`${base} ${value ? on : off}`}
        onClick={() => onChange(true)}
      >
        Archived
      </button>
    </div>
  );
}

export function ConfirmRestoreDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  itemType = "item",
  loading = false,
  error = null,
}: ConfirmRestoreDialogProps) {
  return (
    <AlertDialog
      open={open}
      // don't let the dialog close mid-request
      onOpenChange={(next) => !loading && onOpenChange(next)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore this {itemType}?</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? <strong>{itemName}</strong> : `This ${itemType}`} will
            be moved back to your active list and become available again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          {/* a plain Button, not AlertDialogAction, which auto-closes before the request finishes */}
          <Button type="button" onClick={onConfirm} disabled={loading}>
            {loading ? "Restoring..." : "Restore"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}