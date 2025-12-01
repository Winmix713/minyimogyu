import { create } from 'zustand';
import { JobSummary } from '@/types/jobs';
import { jobsService } from '@/services/jobsService';

interface JobsState {
  jobs: JobSummary[];
  selectedJobId: string | null;
  loading: boolean;
  error: string | null;
}

interface JobsActions {
  fetchJobs: () => Promise<void>;
  fetchJobById: (id: string) => Promise<JobSummary>;
  createJob: (data: Partial<JobSummary>) => Promise<void>;
  updateJob: (id: string, data: Partial<JobSummary>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  toggleJob: (id: string) => Promise<void>;
  triggerJob: (id: string) => Promise<void>;
  selectJob: (id: string | null) => void;
  clearError: () => void;
}

type JobsStore = JobsState & JobsActions;

export const useJobsStore = create<JobsStore>((set, get) => ({
  // Initial state
  jobs: [],
  selectedJobId: null,
  loading: false,
  error: null,

  // Actions
  fetchJobs: async () => {
    set({ loading: true, error: null });
    
    try {
      const jobs = await jobsService.getJobs();
      set({ jobs, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch jobs';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchJobById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const job = await jobsService.getJobById(id);
      set({ loading: false });
      return job;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createJob: async (data: Partial<JobSummary>) => {
    set({ loading: true, error: null });
    
    try {
      const newJob = await jobsService.createJob(data);
      set((state) => ({
        jobs: [...state.jobs, newJob],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateJob: async (id: string, data: Partial<JobSummary>) => {
    set({ loading: true, error: null });
    
    try {
      const updatedJob = await jobsService.updateJob(id, data);
      set((state) => ({
        jobs: state.jobs.map(job => job.id === id ? updatedJob : job),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update job';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteJob: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await jobsService.deleteJob(id);
      set((state) => ({
        jobs: state.jobs.filter(job => job.id !== id),
        selectedJobId: state.selectedJobId === id ? null : state.selectedJobId,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete job';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  toggleJob: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const updatedJob = await jobsService.toggleJob(id);
      set((state) => ({
        jobs: state.jobs.map(job => job.id === id ? updatedJob : job),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle job';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  triggerJob: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await jobsService.triggerJob(id);
      // Optionally refetch jobs to get updated stats
      await get().fetchJobs();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger job';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  selectJob: (id: string | null) => {
    set({ selectedJobId: id });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks
export const useJobs = () => useJobsStore((state) => ({
  jobs: state.jobs,
  loading: state.loading,
  error: state.error,
}));

export const useJobsLoading = () => useJobsStore((state) => state.loading);
export const useJobsError = () => useJobsStore((state) => state.error);
export const useSelectedJob = () => {
  const jobs = useJobsStore((state) => state.jobs);
  const selectedJobId = useJobsStore((state) => state.selectedJobId);
  return jobs.find(job => job.id === selectedJobId) || null;
};

export const useJobsActions = () => useJobsStore((state) => ({
  fetchJobs: state.fetchJobs,
  fetchJobById: state.fetchJobById,
  createJob: state.createJob,
  updateJob: state.updateJob,
  deleteJob: state.deleteJob,
  toggleJob: state.toggleJob,
  triggerJob: state.triggerJob,
  selectJob: state.selectJob,
  clearError: state.clearError,
}));
