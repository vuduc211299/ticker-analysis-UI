"use client";

import { useState } from "react";
import { PriceChart } from "./_components/price-chart";
import { ReportPanel } from "./_components/report-panel";
import { formatPrice, formatTimestamp } from "@/lib/format";
import type { ChartDataResponse, ReportResponse } from "@/lib/types";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [query, setQuery] = useState("");
  const [chartLoading, setChartLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);

  // Which series key is selected in the chart (e.g. "30d", "7d")
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const isLoading = chartLoading || reportLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setChartLoading(true);
    setReportLoading(true);
    setError(null);
    setChartData(null);
    setReport(null);
    setActiveSeries(null);

    // Fire both requests independently — chart-data typically responds faster
    fetch("/api/chart-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Chart API error: ${res.status}`);
        const data: ChartDataResponse = await res.json();
        setChartData(data);
        setActiveSeries(Object.keys(data.series)[0] ?? null);
      })
      .catch((err) => setError((prev) => prev || err.message))
      .finally(() => setChartLoading(false));

    fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Report API error: ${res.status}`);
        const data: ReportResponse = await res.json();
        setReport(data);
      })
      .catch((err) => setError((prev) => prev || err.message))
      .finally(() => setReportLoading(false));
  };

  // Build chart points for the selected series
  const selectedSeriesObj =
    chartData && activeSeries ? chartData.series[activeSeries] : null;

  const chartPoints = selectedSeriesObj
    ? selectedSeriesObj.points.map((p) => ({
        name: formatTimestamp(p.timestamp_ms),
        price: p.price_usd,
      }))
    : [];

  const latestPrice =
    chartPoints.length > 0 ? chartPoints[chartPoints.length - 1].price : null;
  const firstPrice = chartPoints.length > 0 ? chartPoints[0].price : null;
  const pctChange =
    latestPrice != null && firstPrice != null && firstPrice !== 0
      ? (((latestPrice - firstPrice) / firstPrice) * 100).toFixed(2)
      : null;
  const isPositive = pctChange != null && parseFloat(pctChange) >= 0;

  const ticker = chartData?.ticker ?? report?.ticker ?? "";
  const seriesKeys = chartData ? Object.keys(chartData.series) : [];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-start mt-12 sm:mt-24">
      {/* ── Search Bar ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-purple-500/0 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg
                className="w-6 h-6 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about any crypto ticker…"
              className="w-full bg-[#0f0f0f] border border-white/5 rounded-[32px] py-6 pl-16 pr-36 text-xl text-white placeholder:text-zinc-500 focus:outline-none focus:bg-[#141414] transition-all shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/100 rounded-full animate-spin" />
                ) : (
                  <span className="text-xs font-medium px-2">Analyze</span>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-400">
          <span className="mr-1">Try:</span>
          {["Bitcoin 30 days", "Ethereum last week", "SOL price trend"].map(
            (q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="px-4 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors text-zinc-300"
              >
                {q}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mt-12 p-4 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-400 text-center w-full max-w-2xl">
          {error}
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {(chartData || report || isLoading) && (
        <div className="mt-16 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Header */}
          {ticker ? (
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                  {ticker}
                  <span className="text-zinc-400 font-normal text-xl sm:text-2xl mt-1">
                    {chartData?.coin_id && `· ${chartData.coin_id}`}
                  </span>
                </h2>
              </div>
              {pctChange != null && latestPrice != null && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {formatPrice(latestPrice)}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-sm font-medium mt-1 px-2.5 py-1 rounded-md ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                  >
                    {isPositive ? "▲" : "▼"} {Math.abs(parseFloat(pctChange))}%
                    {selectedSeriesObj && (
                      <span className="ml-1 opacity-60">
                        ({selectedSeriesObj.timeframe})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 h-10 w-48 bg-white/5 rounded-xl animate-pulse" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-8">
            <PriceChart
              chartLoading={chartLoading}
              chartPoints={chartPoints}
              chartData={chartData}
              seriesKeys={seriesKeys}
              activeSeries={activeSeries}
              setActiveSeries={setActiveSeries}
              isPositive={isPositive}
            />

            <ReportPanel reportLoading={reportLoading} report={report} />
          </div>
        </div>
      )}
    </div>
  );
}
