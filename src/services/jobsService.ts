import { httpClient, unwrapResponse } from './api';
import { JobSummary } from '@/types/jobs';
import { mockJobs } from './mockData';

// In-memory mock storage
let jobsData = [...mockJobs];

export const jobsService = {
  getJobs: async (): Promise<JobSummary[]> => {
    const response = await httpClient.get<JobSummary[]>('/jobs', jobsData);
    return unwrapResponse(response);
  },

  getJobById: async (id: string): Promise<JobSummary> => {
    const job = jobsData.find(j => j.id === id);
    
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }

    const response = await httpClient.get<JobSummary>(`/jobs/${id}`, job);
    return unwrapResponse(response);
  },

  createJob: async (data: Partial<JobSummary>): Promise<JobSummary> => {
    const newJob: JobSummary = {
      id: `job-${Date.now()}`,
      job_name: data.job_name || 'new-job',
      job_type: data.job_type || 'data_import',
      cron_schedule: data.cron_schedule || '0 0 * * *',
      enabled: data.enabled ?? true,
      last_run_at: null,
      next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      config: data.config || {},
      is_due: false,
      average_duration_ms: null,
      stats: {
        total_runs: 0,
        success_runs: 0,
      },
      last_log: null,
    };

    jobsData.push(newJob);

    const response = await httpClient.post<JobSummary>('/jobs', data, newJob);
    return unwrapResponse(response);
  },

  updateJob: async (id: string, data: Partial<JobSummary>): Promise<JobSummary> => {
    const index = jobsData.findIndex(j => j.id === id);
    
    if (index === -1) {
      throw new Error(`Job with id ${id} not found`);
    }

    jobsData[index] = {
      ...jobsData[index],
      ...data,
    };

    const response = await httpClient.put<JobSummary>(`/jobs/${id}`, data, jobsData[index]);
    return unwrapResponse(response);
  },

  deleteJob: async (id: string): Promise<void> => {
    const index = jobsData.findIndex(j => j.id === id);
    
    if (index === -1) {
      throw new Error(`Job with id ${id} not found`);
    }

    jobsData.splice(index, 1);

    await httpClient.delete<void>(`/jobs/${id}`, undefined);
  },

  toggleJob: async (id: string): Promise<JobSummary> => {
    const index = jobsData.findIndex(j => j.id === id);
    
    if (index === -1) {
      throw new Error(`Job with id ${id} not found`);
    }

    jobsData[index].enabled = !jobsData[index].enabled;

    const response = await httpClient.patch<JobSummary>(`/jobs/${id}/toggle`, {}, jobsData[index]);
    return unwrapResponse(response);
  },

  triggerJob: async (id: string): Promise<JobSummary> => {
    const job = jobsData.find(j => j.id === id);
    
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }

    // Simulate job execution
    const response = await httpClient.post<JobSummary>(`/jobs/${id}/trigger`, {}, job);
    return unwrapResponse(response);
  },
};
