import { httpClient, unwrapResponse } from './api';
import { AnalyticsData, AnalyticsMetric, ChartData, TimeRange } from '@/types/analytics';
import { mockAnalyticsMetrics, mockChartData } from './mockData';

export const analyticsService = {
  getAnalytics: async (timeRange: TimeRange = 'month'): Promise<AnalyticsData> => {
    const data: AnalyticsData = {
      metrics: mockAnalyticsMetrics,
      charts: mockChartData,
      timeRange,
      generatedAt: new Date().toISOString(),
    };

    const response = await httpClient.get<AnalyticsData>(`/analytics?timeRange=${timeRange}`, data);
    return unwrapResponse(response);
  },

  getChartData: async (chartType: string): Promise<ChartData> => {
    const chart = mockChartData.find(c => c.type === chartType) || mockChartData[0];

    const response = await httpClient.get<ChartData>(`/analytics/charts/${chartType}`, chart);
    return unwrapResponse(response);
  },

  getMetrics: async (): Promise<AnalyticsMetric[]> => {
    const response = await httpClient.get<AnalyticsMetric[]>('/analytics/metrics', mockAnalyticsMetrics);
    return unwrapResponse(response);
  },

  getMetricById: async (metricId: string): Promise<AnalyticsMetric> => {
    const metric = mockAnalyticsMetrics.find(m => m.id === metricId);
    
    if (!metric) {
      throw new Error(`Metric with id ${metricId} not found`);
    }

    const response = await httpClient.get<AnalyticsMetric>(`/analytics/metrics/${metricId}`, metric);
    return unwrapResponse(response);
  },

  exportAnalytics: async (timeRange: TimeRange = 'month'): Promise<Blob> => {
    const data = await analyticsService.getAnalytics(timeRange);
    
    // Simulate CSV export
    const csv = JSON.stringify(data, null, 2);
    return new Blob([csv], { type: 'application/json' });
  },
};
