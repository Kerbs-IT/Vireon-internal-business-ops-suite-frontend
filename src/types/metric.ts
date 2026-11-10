// "tone" is separate from "direction" because up isn't always good
// (e.g. overdue tasks going up is bad, completed tasks going up is good).
export type MetricTone = "good" | "bad" | "watch" | "neutral";

export interface MetricChange {
  direction: "up" | "down";
  amount: number;
  unit?: "%" | ""; // defaults to ""
  tone: MetricTone;
  note?: string; // e.g. "fewer is better", "watch"
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: number | string;
  change?: MetricChange;
}