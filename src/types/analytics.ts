export type TimeRange = 'week' | 'month' | 'quarter' | 'year';
export type ChartType = 'line' | 'bar' | 'pie' | 'area';

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
  timestamp?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  data: ChartDataPoint[];
  metadata?: {
    xAxisLabel?: string;
    yAxisLabel?: string;
    color?: string;
  };
}

export interface AnalyticsData {
  metrics: AnalyticsMetric[];
  charts: ChartData[];
  timeRange: TimeRange;
  generatedAt: string;
}

export interface AnalyticsSummary {
  totalPredictions: number;
  accuracy: number;
  modelsActive: number;
  jobsRunning: number;
}
