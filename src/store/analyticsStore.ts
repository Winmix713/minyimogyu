import { create } from 'zustand';
import { AnalyticsMetric, ChartData, TimeRange, AnalyticsData } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

interface AnalyticsState {
  metrics: AnalyticsMetric[];
  charts: ChartData[];
  timeRange: TimeRange;
  loading: boolean;
  error: string | null;
}

interface AnalyticsActions {
  fetchAnalytics: (timeRange?: TimeRange) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchChartData: (chartType: string) => Promise<void>;
  setTimeRange: (timeRange: TimeRange) => void;
  clearError: () => void;
}

type AnalyticsStore = AnalyticsState & AnalyticsActions;

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  // Initial state
  metrics: [],
  charts: [],
  timeRange: 'month',
  loading: false,
  error: null,

  // Actions
  fetchAnalytics: async (timeRange?: TimeRange) => {
    const selectedTimeRange = timeRange || get().timeRange;
    set({ loading: true, error: null });
    
    try {
      const data: AnalyticsData = await analyticsService.getAnalytics(selectedTimeRange);
      set({
        metrics: data.metrics,
        charts: data.charts,
        timeRange: selectedTimeRange,
        loading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchMetrics: async () => {
    set({ loading: true, error: null });
    
    try {
      const metrics = await analyticsService.getMetrics();
      set({ metrics, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch metrics';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchChartData: async (chartType: string) => {
    set({ loading: true, error: null });
    
    try {
      const chartData = await analyticsService.getChartData(chartType);
      set((state) => {
        const existingIndex = state.charts.findIndex(c => c.type === chartType);
        const newCharts = existingIndex >= 0
          ? state.charts.map((c, i) => i === existingIndex ? chartData : c)
          : [...state.charts, chartData];
        
        return {
          charts: newCharts,
          loading: false,
        };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chart data';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  setTimeRange: (timeRange: TimeRange) => {
    set({ timeRange });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks
export const useAnalytics = () => useAnalyticsStore((state) => ({
  metrics: state.metrics,
  charts: state.charts,
  timeRange: state.timeRange,
  loading: state.loading,
  error: state.error,
}));

export const useAnalyticsLoading = () => useAnalyticsStore((state) => state.loading);
export const useAnalyticsError = () => useAnalyticsStore((state) => state.error);
export const useAnalyticsMetrics = () => useAnalyticsStore((state) => state.metrics);
export const useAnalyticsCharts = () => useAnalyticsStore((state) => state.charts);
export const useAnalyticsTimeRange = () => useAnalyticsStore((state) => state.timeRange);

export const useAnalyticsActions = () => useAnalyticsStore((state) => ({
  fetchAnalytics: state.fetchAnalytics,
  fetchMetrics: state.fetchMetrics,
  fetchChartData: state.fetchChartData,
  setTimeRange: state.setTimeRange,
  clearError: state.clearError,
}));
