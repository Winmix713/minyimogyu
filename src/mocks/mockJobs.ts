export interface MockJob {
  id: string;
  name: string;
  type: "training" | "prediction" | "validation" | "monitoring";
  status: "running" | "completed" | "failed" | "pending";
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  schedule?: string;
  description?: string;
  duration?: number;
  progress?: number;
  lastRun?: string;
  nextRun?: string;
}

export const mockJobs: MockJob[] = [
  {
    id: "job-001",
    name: "Daily Model Training",
    type: "training",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: "0 2 * * *",
    description: "Trains the champion model on the latest data",
    duration: 3600,
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
  },
  {
    id: "job-002",
    name: "Real-time Predictions",
    type: "prediction",
    status: "running",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: "*/15 * * * *",
    description: "Generates predictions for upcoming matches",
    duration: 900,
    lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    progress: 45,
  },
  {
    id: "job-003",
    name: "Model Validation",
    type: "validation",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: "0 4 * * *",
    description: "Validates model performance against test data",
    duration: 1800,
    lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    progress: 0,
  },
  {
    id: "job-004",
    name: "System Monitoring",
    type: "monitoring",
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    schedule: "*/5 * * * *",
    description: "Monitors system health and resource usage",
    duration: 300,
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    progress: 100,
  },
  {
    id: "job-005",
    name: "Ensemble Model Update",
    type: "training",
    status: "failed",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    schedule: "0 6 * * *",
    description: "Updates ensemble model with new training data",
    duration: 2400,
    completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    progress: 85,
  },
  {
    id: "job-006",
    name: "Cross-League Analysis",
    type: "validation",
    status: "completed",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    schedule: "0 8 * * *",
    description: "Analyzes cross-league prediction patterns",
    duration: 5400,
    completedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    progress: 100,
  },
];
