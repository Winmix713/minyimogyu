export type PredictionOutcome = 'pending' | 'correct' | 'incorrect' | 'void';

export interface Prediction {
  id: string;
  match_id: string;
  model_id: string;
  model_name?: string;
  predicted_outcome: string;
  confidence: number;
  actual_outcome?: string | null;
  outcome_status?: PredictionOutcome;
  created_at: string;
  match_date?: string;
  home_team?: string;
  away_team?: string;
  league?: string;
  odds?: Record<string, number> | null;
  features?: Record<string, unknown> | null;
}

export interface PredictionFilters {
  modelId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  outcomeStatus?: PredictionOutcome;
  league?: string;
}

export interface PredictionStats {
  total: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracy: number;
}
