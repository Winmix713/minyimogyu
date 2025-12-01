export interface MockAlert {
  id: string;
  type: "system" | "performance" | "prediction" | "resource";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata?: Record<string, unknown>;
}

export const mockAlerts: MockAlert[] = [
  {
    id: "alert-001",
    type: "performance",
    severity: "warning",
    title: "Model Accuracy Degradation",
    message: "Champion model accuracy dropped from 76% to 71% in the last hour",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    metadata: {
      modelId: "model-001",
      previousAccuracy: 0.76,
      currentAccuracy: 0.71,
    },
  },
  {
    id: "alert-002",
    type: "resource",
    severity: "critical",
    title: "Memory Usage Critical",
    message: "Server memory usage exceeded 95% threshold",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    resolved: false,
    metadata: {
      memoryUsage: 96.5,
      threshold: 95,
    },
  },
  {
    id: "alert-003",
    type: "system",
    severity: "info",
    title: "Scheduled Job Completed",
    message: "Daily model training job completed successfully",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: {
      jobId: "job-001",
      duration: 3600,
    },
  },
  {
    id: "alert-004",
    type: "prediction",
    severity: "warning",
    title: "High Variance in Predictions",
    message: "Prediction confidence scores show unusual variance across models",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    resolved: false,
    metadata: {
      varianceScore: 0.85,
      normalRange: [0.1, 0.3],
    },
  },
  {
    id: "alert-005",
    type: "system",
    severity: "info",
    title: "Data Sync Completed",
    message: "Cross-league data synchronization completed",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    metadata: {
      recordsProcessed: 5432,
    },
  },
  {
    id: "alert-006",
    type: "performance",
    severity: "warning",
    title: "API Response Time Degradation",
    message: "Average API response time increased to 450ms (normal: 150ms)",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    resolved: false,
    metadata: {
      currentResponseTime: 450,
      normalResponseTime: 150,
    },
  },
];
