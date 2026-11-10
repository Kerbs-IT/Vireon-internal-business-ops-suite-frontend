import type { MetricChange, MetricTone, SummaryMetric } from "@/types/metric"; 

interface SummaryMetricsTableProps {
  title?: string;
  metrics: SummaryMetric[];
  valueHeader?: string;
  changeHeader?: string;
  className?: string;
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
}: SummaryMetricsTableProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white ${className}`}
    >
      <h2 className="px-5 pt-5 text-sm font-semibold text-slate-900">
        {title}
      </h2>

      <div className="overflow-x-auto px-5 pb-2 pt-4">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-normal text-slate-500">
              <th scope="col" className="pb-2 text-left font-normal">
                Metric
              </th>
              <th scope="col" className="pb-2 text-right font-normal">
                {valueHeader}
              </th>
              <th scope="col" className="pb-2 text-right font-normal">
                {changeHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
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
