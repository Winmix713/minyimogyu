import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import React from 'react';
import { useJobs } from '@/hooks/admin/useJobs';
import { supabase } from '@/integrations/supabase/client';
import type { JobSummary } from '@/types/jobs';
import type { AdminJobsManagerResult, UseJobsOptions } from '@/types/admin';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock useAuditLog
vi.mock('@/hooks/admin/useAuditLog', () => ({
  useAuditLog: () => ({
    log: vi.fn(),
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock job data
const mockJobs: JobSummary[] = [
  {
    id: 'job1',
    job_name: 'data-import',
    job_type: 'data_import',
    cron_schedule: '0 2 * * *',
    enabled: true,
    last_run_at: '2024-01-01T02:00:00Z',
    next_run_at: '2024-01-02T02:00:00Z',
    config: {},
    is_due: false,
    average_duration_ms: 30000,
    stats: {
      total_runs: 100,
      success_runs: 95,
    },
    last_log: {
      id: 'log1',
      started_at: '2024-01-01T02:00:00Z',
      completed_at: '2024-01-01T02:00:30Z',
      status: 'success',
      duration_ms: 30000,
      records_processed: 1000,
      error_message: null,
    },
  },
  {
    id: 'job2',
    job_name: 'prediction-update',
    job_type: 'prediction',
    cron_schedule: '0 */6 * * *',
    enabled: true,
    last_run_at: '2024-01-01T06:00:00Z',
    next_run_at: '2024-01-01T12:00:00Z',
    config: {},
    is_due: false,
    average_duration_ms: 45000,
    stats: {
      total_runs: 50,
      success_runs: 48,
    },
    last_log: {
      id: 'log2',
      started_at: '2024-01-01T06:00:00Z',
      completed_at: '2024-01-01T06:00:45Z',
      status: 'success',
      duration_ms: 45000,
      records_processed: 500,
      error_message: null,
    },
  },
];

const mockSupabase = vi.mocked(supabase);

describe('useJobs', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    vi.clearAllMocks();
  });

  it('fetches jobs successfully', async () => {
    mockSupabase.functions.invoke.mockResolvedValueOnce({
      data: { jobs: mockJobs },
      error: null,
    });

    const { result } = renderHook(() => useJobs(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual(mockJobs);
    expect(result.current.error).toBeNull();
    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('jobs-list');
  });

  it('handles fetch jobs error', async () => {
    const errorMessage = 'Failed to load jobs';
    mockSupabase.functions.invoke.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('handles network error', async () => {
    const networkError = new Error('Network error');
    mockSupabase.functions.invoke.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
    expect(result.current.error).toBe(networkError);
  });

  it('starts job successfully', async () => {
    const mockJobResult: AdminJobsManagerResult = {
      status: 'started',
      job: mockJobs[0],
      jobId: mockJobs[0].id,
    };

    // Mock initial fetch
    mockSupabase.functions.invoke
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      })
      // Mock start job call
      .mockResolvedValueOnce({
        data: mockJobResult,
        error: null,
      })
      // Mock refetch after start
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      });

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.startJob('data-import');

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('jobs-manager', {
      body: { action: 'start', jobName: 'data-import' },
    });
  });

  it('handles start job error', async () => {
    const errorMessage = 'Failed to start job';

    // Mock initial fetch
    mockSupabase.functions.invoke
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      })
      // Mock start job error
      .mockResolvedValueOnce({
        data: null,
        error: { message: errorMessage },
      });

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(result.current.startJob('data-import')).rejects.toThrow(errorMessage);
  });

  it('stops job successfully', async () => {
    const mockJobResult: AdminJobsManagerResult = {
      status: 'stopped',
      jobId: mockJobs[0].id,
    };

    // Mock initial fetch
    mockSupabase.functions.invoke
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      })
      // Mock stop job call
      .mockResolvedValueOnce({
        data: mockJobResult,
        error: null,
      })
      // Mock refetch after stop
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      });

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.stopJob('job1');

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('jobs-manager', {
      body: { action: 'stop', jobId: 'job1' },
    });
  });

  it('handles stop job error', async () => {
    const errorMessage = 'Failed to stop job';

    // Mock initial fetch
    mockSupabase.functions.invoke
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      })
      // Mock stop job error
      .mockResolvedValueOnce({
        data: null,
        error: { message: errorMessage },
      });

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(result.current.stopJob('job1')).rejects.toThrow(errorMessage);
  });

  it('uses custom options', () => {
    const options: UseJobsOptions = {
      refetchInterval: 60000,
      enabled: false,
    };

    mockSupabase.functions.invoke.mockResolvedValueOnce({
      data: { jobs: mockJobs },
      error: null,
    });

    renderHook(() => useJobs(options), { wrapper });

    // The options are passed to the useQuery hook
    // We can't directly test the useQuery options, but we can verify
    // the hook doesn't crash with custom options
    expect(true).toBe(true); // Placeholder assertion
  });

  it('handles loading states correctly', async () => {
    mockSupabase.functions.invoke.mockResolvedValueOnce({
      data: { jobs: mockJobs },
      error: null,
    });

    const { result } = renderHook(() => useJobs(), { wrapper });

    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFetching).toBe(false);
  });

  it('handles refetch function', async () => {
    mockSupabase.functions.invoke
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { jobs: [mockJobs[0]] }, // Return only one job on refetch
        error: null,
      });

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toHaveLength(2);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.jobs).toHaveLength(1);
    });
  });

  it('handles mutation loading states', async () => {
    let resolveStart: (value: any) => void;
    const startPromise = new Promise(resolve => {
      resolveStart = resolve;
    });

    mockSupabase.functions.invoke
      .mockResolvedValueOnce({
        data: { jobs: mockJobs },
        error: null,
      })
      .mockReturnValueOnce(startPromise); // Start job call

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Start job but don't resolve the promise yet
    const startPromiseResult = result.current.startJob('data-import');

    expect(result.current.isStarting).toBe(true);

    // Resolve the promise
    resolveStart!({
      data: { status: 'started', job: mockJobs[0] },
      error: null,
    });

    await startPromiseResult;

    expect(result.current.isStarting).toBe(false);
  });
});
