import type { MetricChange, MetricTone, SummaryMetric } from "@/types/metric"; 
import { Skeleton } from "../ui/skeleton";

interface SummaryMetricsTableProps {
  title?: string;
  metrics: SummaryMetric[];
  valueHeader?: string;
  changeHeader?: string;
  className?: string;
  loading?: boolean;
  skeletonRows?: number;
}

const toneStyles: Record<MetricTone, string> = {
  good: "text-blue-600",
  bad: "text-orange-600",
  watch: "text-amber-500",
  neutral: "text-slate-500",
};

function ChangeCell({ change }: { change: MetricChange }) {
  const { direction, amount, unit = "", tone, note } = change;

  return (
    <span className="inline-flex items-baseline justify-end gap-1.5">
      <span className={`font-medium ${toneStyles[tone]}`}>
        <span role="img" aria-label={direction === "up" ? "Up" : "Down"}>
          {direction === "up" ? "↑" : "↓"}
        </span>
        {amount}
        {unit}
      </span>
      {note && <span className="text-[11px] text-slate-400">({note})</span>}
    </span>
  );
}

export default function SummaryMetricsTable({
  title = "Summary metrics",
  metrics,
  valueHeader = "Value",
  changeHeader = "vs previous 30 days",
  className = "",
  loading = false,
  skeletonRows = 5,
}: SummaryMetricsTableProps) {
  return (
    <section
      aria-busy={loading}
      className={`rounded-xl border border-slate-200 bg-white ${className}`}
    >
      <h2 className="px-5 pt-5 text-sm font-semibold text-slate-900">
        {loading ? <Skeleton className="h-3 w-50" /> : title}
      </h2>

      <div className="overflow-x-auto px-5 pb-2 pt-4">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-normal text-slate-500">
              <th scope="col" className="pb-2 text-left font-normal">
                {loading ? <Skeleton className="h-3 w-12" /> : "Metric"}
              </th>
              <th scope="col" className="pb-2 text-right font-normal">
                {loading ? (
                  <Skeleton className="ml-auto h-3 w-10" />
                ) : (
                  valueHeader
                )}
              </th>
              <th scope="col" className="pb-2 text-right font-normal">
                {loading ? (
                  <Skeleton className="ml-auto h-3 w-24" />
                ) : (
                  changeHeader
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <th scope="row" className="py-3.5 text-left">
                      <Skeleton className="h-3 w-28" />
                    </th>
                    <td className="py-3.5">
                      <Skeleton className="ml-auto h-4 w-12" />
                    </td>
                    <td className="py-3.5">
                      <Skeleton className="ml-auto h-3 w-20" />
                    </td>
                  </tr>
                ))
              : metrics.map((metric) => (
                  <tr
                    key={metric.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="py-3.5 text-left text-xs font-normal text-slate-800"
                    >
                      {metric.label}
                    </th>
                    <td className="py-3.5 text-right font-medium tabular-nums text-slate-900">
                      {typeof metric.value === "number"
                        ? metric.value.toLocaleString()
                        : metric.value}
                    </td>
                    <td className="py-3.5 text-right text-xs tabular-nums">
                      {metric.change ? (
                        <ChangeCell change={metric.change} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
