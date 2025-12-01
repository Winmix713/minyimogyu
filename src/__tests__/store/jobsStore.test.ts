import { describe, it, expect, beforeEach } from 'vitest';
import { useJobsStore } from '@/store/jobsStore';

describe('jobsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useJobsStore.setState({
      jobs: [],
      selectedJobId: null,
      loading: false,
      error: null,
    });
  });

  it('should have initial state', () => {
    const state = useJobsStore.getState();
    
    expect(state.jobs).toEqual([]);
    expect(state.selectedJobId).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should fetch jobs successfully', async () => {
    const state = useJobsStore.getState();
    
    await state.fetchJobs();

    const newState = useJobsStore.getState();
    
    expect(newState.loading).toBe(false);
    expect(newState.jobs.length).toBeGreaterThan(0);
    expect(newState.error).toBeNull();
  });

  it('should select a job', () => {
    const state = useJobsStore.getState();
    
    state.selectJob('job-1');

    const newState = useJobsStore.getState();
    expect(newState.selectedJobId).toBe('job-1');
  });

  it('should create a job', async () => {
    const state = useJobsStore.getState();
    
    const initialCount = state.jobs.length;
    
    await state.createJob({
      job_name: 'test-job',
      job_type: 'prediction',
      cron_schedule: '0 0 * * *',
    });

    const newState = useJobsStore.getState();
    
    expect(newState.jobs.length).toBe(initialCount + 1);
    expect(newState.jobs.some(j => j.job_name === 'test-job')).toBe(true);
  });

  it('should delete a job', async () => {
    const state = useJobsStore.getState();
    
    // First fetch jobs
    await state.fetchJobs();
    const jobToDelete = useJobsStore.getState().jobs[0];
    
    if (jobToDelete) {
      await state.deleteJob(jobToDelete.id);
      
      const newState = useJobsStore.getState();
      expect(newState.jobs.find(j => j.id === jobToDelete.id)).toBeUndefined();
    }
  });

  it('should clear error', () => {
    useJobsStore.setState({ error: 'Some error' });
    
    const state = useJobsStore.getState();
    state.clearError();

    const newState = useJobsStore.getState();
    expect(newState.error).toBeNull();
  });
});
