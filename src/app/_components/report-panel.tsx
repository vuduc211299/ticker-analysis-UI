import ReactMarkdown from "react-markdown";
import type { ReportResponse } from "@/lib/types";

interface ReportPanelProps {
  reportLoading: boolean;
  report: ReportResponse | null;
}

export function ReportPanel({ reportLoading, report }: ReportPanelProps) {
  return (
    <div className="flex flex-col gap-4 max-h-[440px]">
      {reportLoading ? (
        <div className="bg-[#0e0e0e] rounded-3xl p-6 border border-white/5 shadow-2xl animate-pulse">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-5/6 bg-white/5 rounded" />
            <div className="h-3 w-4/6 bg-white/5 rounded" />
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-3/4 bg-white/5 rounded" />
          </div>
        </div>
      ) : (
        <>
          {(report?.report_markdown || report?.analysis) && (
            <div className="bg-[#0e0e0e] rounded-3xl p-6 border border-white/5 shadow-2xl overflow-hidden flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  AI Analysis
                </h4>
              </div>
              <div className="markdown-report overflow-y-auto min-h-0">
                <ReactMarkdown>
                  {report?.report_markdown || report?.analysis || ""}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {report?.sections && report.sections.length > 0 && (
            <div className="flex-1 bg-[#0e0e0e] rounded-3xl p-6 border border-white/5 shadow-2xl overflow-y-auto max-h-[520px]">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5">
                Detailed Report
              </h4>
              <div className="flex flex-col gap-6">
                {report.sections.map((section, index) => (
                  <div
                    key={index}
                    className="border-b border-white/5 last:border-0 pb-5 last:pb-0"
                  >
                    <h5 className="text-sm font-semibold text-zinc-100 mb-2">
                      {section.title}
                    </h5>
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report?.errors && report.errors.length > 0 && (
            <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-4 text-yellow-400 text-xs space-y-1">
              {report.errors.map((error, index) => (
                <p key={index}>⚠ {error}</p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
