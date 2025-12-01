import { create } from 'zustand';
import { ModelRegistry } from '@/types/models';
import { modelsService, ModelMetrics } from '@/services/modelsService';

interface ModelsState {
  models: ModelRegistry[];
  selectedModelId: string | null;
  modelMetrics: Record<string, ModelMetrics>;
  loading: boolean;
  error: string | null;
}

interface ModelsActions {
  fetchModels: () => Promise<void>;
  fetchModelById: (id: string) => Promise<ModelRegistry>;
  fetchModelMetrics: (modelId: string) => Promise<void>;
  createModel: (data: Partial<ModelRegistry>) => Promise<void>;
  updateModel: (id: string, data: Partial<ModelRegistry>) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  activateModel: (id: string) => Promise<void>;
  deactivateModel: (id: string) => Promise<void>;
  promoteModel: (id: string) => Promise<void>;
  retireModel: (id: string) => Promise<void>;
  selectModel: (id: string | null) => void;
  clearError: () => void;
}

type ModelsStore = ModelsState & ModelsActions;

export const useModelsStore = create<ModelsStore>((set, get) => ({
  // Initial state
  models: [],
  selectedModelId: null,
  modelMetrics: {},
  loading: false,
  error: null,

  // Actions
  fetchModels: async () => {
    set({ loading: true, error: null });
    
    try {
      const models = await modelsService.getModels();
      set({ models, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch models';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchModelById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const model = await modelsService.getModelById(id);
      set({ loading: false });
      return model;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchModelMetrics: async (modelId: string) => {
    set({ loading: true, error: null });
    
    try {
      const metrics = await modelsService.getModelMetrics(modelId);
      set((state) => ({
        modelMetrics: {
          ...state.modelMetrics,
          [modelId]: metrics,
        },
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch model metrics';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createModel: async (data: Partial<ModelRegistry>) => {
    set({ loading: true, error: null });
    
    try {
      const newModel = await modelsService.createModel(data);
      set((state) => ({
        models: [...state.models, newModel],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateModel: async (id: string, data: Partial<ModelRegistry>) => {
    set({ loading: true, error: null });
    
    try {
      const updatedModel = await modelsService.updateModel(id, data);
      set((state) => ({
        models: state.models.map(model => model.id === id ? updatedModel : model),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteModel: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await modelsService.deleteModel(id);
      set((state) => ({
        models: state.models.filter(model => model.id !== id),
        selectedModelId: state.selectedModelId === id ? null : state.selectedModelId,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  activateModel: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const updatedModel = await modelsService.activateModel(id);
      set((state) => ({
        models: state.models.map(model => model.id === id ? updatedModel : model),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to activate model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deactivateModel: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const updatedModel = await modelsService.deactivateModel(id);
      set((state) => ({
        models: state.models.map(model => model.id === id ? updatedModel : model),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deactivate model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  promoteModel: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const updatedModel = await modelsService.promoteModel(id);
      set((state) => ({
        models: state.models.map(model => model.id === id ? updatedModel : model),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to promote model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  retireModel: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const updatedModel = await modelsService.retireModel(id);
      set((state) => ({
        models: state.models.map(model => model.id === id ? updatedModel : model),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retire model';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  selectModel: (id: string | null) => {
    set({ selectedModelId: id });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks
export const useModels = () => useModelsStore((state) => ({
  models: state.models,
  loading: state.loading,
  error: state.error,
}));

export const useModelsLoading = () => useModelsStore((state) => state.loading);
export const useModelsError = () => useModelsStore((state) => state.error);
export const useSelectedModel = () => {
  const models = useModelsStore((state) => state.models);
  const selectedModelId = useModelsStore((state) => state.selectedModelId);
  return models.find(model => model.id === selectedModelId) || null;
};

export const useModelMetrics = (modelId?: string) => {
  const metrics = useModelsStore((state) => state.modelMetrics);
  return modelId ? metrics[modelId] : null;
};

export const useModelsActions = () => useModelsStore((state) => ({
  fetchModels: state.fetchModels,
  fetchModelById: state.fetchModelById,
  fetchModelMetrics: state.fetchModelMetrics,
  createModel: state.createModel,
  updateModel: state.updateModel,
  deleteModel: state.deleteModel,
  activateModel: state.activateModel,
  deactivateModel: state.deactivateModel,
  promoteModel: state.promoteModel,
  retireModel: state.retireModel,
  selectModel: state.selectModel,
  clearError: state.clearError,
}));
