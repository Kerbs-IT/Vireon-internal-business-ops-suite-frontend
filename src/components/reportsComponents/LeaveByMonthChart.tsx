// src/components/reports/LeaveByMonthChart.tsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { LeaveByMonth } from "@/types/leave";


const chartConfig = {
  approved: { label: "Approved", color: "#1E40AF" },
  pending: { label: "Pending", color: "#FBBF24" },
  rejected: { label: "Rejected", color: "#D6D3CD" },
} satisfies ChartConfig;

export default function LeaveByMonthChart({ data }: { data: LeaveByMonth[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={28}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="approved" stackId="a" fill="var(--color-approved)" />
        <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" />
        <Bar
          dataKey="rejected"
          stackId="a"
          fill="var(--color-rejected)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
