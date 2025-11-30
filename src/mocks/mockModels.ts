export interface MockModel {
  id: string;
  name: string;
  version: string;
  type: "champion" | "challenger" | "experimental";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  lastUpdated: string;
  status: "active" | "inactive" | "training" | "deprecated";
  algorithm: string;
  trafficAllocation: number;
  performance: {
    week: number;
    month: number;
    allTime: number;
  };
  predictions: number;
  successRate: number;
}

export const mockModels: MockModel[] = [
  {
    id: "model-001",
    name: "Championship Predictor v3",
    version: "3.2.1",
    type: "champion",
    accuracy: 0.76,
    precision: 0.78,
    recall: 0.74,
    f1Score: 0.76,
    lastTrained: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "active",
    algorithm: "XGBoost",
    trafficAllocation: 70,
    performance: {
      week: 72,
      month: 75,
      allTime: 76,
    },
    predictions: 1250,
    successRate: 0.756,
  },
  {
    id: "model-002",
    name: "Neural Net Challenger",
    version: "2.1.0",
    type: "challenger",
    accuracy: 0.72,
    precision: 0.74,
    recall: 0.70,
    f1Score: 0.72,
    lastTrained: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: "active",
    algorithm: "Neural Network",
    trafficAllocation: 20,
    performance: {
      week: 68,
      month: 71,
      allTime: 72,
    },
    predictions: 380,
    successRate: 0.720,
  },
  {
    id: "model-003",
    name: "Ensemble Experimental",
    version: "1.0.0",
    type: "experimental",
    accuracy: 0.68,
    precision: 0.70,
    recall: 0.66,
    f1Score: 0.68,
    lastTrained: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "training",
    algorithm: "Ensemble (RF + XGB + SVM)",
    trafficAllocation: 10,
    performance: {
      week: 65,
      month: 67,
      allTime: 68,
    },
    predictions: 120,
    successRate: 0.680,
  },
  {
    id: "model-004",
    name: "Legacy Predictor",
    version: "1.5.0",
    type: "champion",
    accuracy: 0.65,
    precision: 0.67,
    recall: 0.63,
    f1Score: 0.65,
    lastTrained: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    status: "inactive",
    algorithm: "Logistic Regression",
    trafficAllocation: 0,
    performance: {
      week: 0,
      month: 0,
      allTime: 65,
    },
    predictions: 0,
    successRate: 0.65,
  },
  {
    id: "model-005",
    name: "Cross-League Model",
    version: "2.0.0",
    type: "experimental",
    accuracy: 0.70,
    precision: 0.72,
    recall: 0.68,
    f1Score: 0.70,
    lastTrained: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    status: "active",
    algorithm: "Gradient Boosting",
    trafficAllocation: 0,
    performance: {
      week: 69,
      month: 70,
      allTime: 70,
    },
    predictions: 85,
    successRate: 0.700,
  },
];
