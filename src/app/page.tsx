"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<null | {
    ticker: string;
    analysis: string;
    currentPrice: string;
    percentChange: string;
    chartData: { name: string; price: number }[];
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analysis");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-start mt-12 sm:mt-24">
      {/* Search Section */}
      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-purple-500/0 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
             <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
               <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
             <input
               type="text"
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder="Ask about any stock..."
               className="w-full bg-[#0f0f0f] border border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-xl text-white placeholder:text-zinc-500 focus:outline-none focus:bg-[#141414] transition-all shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
               disabled={isLoading}
             />
             <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                 className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                   {isLoading ? (
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white/100 rounded-full animate-spin" />
                   ) : (
                     <span className="text-xs font-medium px-2">Press Enter</span>
                   )}
                </button>
             </div>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-3 text-sm text-zinc-400">
           <span className="mr-2">Recent Queries:</span>
           {['MSFT', 'NVDA', 'TSLA'].map(t => (
             <button 
               key={t}
               onClick={() => setQuestion(`Analyze ${t}`)}
               className="px-4 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors text-zinc-300"
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {error && (
        <div className="mt-12 p-4 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-400 text-center w-full max-w-2xl">
          {error}
        </div>
      )}

      {/* Results Section */}
      {response && (
        <div className="mt-16 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                  {response.ticker} <span className="text-zinc-400 font-normal text-xl sm:text-2xl mt-1">(AI Analysis)</span>
                </h2>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl">
              {/* Left Column: Chart */}
              <div className="flex flex-col min-h-[400px] relative rounded-2xl bg-black/20 p-6 border border-white/2">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-medium text-zinc-300">{response.ticker} 30-Day Trend</h3>
                    <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-zinc-300 border border-white/10">
                      30-days <span className="ml-1 opacity-50">▼</span>
                    </div>
                 </div>
                 <div className="flex-1 w-full h-full relative min-h-[300px]" id="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={response.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#a1a1aa', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#a1a1aa', fontSize: 12 }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#10b981' }}
                          formatter={(value: number | undefined) => [`$${value}`, 'Price']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorPrice)" 
                          style={{
                            filter: 'drop-shadow(0px 0px 8px rgba(16,185,129,0.5))'
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Right Column: AI Summary */}
              <div className="flex flex-col gap-6">
                 {/* Price Header */}
                 <div className="bg-black/40 rounded-2xl p-6 border border-white/5 shadow-inner">
                   <div className="flex justify-between items-start">
                     <div>
                       <div className="text-4xl font-bold text-white mb-2">${response.currentPrice}</div>
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium ${parseFloat(response.percentChange) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                         {parseFloat(response.percentChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(response.percentChange))}%
                       </div>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                       <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                       </svg>
                     </div>
                   </div>
                 </div>

                 {/* Summary Text */}
                 <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/5">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">AI Analysis Summary</h4>
                    <div className="prose prose-invert prose-zinc max-w-none">
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {response.analysis}
                      </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
