import { httpClient, unwrapResponse } from './api';
import { Prediction, PredictionFilters, PredictionStats } from '@/types/prediction';
import { mockPredictions } from './mockData';

// In-memory mock storage
let predictionsData = [...mockPredictions];

export const predictionsService = {
  getPredictions: async (filters?: PredictionFilters): Promise<Prediction[]> => {
    let filtered = [...predictionsData];

    if (filters?.modelId) {
      filtered = filtered.filter(p => p.model_id === filters.modelId);
    }

    if (filters?.outcomeStatus) {
      filtered = filtered.filter(p => p.outcome_status === filters.outcomeStatus);
    }

    if (filters?.league) {
      filtered = filtered.filter(p => p.league === filters.league);
    }

    if (filters?.dateRange) {
      const from = new Date(filters.dateRange.from);
      const to = new Date(filters.dateRange.to);
      
      filtered = filtered.filter(p => {
        const matchDate = new Date(p.match_date || p.created_at);
        return matchDate >= from && matchDate <= to;
      });
    }

    const response = await httpClient.get<Prediction[]>('/predictions', filtered);
    return unwrapResponse(response);
  },

  getPredictionById: async (id: string): Promise<Prediction> => {
    const prediction = predictionsData.find(p => p.id === id);
    
    if (!prediction) {
      throw new Error(`Prediction with id ${id} not found`);
    }

    const response = await httpClient.get<Prediction>(`/predictions/${id}`, prediction);
    return unwrapResponse(response);
  },

  createPrediction: async (data: Partial<Prediction>): Promise<Prediction> => {
    const newPrediction: Prediction = {
      id: `pred-${Date.now()}`,
      match_id: data.match_id || '',
      model_id: data.model_id || '',
      model_name: data.model_name,
      predicted_outcome: data.predicted_outcome || '',
      confidence: data.confidence || 0.5,
      actual_outcome: null,
      outcome_status: 'pending',
      created_at: new Date().toISOString(),
      match_date: data.match_date,
      home_team: data.home_team,
      away_team: data.away_team,
      league: data.league,
      odds: data.odds || null,
      features: data.features || null,
    };

    predictionsData.push(newPrediction);

    const response = await httpClient.post<Prediction>('/predictions', data, newPrediction);
    return unwrapResponse(response);
  },

  updatePredictionOutcome: async (id: string, outcome: string): Promise<Prediction> => {
    const index = predictionsData.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Prediction with id ${id} not found`);
    }

    const prediction = predictionsData[index];
    const outcomeStatus = prediction.predicted_outcome === outcome ? 'correct' : 'incorrect';

    predictionsData[index] = {
      ...prediction,
      actual_outcome: outcome,
      outcome_status: outcomeStatus,
    };

    const response = await httpClient.patch<Prediction>(
      `/predictions/${id}/outcome`,
      { outcome },
      predictionsData[index]
    );
    return unwrapResponse(response);
  },

  getPredictionStats: async (filters?: PredictionFilters): Promise<PredictionStats> => {
    const predictions = await predictionsService.getPredictions(filters);
    
    const total = predictions.length;
    const correct = predictions.filter(p => p.outcome_status === 'correct').length;
    const incorrect = predictions.filter(p => p.outcome_status === 'incorrect').length;
    const pending = predictions.filter(p => p.outcome_status === 'pending').length;
    const accuracy = total > 0 ? (correct / (correct + incorrect)) * 100 : 0;

    const stats: PredictionStats = {
      total,
      correct,
      incorrect,
      pending,
      accuracy,
    };

    const response = await httpClient.get<PredictionStats>('/predictions/stats', stats);
    return unwrapResponse(response);
  },

  deletePrediction: async (id: string): Promise<void> => {
    const index = predictionsData.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Prediction with id ${id} not found`);
    }

    predictionsData.splice(index, 1);

    await httpClient.delete<void>(`/predictions/${id}`, undefined);
  },
};
