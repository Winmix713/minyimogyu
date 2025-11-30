import { useEffect } from 'react';
import { useUsers, useUsersActions } from '@/store/usersStore';

interface UseUsersOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

export const useStoreUsers = (options: UseUsersOptions = {}) => {
  const { autoFetch = true, refetchInterval } = options;
  const { users, loading, error } = useUsers();
  const { fetchUsers, fetchRoles, clearError } = useUsersActions();

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
      fetchRoles();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchUsers();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval]);

  const refetch = () => {
    fetchUsers();
    fetchRoles();
  };

  return {
    users,
    loading,
    error,
    refetch,
    clearError,
  };
};
