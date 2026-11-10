import React from "react";
import type { Task } from "@/types/task";

interface NeedAttentionProps {
  task: Task;
  days: number;
}

function NeedAttention({ task, days }: NeedAttentionProps) {
  return (
    <div className="mb-3 flex justify-between items-center">
      <div className="info">
        <h1 className="font-semibold">{task.title ?? "none"}</h1>
        <p className="capitalize text-sm text-slate-600">
          {task.project?.name ?? "none"}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <div
          title={`${task.assignee?.first_name ?? "N/A"} ${task.assignee?.last_name ?? "N/A"}`}
          className={`flex size-7 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-white bg-slate-300`}
        >
          {task.assignee?.first_name.charAt(0) ?? "A"}
          {task.assignee?.last_name.charAt(0) ?? "B"}
        </div>
        <p className="text-orange-600 text-sm">{`${days ?? "0"} days overdue`}</p>
      </div>
    </div>
  );
}

export default NeedAttention;
