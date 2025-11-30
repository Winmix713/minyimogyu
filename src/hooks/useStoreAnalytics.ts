import { useEffect } from 'react';
import { useAnalytics, useAnalyticsActions } from '@/store/analyticsStore';
import { TimeRange } from '@/types/analytics';

interface UseAnalyticsOptions {
  autoFetch?: boolean;
  timeRange?: TimeRange;
  refetchInterval?: number;
}

export const useStoreAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { autoFetch = true, timeRange = 'month', refetchInterval } = options;
  const { metrics, charts, loading, error } = useAnalytics();
  const { fetchAnalytics, setTimeRange, clearError } = useAnalyticsActions();

  useEffect(() => {
    setTimeRange(timeRange);
  }, [timeRange]);

  useEffect(() => {
    if (autoFetch) {
      fetchAnalytics(timeRange);
    }
  }, [autoFetch, timeRange]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchAnalytics(timeRange);
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, timeRange]);

  const refetch = () => fetchAnalytics(timeRange);

  return {
    metrics,
    charts,
    timeRange,
    loading,
    error,
    refetch,
    clearError,
  };
};
