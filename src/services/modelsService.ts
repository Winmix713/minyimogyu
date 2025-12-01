import { mockModels, type MockModel } from "@/mocks/mockModels";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ModelFormData {
  name: string;
  algorithm: string;
  type: MockModel["type"];
  hyperparameters?: string;
}

export const modelsService = {
  async getModels(): Promise<MockModel[]> {
    await delay(500);
    return [...mockModels];
  },

  async getModelById(id: string): Promise<MockModel | null> {
    await delay(300);
    return mockModels.find((model) => model.id === id) || null;
  },

  async getActiveModels(): Promise<MockModel[]> {
    await delay(400);
    return mockModels.filter((m) => m.status === "active");
  },

  async createModel(data: ModelFormData): Promise<MockModel> {
    await delay(1500);
    const newModel: MockModel = {
      id: `model-${Date.now()}`,
      ...data,
      version: "1.0.0",
      accuracy: 0.65,
      precision: 0.67,
      recall: 0.63,
      f1Score: 0.65,
      lastTrained: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "training",
      trafficAllocation: 0,
      performance: {
        week: 0,
        month: 0,
        allTime: 65,
      },
      predictions: 0,
      successRate: 0.65,
    };
    mockModels.push(newModel);
    return newModel;
  },

  async updateModel(id: string, data: Partial<ModelFormData>): Promise<MockModel | null> {
    await delay(1000);
    const model = mockModels.find((m) => m.id === id);
    if (!model) return null;
    
    Object.assign(model, data, { lastUpdated: new Date().toISOString() });
    return model;
  },

  async deleteModel(id: string): Promise<boolean> {
    await delay(500);
    const index = mockModels.findIndex((m) => m.id === id);
    if (index === -1) return false;
    
    mockModels.splice(index, 1);
    return true;
  },

  async trainModel(id: string): Promise<MockModel | null> {
    await delay(2000);
    const model = mockModels.find((m) => m.id === id);
    if (!model) return null;
    
    model.status = "training";
    model.lastTrained = new Date().toISOString();
    
    // Simulate training completion
    setTimeout(() => {
      model.status = "active";
      model.accuracy = Math.max(0, Math.min(1, model.accuracy + Math.random() * 0.05 - 0.02));
      model.precision = Math.max(0, Math.min(1, model.precision + Math.random() * 0.05 - 0.02));
      model.recall = Math.max(0, Math.min(1, model.recall + Math.random() * 0.05 - 0.02));
    }, 3000);
    
    return model;
  },

  async compareModels(modelIds: string[]): Promise<MockModel[]> {
    await delay(600);
    return mockModels.filter((m) => modelIds.includes(m.id));
  },

  async getModelMetrics(id: string): Promise<Record<string, unknown>> {
    await delay(400);
    const model = mockModels.find((m) => m.id === id);
    if (!model) return {};
    
    return {
      accuracy: model.accuracy,
      precision: model.precision,
      recall: model.recall,
      f1Score: model.f1Score,
      rocAuc: Math.random() * 0.3 + 0.7,
      confusionMatrix: {
        tp: 820,
        fp: 180,
        fn: 150,
        tn: 850,
      },
    };
  },
};
