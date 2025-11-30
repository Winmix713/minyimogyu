import { useEffect } from 'react';
import { useJobs, useJobsActions } from '@/store/jobsStore';

interface UseJobsOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

export const useStoreJobs = (options: UseJobsOptions = {}) => {
  const { autoFetch = true, refetchInterval } = options;
  const { jobs, loading, error } = useJobs();
  const { fetchJobs, clearError } = useJobsActions();

  useEffect(() => {
    if (autoFetch) {
      fetchJobs();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchJobs();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval]);

  const refetch = () => fetchJobs();

  return {
    jobs,
    loading,
    error,
    refetch,
    clearError,
  };
};
