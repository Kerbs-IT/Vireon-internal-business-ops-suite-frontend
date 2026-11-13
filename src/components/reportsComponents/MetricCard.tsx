import { ArrowDown, ArrowUp } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: number | string;
    rating: number;
    
}



function MetricCard({label,value,rating}:MetricCardProps) {
    const limit = 5;
    const ratingColor = rating > limit ? 'text-blue-600' : 'text-red-600';

    return (
      <div className="rounded-md p-3 bg-white border border-slate-200">
        <p className="text-slate-600 text-sm mb-1">{label ?? "label"}</p>
        <h1 className="text-5xl font-bold mb-1">{ Math.round(Number(value)) ?? "0"}</h1>
        <p
          className={`mb-0 flex gap-1 items-center justify--start text-xs ${ratingColor}`}
        >
          {rating > limit ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )}{" "}
          {rating ?? "0"}% vs previous
        </p>
      </div>
    );
}

export default MetricCard;