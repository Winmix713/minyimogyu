import { useEffect } from 'react';
import { usePredictions, usePredictionsActions } from '@/store/predictionsStore';
import { PredictionFilters } from '@/types/prediction';

interface UsePredictionsOptions {
  autoFetch?: boolean;
  filters?: PredictionFilters;
  refetchInterval?: number;
}

export const useStorePredictions = (options: UsePredictionsOptions = {}) => {
  const { autoFetch = true, filters, refetchInterval } = options;
  const { predictions, loading, error, stats } = usePredictions();
  const { fetchPredictions, fetchPredictionStats, clearError } = usePredictionsActions();

  useEffect(() => {
    if (autoFetch) {
      fetchPredictions(filters);
      fetchPredictionStats(filters);
    }
  }, [autoFetch, JSON.stringify(filters)]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchPredictions(filters);
        fetchPredictionStats(filters);
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, JSON.stringify(filters)]);

  const refetch = () => {
    fetchPredictions(filters);
    fetchPredictionStats(filters);
  };

  return {
    predictions,
    stats,
    loading,
    error,
    refetch,
    clearError,
  };
};
