import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { Bar, BarChart, Cell, LabelList, XAxis } from "recharts";
import type { DashboardCharts } from "@/hooks/useDashboard";

const STATUS_META = [
  { key: "todo", label: "Todo", fill: "#94a3b8" },
  { key: "in_progress", label: "In Progress", fill: "#f97316" },
  { key: "review", label: "Review", fill: "#6366f1" },
  { key: "done", label: "Done", fill: "#22c55e" },
] as const;
const config = { total: { label: "Tasks" } } satisfies ChartConfig;
const FALLBACK = ["#94a3b8", "#0ea5e9", "#e879f9", "#facc15"];

function TaskStatusBar({
  counts,
}: {
  counts: DashboardCharts["tasksByStatus"];
    }) {
    const data = STATUS_META.map((s) => ({
      status: s.label,
      total: counts[s.key],
      fill: s.fill,
    }));
  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Tasks by Status</h2>

      <ChartContainer config={config} className="h-44 w-full">
        <BarChart data={data} margin={{ top: 20 }} barCategoryGap="30%">
          <XAxis dataKey="status" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={80}>
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default TaskStatusBar;
