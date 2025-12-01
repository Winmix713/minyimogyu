import { create } from 'zustand';
import { Prediction, PredictionFilters, PredictionStats } from '@/types/prediction';
import { predictionsService } from '@/services/predictionsService';

interface PredictionsState {
  predictions: Prediction[];
  filters: PredictionFilters;
  stats: PredictionStats | null;
  loading: boolean;
  error: string | null;
}

interface PredictionsActions {
  fetchPredictions: (filters?: PredictionFilters) => Promise<void>;
  fetchPredictionById: (id: string) => Promise<Prediction>;
  fetchPredictionStats: (filters?: PredictionFilters) => Promise<void>;
  createPrediction: (data: Partial<Prediction>) => Promise<void>;
  updatePredictionOutcome: (id: string, outcome: string) => Promise<void>;
  deletePrediction: (id: string) => Promise<void>;
  setFilters: (filters: PredictionFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

type PredictionsStore = PredictionsState & PredictionsActions;

export const usePredictionsStore = create<PredictionsStore>((set, get) => ({
  // Initial state
  predictions: [],
  filters: {},
  stats: null,
  loading: false,
  error: null,

  // Actions
  fetchPredictions: async (filters?: PredictionFilters) => {
    set({ loading: true, error: null });
    
    try {
      const predictions = await predictionsService.getPredictions(filters);
      set({ predictions, filters: filters || {}, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch predictions';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchPredictionById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const prediction = await predictionsService.getPredictionById(id);
      set({ loading: false });
      return prediction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prediction';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchPredictionStats: async (filters?: PredictionFilters) => {
    set({ loading: true, error: null });
    
    try {
      const stats = await predictionsService.getPredictionStats(filters);
      set({ stats, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prediction stats';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createPrediction: async (data: Partial<Prediction>) => {
    set({ loading: true, error: null });
    
    try {
      const newPrediction = await predictionsService.createPrediction(data);
      set((state) => ({
        predictions: [newPrediction, ...state.predictions],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create prediction';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updatePredictionOutcome: async (id: string, outcome: string) => {
    set({ loading: true, error: null });
    
    try {
      const updatedPrediction = await predictionsService.updatePredictionOutcome(id, outcome);
      set((state) => ({
        predictions: state.predictions.map(pred =>
          pred.id === id ? updatedPrediction : pred
        ),
        loading: false,
      }));
      
      // Refetch stats after updating outcome
      const currentFilters = get().filters;
      await get().fetchPredictionStats(currentFilters);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update prediction outcome';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deletePrediction: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await predictionsService.deletePrediction(id);
      set((state) => ({
        predictions: state.predictions.filter(pred => pred.id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete prediction';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  setFilters: (filters: PredictionFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks
export const usePredictions = () => usePredictionsStore((state) => ({
  predictions: state.predictions,
  loading: state.loading,
  error: state.error,
  stats: state.stats,
}));

export const usePredictionsLoading = () => usePredictionsStore((state) => state.loading);
export const usePredictionsError = () => usePredictionsStore((state) => state.error);
export const usePredictionFilters = () => usePredictionsStore((state) => state.filters);
export const usePredictionStats = () => usePredictionsStore((state) => state.stats);

export const usePredictionsByModel = (modelId?: string) => {
  const predictions = usePredictionsStore((state) => state.predictions);
  return modelId ? predictions.filter(pred => pred.model_id === modelId) : predictions;
};

export const usePredictionsActions = () => usePredictionsStore((state) => ({
  fetchPredictions: state.fetchPredictions,
  fetchPredictionById: state.fetchPredictionById,
  fetchPredictionStats: state.fetchPredictionStats,
  createPrediction: state.createPrediction,
  updatePredictionOutcome: state.updatePredictionOutcome,
  deletePrediction: state.deletePrediction,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  clearError: state.clearError,
}));
