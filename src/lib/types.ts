export interface ChartPoint {
  timestamp_ms: number;
  price_usd: number;
}

export interface ChartSeries {
  timeframe: string;
  points: ChartPoint[];
}

export interface ChartDataResponse {
  query: string;
  ticker: string;
  coin_id: string;
  series: Record<string, ChartSeries>;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface ReportResponse {
  ticker: string;
  coin_id: string;
  report_markdown: string;
  sections: ReportSection[];
  analysis: string;
  errors: string[];
}

export interface ChartDisplayPoint {
  name: string;
  price: number;
}
