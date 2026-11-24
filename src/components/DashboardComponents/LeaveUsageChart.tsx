import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardCharts } from "@/hooks/useDashboard";


const LEAVE_COLORS: Record<string, string> = {
  "Vacation Leave": "#fb923c",
  "Sick Leave": "#818cf8",
  "Personal Leave": "#22c55e",
};
const config = { days: { label: "Days" } } satisfies ChartConfig;
const FALLBACK = ["#94a3b8", "#0ea5e9", "#e879f9", "#facc15"];

export function LeaveUsageChart({ usage }: { usage: DashboardCharts["leaveUsage"] }) {
  const data = usage.map((u, i) => ({
    name: u.name,
    days: u.days,
    fill: LEAVE_COLORS[u.name] ?? FALLBACK[i % FALLBACK.length],
  }));
  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Leave Usage</h2>

      <div className="flex items-center justify-center gap-8">
        <ChartContainer config={config} className="aspect-square h-48 w-48">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="days"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              strokeWidth={0}
            />
          </PieChart>
        </ChartContainer>

        <ul className="space-y-2 text-sm">
          {data.map((d) => (
            <li key={d.name} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: d.fill }}
              />
              <span className="w-24 text-slate-500">{d.name}</span>
              <span className="font-medium">{d.days} days</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
