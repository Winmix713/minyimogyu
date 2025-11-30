import { useEffect } from 'react';
import { useModels, useModelsActions } from '@/store/modelsStore';

interface UseModelsOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

export const useStoreModels = (options: UseModelsOptions = {}) => {
  const { autoFetch = true, refetchInterval } = options;
  const { models, loading, error } = useModels();
  const { fetchModels, clearError } = useModelsActions();

  useEffect(() => {
    if (autoFetch) {
      fetchModels();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchModels();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval]);

  const refetch = () => fetchModels();

  return {
    models,
    loading,
    error,
    refetch,
    clearError,
  };
};
