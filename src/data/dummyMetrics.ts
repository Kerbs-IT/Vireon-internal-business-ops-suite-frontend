import type { SummaryMetric } from "@/types/metric"; 

export const dummyMetrics: SummaryMetric[] = [
  {
    id: "total-tasks",
    label: "Total tasks",
    value: 198,
    change: { direction: "up", amount: 12, unit: "%", tone: "good" },
  },
  {
    id: "tasks-completed",
    label: "Tasks completed",
    value: 147,
    change: { direction: "up", amount: 8, unit: "%", tone: "good" },
  },
  {
    id: "overdue-tasks",
    label: "Overdue tasks",
    value: 6,
    change: { direction: "down", amount: 2, tone: "bad", note: "fewer is better" },
  },
  {
    id: "leave-requests",
    label: "Leave requests",
    value: 14,
    change: { direction: "up", amount: 3, tone: "watch", note: "watch" },
  },
  {
    id: "leave-days-taken",
    label: "Leave days taken",
    value: 23,
    change: { direction: "down", amount: 4, unit: "%", tone: "good", note: "fewer is better" },
  },
];