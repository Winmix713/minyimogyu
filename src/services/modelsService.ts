import { httpClient, unwrapResponse } from './api';
import { ModelRegistry } from '@/types/models';
import { mockModels } from './mockData';

// In-memory mock storage
let modelsData = [...mockModels];

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalPredictions: number;
  correctPredictions: number;
  incorrectPredictions: number;
}

export const modelsService = {
  getModels: async (): Promise<ModelRegistry[]> => {
    const response = await httpClient.get<ModelRegistry[]>('/models', modelsData);
    return unwrapResponse(response);
  },

  getModelById: async (id: string): Promise<ModelRegistry> => {
    const model = modelsData.find(m => m.id === id);
    
    if (!model) {
      throw new Error(`Model with id ${id} not found`);
    }

    const response = await httpClient.get<ModelRegistry>(`/models/${id}`, model);
    return unwrapResponse(response);
  },

  getModelMetrics: async (modelId: string): Promise<ModelMetrics> => {
    const model = modelsData.find(m => m.id === modelId);
    
    if (!model) {
      throw new Error(`Model with id ${modelId} not found`);
    }

    const totalPredictions = model.total_predictions || 0;
    const accuracy = model.accuracy || 0;
    const correctPredictions = Math.floor(totalPredictions * accuracy);
    const incorrectPredictions = totalPredictions - correctPredictions;

    const metrics: ModelMetrics = {
      accuracy: accuracy * 100,
      precision: (accuracy + Math.random() * 0.05) * 100,
      recall: (accuracy - Math.random() * 0.05) * 100,
      f1Score: accuracy * 100,
      totalPredictions,
      correctPredictions,
      incorrectPredictions,
    };

    const response = await httpClient.get<ModelMetrics>(`/models/${modelId}/metrics`, metrics);
    return unwrapResponse(response);
  },

  createModel: async (data: Partial<ModelRegistry>): Promise<ModelRegistry> => {
    const newModel: ModelRegistry = {
      id: `model-${Date.now()}`,
      model_name: data.model_name || 'new-model',
      model_version: data.model_version || 'v1.0.0',
      model_type: data.model_type || 'challenger',
      algorithm: data.algorithm || null,
      hyperparameters: data.hyperparameters || null,
      traffic_allocation: data.traffic_allocation || 0,
      total_predictions: 0,
      accuracy: null,
      registered_at: new Date().toISOString(),
      is_active: data.is_active ?? false,
      description: data.description,
    };

    modelsData.push(newModel);

    const response = await httpClient.post<ModelRegistry>('/models', data, newModel);
    return unwrapResponse(response);
  },

  updateModel: async (id: string, data: Partial<ModelRegistry>): Promise<ModelRegistry> => {
    const index = modelsData.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error(`Model with id ${id} not found`);
    }

    modelsData[index] = {
      ...modelsData[index],
      ...data,
    };

    const response = await httpClient.put<ModelRegistry>(`/models/${id}`, data, modelsData[index]);
    return unwrapResponse(response);
  },

  deleteModel: async (id: string): Promise<void> => {
    const index = modelsData.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error(`Model with id ${id} not found`);
    }

    modelsData.splice(index, 1);

    await httpClient.delete<void>(`/models/${id}`, undefined);
  },

  activateModel: async (id: string): Promise<ModelRegistry> => {
    return modelsService.updateModel(id, { is_active: true });
  },

  deactivateModel: async (id: string): Promise<ModelRegistry> => {
    return modelsService.updateModel(id, { is_active: false });
  },

  promoteModel: async (id: string): Promise<ModelRegistry> => {
    return modelsService.updateModel(id, { model_type: 'champion' });
  },

  retireModel: async (id: string): Promise<ModelRegistry> => {
    return modelsService.updateModel(id, { model_type: 'retired', is_active: false });
  },
};
