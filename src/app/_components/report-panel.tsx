"use client";

import ReactMarkdown from "react-markdown";
import React, { useState, useEffect } from "react";
import type { ReportResponse } from "@/lib/types";

interface ReportPanelProps {
  reportLoading: boolean;
  report: ReportResponse | null;
}

const ReportContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-8 mb-4 first:mt-0" {...props} />,
      h4: ({ node, ...props }) => <h4 className="text-lg font-semibold text-zinc-100 mt-6 mb-3" {...props} />,
      p: ({ node, ...props }) => {
          const extractText = (children: React.ReactNode): string => {
            if (typeof children === 'string' || typeof children === 'number') return String(children);
            if (Array.isArray(children)) return children.map(extractText).join('');
            if (React.isValidElement(children)) {
              // @ts-ignore
              return extractText(children.props.children);
            }
            return '';
          };
          const text = extractText(props.children);
          if (/recommendation/i.test(text)) {
            return (
              <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex gap-4 items-start">
                <div className="text-2xl mt-0.5" aria-hidden="true">💡</div>
                <div className="text-emerald-50 leading-relaxed font-medium text-base">
                  {props.children}
                </div>
              </div>
            );
          }
          return <p className="mb-4 text-zinc-300 leading-relaxed text-base" {...props} />;
      },
      ul: ({ node, ...props }) => <ul className="mb-6 space-y-2" {...props} />,
      li: ({ node, ...props }) => {
          const extractText = (children: React.ReactNode): string => {
            if (typeof children === 'string' || typeof children === 'number') return String(children);
            if (Array.isArray(children)) return children.map(extractText).join('');
            if (React.isValidElement(children)) {
              // @ts-ignore
              return extractText(children.props.children);
            }
            return '';
          };
          const text = extractText(props.children);
          if (/recommendation/i.test(text)) {
            return (
              <li className="my-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex gap-4 items-start list-none -ml-5">
                <div className="text-2xl mt-0.5" aria-hidden="true">💡</div>
                <div className="text-emerald-100 leading-relaxed font-medium text-base">
                  {props.children}
                </div>
              </li>
            );
          }
          return <li className="ml-5 list-disc marker:text-zinc-500 pl-1 mb-2 text-zinc-300 text-base" {...props} />;
      },
      strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-100" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

export function ReportPanel({ reportLoading, report }: ReportPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const analysisContent = report?.report_markdown || report?.analysis || "";

  return (
    <>
      <div className="flex flex-col gap-4 w-full h-[440px]">
        {reportLoading ? (
          <div className="bg-[#0e0e0e] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl animate-pulse flex flex-col w-full h-full">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              <div className="h-4 w-28 bg-white/5 rounded" />
            </div>
            <div className="space-y-4 mt-2">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-4/6 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded mt-8" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-4/6 bg-white/5 rounded" />
            </div>
          </div>
        ) : (
          <>
            {analysisContent && (
              <div className="bg-[#0e0e0e] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl flex flex-col w-full h-full relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6 shrink-0 z-10 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                  <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-widest">
                    AI Analysis
                  </h4>
                </div>
                
                <div className="markdown-report flex-1 pb-16 overflow-hidden relative z-0">
                  <ReportContent content={analysisContent} />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/90 to-transparent z-10 pointer-events-none flex items-end justify-center pb-6 sm:pb-8">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="pointer-events-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>Read Full Report</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {report?.errors && report.errors.length > 0 && (
              <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-4 text-yellow-400 text-xs space-y-1 mt-4 shrink-0">
                {report.errors.map((error, index) => (
                  <p key={index}>⚠ {error}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && analysisContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-4xl max-h-full bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0 bg-[#0a0a0a] z-10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-widest">
                  Detailed Analysis
                </h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1">
              <div className="markdown-report max-w-3xl mx-auto">
                <ReportContent content={analysisContent} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
