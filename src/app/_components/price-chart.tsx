import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatPrice } from "@/lib/format";
import type { ChartDataResponse, ChartDisplayPoint } from "@/lib/types";
import { CustomTooltip } from "./custom-tooltip";

interface PriceChartProps {
  chartLoading: boolean;
  chartPoints: ChartDisplayPoint[];
  chartData: ChartDataResponse | null;
  seriesKeys: string[];
  activeSeries: string | null;
  setActiveSeries: (key: string) => void;
  isPositive: boolean;
}

export function PriceChart({
  chartLoading,
  chartPoints,
  chartData,
  seriesKeys,
  activeSeries,
  setActiveSeries,
  isPositive,
}: PriceChartProps) {
  return (
    <div className="flex flex-col min-h-[440px] relative rounded-3xl bg-[#0e0e0e] border border-white/5 p-6 shadow-2xl">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h3 className="text-base font-semibold text-zinc-200">Price Chart</h3>
        {seriesKeys.length > 1 && (
          <div className="flex gap-1.5">
            {seriesKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveSeries(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  activeSeries === key
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
                }`}
              >
                {chartData?.series[key]?.timeframe ?? key}
              </button>
            ))}
          </div>
        )}
      </div>

      {chartLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : chartPoints.length > 0 ? (
        <div className="flex-1 w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartPoints}
              margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#27272a"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 11 }}
                dy={8}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickFormatter={(value) => formatPrice(value)}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#f43f5e"}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 0,
                  fill: isPositive ? "#10b981" : "#f43f5e",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
          No chart data available.
        </div>
      )}
    </div>
  );
}
