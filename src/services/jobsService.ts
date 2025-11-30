import { mockJobs, type MockJob } from "@/mocks/mockJobs";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface JobFormData {
  name: string;
  type: MockJob["type"];
  schedule: string;
  description?: string;
}

export const jobsService = {
  async getJobs(): Promise<MockJob[]> {
    await delay(500);
    return [...mockJobs];
  },

  async getJobById(id: string): Promise<MockJob | null> {
    await delay(300);
    return mockJobs.find((job) => job.id === id) || null;
  },

  async createJob(data: JobFormData): Promise<MockJob> {
    await delay(1000);
    const newJob: MockJob = {
      id: `job-${Date.now()}`,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
      progress: 0,
    };
    mockJobs.push(newJob);
    return newJob;
  },

  async updateJob(id: string, data: Partial<JobFormData>): Promise<MockJob | null> {
    await delay(800);
    const job = mockJobs.find((j) => j.id === id);
    if (!job) return null;
    
    Object.assign(job, data, { lastUpdated: new Date().toISOString() });
    return job;
  },

  async deleteJob(id: string): Promise<boolean> {
    await delay(500);
    const index = mockJobs.findIndex((j) => j.id === id);
    if (index === -1) return false;
    
    mockJobs.splice(index, 1);
    return true;
  },

  async toggleJob(id: string): Promise<MockJob | null> {
    await delay(300);
    const job = mockJobs.find((j) => j.id === id);
    if (!job) return null;
    
    job.status = job.status === "running" ? "pending" : "running";
    return job;
  },

  async getJobLogs(id: string): Promise<string[]> {
    await delay(400);
    const mockLogs = [
      `[2024-01-15 10:30:00] Starting job ${id}`,
      `[2024-01-15 10:30:05] Initializing data pipeline`,
      `[2024-01-15 10:30:15] Loading training data`,
      `[2024-01-15 10:30:45] Data loaded successfully (5000 samples)`,
      `[2024-01-15 10:31:00] Starting training process`,
      `[2024-01-15 10:35:30] Training complete`,
      `[2024-01-15 10:35:40] Evaluating model performance`,
      `[2024-01-15 10:36:00] Job completed successfully`,
    ];
    return mockLogs;
  },
};
