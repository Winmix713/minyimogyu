import { JobSummary } from '@/types/jobs';
import { ModelRegistry } from '@/types/models';
import { Prediction } from '@/types/prediction';
import { User } from '@/types/user';
import { Notification } from '@/types/notification';
import { AnalyticsMetric, ChartData } from '@/types/analytics';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@winmix.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'analyst@winmix.com',
    full_name: 'Data Analyst',
    role: 'analyst',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    email: 'user@winmix.com',
    full_name: 'Regular User',
    role: 'user',
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'john.doe@winmix.com',
    full_name: 'John Doe',
    role: 'analyst',
    created_at: '2024-02-15T00:00:00Z',
  },
  {
    id: '5',
    email: 'jane.smith@winmix.com',
    full_name: 'Jane Smith',
    role: 'user',
    created_at: '2024-03-01T00:00:00Z',
  },
];

// Mock Jobs
export const mockJobs: JobSummary[] = [
  {
    id: '1',
    job_name: 'daily-predictions',
    job_type: 'prediction',
    cron_schedule: '0 6 * * *',
    enabled: true,
    last_run_at: '2024-11-30T06:00:00Z',
    next_run_at: '2024-12-01T06:00:00Z',
    config: { league: 'Premier League', model: 'champion' },
    is_due: false,
    average_duration_ms: 12500,
    stats: {
      total_runs: 150,
      success_runs: 147,
    },
    last_log: {
      id: 'log-1',
      started_at: '2024-11-30T06:00:00Z',
      completed_at: '2024-11-30T06:00:12Z',
      status: 'success',
      duration_ms: 12000,
      records_processed: 25,
      error_message: null,
    },
  },
  {
    id: '2',
    job_name: 'model-training',
    job_type: 'data_import',
    cron_schedule: '0 2 * * 0',
    enabled: true,
    last_run_at: '2024-11-24T02:00:00Z',
    next_run_at: '2024-12-01T02:00:00Z',
    config: { model_type: 'challenger', epochs: 100 },
    is_due: false,
    average_duration_ms: 450000,
    stats: {
      total_runs: 48,
      success_runs: 46,
    },
    last_log: {
      id: 'log-2',
      started_at: '2024-11-24T02:00:00Z',
      completed_at: '2024-11-24T02:07:30Z',
      status: 'success',
      duration_ms: 450000,
      records_processed: 1000,
      error_message: null,
    },
  },
  {
    id: '3',
    job_name: 'data-aggregation',
    job_type: 'aggregation',
    cron_schedule: '*/30 * * * *',
    enabled: true,
    last_run_at: '2024-11-30T20:30:00Z',
    next_run_at: '2024-11-30T21:00:00Z',
    config: { aggregate_type: 'metrics' },
    is_due: false,
    average_duration_ms: 3500,
    stats: {
      total_runs: 2880,
      success_runs: 2875,
    },
    last_log: {
      id: 'log-3',
      started_at: '2024-11-30T20:30:00Z',
      completed_at: '2024-11-30T20:30:03Z',
      status: 'success',
      duration_ms: 3500,
      records_processed: 100,
      error_message: null,
    },
  },
  {
    id: '4',
    job_name: 'cleanup-old-logs',
    job_type: 'maintenance',
    cron_schedule: '0 0 * * *',
    enabled: true,
    last_run_at: '2024-11-30T00:00:00Z',
    next_run_at: '2024-12-01T00:00:00Z',
    config: { retention_days: 90 },
    is_due: false,
    average_duration_ms: 8000,
    stats: {
      total_runs: 120,
      success_runs: 120,
    },
    last_log: {
      id: 'log-4',
      started_at: '2024-11-30T00:00:00Z',
      completed_at: '2024-11-30T00:00:08Z',
      status: 'success',
      duration_ms: 8000,
      records_processed: 450,
      error_message: null,
    },
  },
  {
    id: '5',
    job_name: 'odds-sync',
    job_type: 'data_import',
    cron_schedule: '0 */4 * * *',
    enabled: false,
    last_run_at: '2024-11-29T16:00:00Z',
    next_run_at: null,
    config: { provider: 'bet365', markets: ['1X2', 'BTTS'] },
    is_due: false,
    average_duration_ms: 5500,
    stats: {
      total_runs: 45,
      success_runs: 43,
    },
    last_log: {
      id: 'log-5',
      started_at: '2024-11-29T16:00:00Z',
      completed_at: '2024-11-29T16:00:05Z',
      status: 'success',
      duration_ms: 5500,
      records_processed: 75,
      error_message: null,
    },
  },
  {
    id: '6',
    job_name: 'monitoring-alerts',
    job_type: 'monitoring',
    cron_schedule: '*/5 * * * *',
    enabled: true,
    last_run_at: '2024-11-30T20:55:00Z',
    next_run_at: '2024-11-30T21:00:00Z',
    config: { thresholds: { accuracy: 0.55, latency: 1000 } },
    is_due: true,
    average_duration_ms: 1200,
    stats: {
      total_runs: 8640,
      success_runs: 8638,
    },
    last_log: {
      id: 'log-6',
      started_at: '2024-11-30T20:55:00Z',
      completed_at: '2024-11-30T20:55:01Z',
      status: 'success',
      duration_ms: 1200,
      records_processed: 10,
      error_message: null,
    },
  },
];

// Mock Models
export const mockModels: ModelRegistry[] = [
  {
    id: 'model-1',
    model_name: 'XGBoost Champion',
    model_version: 'v2.3.1',
    model_type: 'champion',
    algorithm: 'xgboost',
    hyperparameters: { max_depth: 6, learning_rate: 0.1, n_estimators: 100 },
    traffic_allocation: 80,
    total_predictions: 5420,
    accuracy: 0.642,
    registered_at: '2024-09-15T10:00:00Z',
    is_active: true,
    description: 'Production champion model with proven performance',
  },
  {
    id: 'model-2',
    model_name: 'RandomForest Challenger',
    model_version: 'v1.5.0',
    model_type: 'challenger',
    algorithm: 'random_forest',
    hyperparameters: { n_estimators: 200, max_depth: 8, min_samples_split: 5 },
    traffic_allocation: 20,
    total_predictions: 1355,
    accuracy: 0.658,
    registered_at: '2024-11-01T08:00:00Z',
    is_active: true,
    description: 'Testing new algorithm variant with improved feature engineering',
  },
  {
    id: 'model-3',
    model_name: 'Neural Network v1',
    model_version: 'v1.0.0',
    model_type: 'retired',
    algorithm: 'neural_network',
    hyperparameters: { layers: [128, 64, 32], dropout: 0.3, learning_rate: 0.001 },
    traffic_allocation: 0,
    total_predictions: 3210,
    accuracy: 0.591,
    registered_at: '2024-06-01T12:00:00Z',
    is_active: false,
    description: 'Initial neural network experiment, retired due to performance',
  },
  {
    id: 'model-4',
    model_name: 'LightGBM Experimental',
    model_version: 'v0.9.2',
    model_type: 'challenger',
    algorithm: 'lightgbm',
    hyperparameters: { num_leaves: 31, learning_rate: 0.05, n_estimators: 150 },
    traffic_allocation: 0,
    total_predictions: 245,
    accuracy: 0.629,
    registered_at: '2024-11-25T14:00:00Z',
    is_active: false,
    description: 'Experimental model undergoing initial testing',
  },
  {
    id: 'model-5',
    model_name: 'Ensemble Model',
    model_version: 'v1.2.0',
    model_type: 'champion',
    algorithm: 'ensemble',
    hyperparameters: { models: ['xgboost', 'random_forest'], weights: [0.6, 0.4] },
    traffic_allocation: 0,
    total_predictions: 8750,
    accuracy: 0.655,
    registered_at: '2024-07-10T09:00:00Z',
    is_active: false,
    description: 'Previous champion, kept as backup',
  },
];

// Mock Predictions
const generateMockPredictions = (): Prediction[] => {
  const predictions: Prediction[] = [];
  const teams = [
    ['Manchester City', 'Liverpool'],
    ['Barcelona', 'Real Madrid'],
    ['Bayern Munich', 'Borussia Dortmund'],
    ['PSG', 'Marseille'],
    ['Juventus', 'Inter Milan'],
    ['Chelsea', 'Arsenal'],
    ['Atletico Madrid', 'Sevilla'],
    ['AC Milan', 'Napoli'],
  ];
  const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Ligue 1', 'Serie A'];
  const outcomes = ['HOME_WIN', 'DRAW', 'AWAY_WIN'];
  const statuses: Array<'pending' | 'correct' | 'incorrect' | 'void'> = ['pending', 'correct', 'incorrect'];

  for (let i = 0; i < 100; i++) {
    const team = teams[i % teams.length];
    const predictedOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const actualOutcome = Math.random() > 0.3 ? predictedOutcome : outcomes[Math.floor(Math.random() * outcomes.length)];
    const outcomeStatus = i < 20 ? 'pending' : (predictedOutcome === actualOutcome ? 'correct' : 'incorrect');
    
    predictions.push({
      id: `pred-${i + 1}`,
      match_id: `match-${i + 1}`,
      model_id: mockModels[i % mockModels.length].id,
      model_name: mockModels[i % mockModels.length].model_name,
      predicted_outcome: predictedOutcome,
      confidence: 0.55 + Math.random() * 0.3,
      actual_outcome: outcomeStatus === 'pending' ? null : actualOutcome,
      outcome_status: outcomeStatus,
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      match_date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      home_team: team[0],
      away_team: team[1],
      league: leagues[i % leagues.length],
      odds: {
        HOME_WIN: 1.5 + Math.random() * 2,
        DRAW: 3.0 + Math.random() * 1,
        AWAY_WIN: 2.0 + Math.random() * 2,
      },
    });
  }

  return predictions;
};

export const mockPredictions = generateMockPredictions();

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'success',
    priority: 'high',
    title: 'Model Performance Alert',
    message: 'Challenger model accuracy exceeded champion by 2.5%',
    read: false,
    actionUrl: '/admin/models',
    actionLabel: 'View Models',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'warning',
    priority: 'normal',
    title: 'Job Execution Delayed',
    message: 'daily-predictions job delayed by 15 minutes',
    read: false,
    actionUrl: '/admin/jobs',
    actionLabel: 'Check Jobs',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'info',
    priority: 'low',
    title: 'Weekly Report Available',
    message: 'Your weekly analytics report is ready',
    read: true,
    actionUrl: '/analytics',
    actionLabel: 'View Report',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    type: 'error',
    priority: 'high',
    title: 'Job Failed',
    message: 'odds-sync job failed due to API timeout',
    read: false,
    actionUrl: '/admin/jobs/5',
    actionLabel: 'View Details',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    type: 'success',
    priority: 'normal',
    title: 'Model Training Complete',
    message: 'New challenger model training completed successfully',
    read: true,
    actionUrl: '/admin/models',
    actionLabel: 'View Model',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Analytics Metrics
export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'metric-1',
    name: 'Total Predictions',
    value: 15432,
    previousValue: 14890,
    change: 542,
    changePercentage: 3.64,
    trend: 'up',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'metric-2',
    name: 'Overall Accuracy',
    value: 64.2,
    previousValue: 62.8,
    change: 1.4,
    changePercentage: 2.23,
    trend: 'up',
    unit: '%',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'metric-3',
    name: 'Active Models',
    value: 2,
    previousValue: 2,
    change: 0,
    changePercentage: 0,
    trend: 'stable',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'metric-4',
    name: 'Jobs Running',
    value: 5,
    previousValue: 6,
    change: -1,
    changePercentage: -16.67,
    trend: 'down',
    timestamp: new Date().toISOString(),
  },
];

// Mock Chart Data
export const mockChartData: ChartData[] = [
  {
    id: 'chart-1',
    title: 'Prediction Accuracy Trend',
    type: 'line',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 60 + Math.random() * 8,
      label: `Day ${i + 1}`,
    })),
    metadata: {
      xAxisLabel: 'Date',
      yAxisLabel: 'Accuracy (%)',
      color: '#10b981',
    },
  },
  {
    id: 'chart-2',
    title: 'Predictions by League',
    type: 'pie',
    data: [
      { date: '2024-11', value: 3500, label: 'Premier League', category: 'Premier League' },
      { date: '2024-11', value: 2800, label: 'La Liga', category: 'La Liga' },
      { date: '2024-11', value: 2400, label: 'Bundesliga', category: 'Bundesliga' },
      { date: '2024-11', value: 2100, label: 'Serie A', category: 'Serie A' },
      { date: '2024-11', value: 1900, label: 'Ligue 1', category: 'Ligue 1' },
    ],
    metadata: {
      xAxisLabel: 'League',
      yAxisLabel: 'Count',
    },
  },
  {
    id: 'chart-3',
    title: 'Model Performance Comparison',
    type: 'bar',
    data: mockModels.filter(m => m.is_active).map(model => ({
      date: model.registered_at || '',
      value: (model.accuracy || 0) * 100,
      label: model.model_name,
      category: model.model_type,
    })),
    metadata: {
      xAxisLabel: 'Model',
      yAxisLabel: 'Accuracy (%)',
      color: '#3b82f6',
    },
  },
];
