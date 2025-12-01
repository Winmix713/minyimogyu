import type { UserPrediction, UserPredictionForm, UserPredictionResponse, CrowdWisdom, CrowdWisdomResponse } from '@/types/phase9';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for user predictions (will be replaced with actual API calls)
const userPredictions: UserPrediction[] = [];

export const CollaborativeIntelligenceService = {
  /**
   * Submit a user prediction for a match
   */
  async submitUserPrediction(
    predictionData: UserPredictionForm & { match_id: string },
    userId: string
  ): Promise<UserPredictionResponse> {
    await delay(800);

    try {
      const prediction: UserPrediction = {
        id: `pred-${Date.now()}`,
        match_id: predictionData.match_id,
        user_id: userId,
        predicted_outcome: predictionData.predicted_outcome,
        confidence_score: predictionData.confidence_score,
        predicted_home_score: predictionData.predicted_home_score,
        predicted_away_score: predictionData.predicted_away_score,
        btts_prediction: predictionData.btts_prediction,
        over_under_prediction: predictionData.over_under_prediction,
        reasoning: predictionData.reasoning,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      userPredictions.push(prediction);

      return {
        success: true,
        prediction,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to submit prediction',
      };
    }
  },

  /**
   * Get all predictions for a specific match
   */
  async getMatchPredictions(matchId: string): Promise<UserPrediction[]> {
    await delay(500);
    return userPredictions.filter((p) => p.match_id === matchId);
  },

  /**
   * Get predictions for a specific user
   */
  async getUserPredictions(userId: string): Promise<UserPrediction[]> {
    await delay(500);
    return userPredictions.filter((p) => p.user_id === userId);
  },

  /**
   * Calculate crowd wisdom (consensus) for a match
   */
  async calculateCrowdWisdom(matchId: string): Promise<CrowdWisdomResponse> {
    await delay(600);

    try {
      const matchPredictions = userPredictions.filter((p) => p.match_id === matchId);

      if (matchPredictions.length === 0) {
        return {
          success: false,
          error: 'No predictions found for this match',
        };
      }

      const totalPredictions = matchPredictions.length;
      const homeWinCount = matchPredictions.filter((p) => p.predicted_outcome === 'home_win').length;
      const drawCount = matchPredictions.filter((p) => p.predicted_outcome === 'draw').length;
      const awayWinCount = matchPredictions.filter((p) => p.predicted_outcome === 'away_win').length;

      const homeWinPercentage = homeWinCount / totalPredictions;
      const drawPercentage = drawCount / totalPredictions;
      const awayWinPercentage = awayWinCount / totalPredictions;

      const averageConfidence =
        matchPredictions.reduce((sum, p) => sum + p.confidence_score, 0) / totalPredictions;

      let consensusPrediction: 'home_win' | 'draw' | 'away_win' | undefined;
      let consensusConfidence = 0;

      if (homeWinPercentage > drawPercentage && homeWinPercentage > awayWinPercentage) {
        consensusPrediction = 'home_win';
        consensusConfidence = homeWinPercentage * 100;
      } else if (drawPercentage > homeWinPercentage && drawPercentage > awayWinPercentage) {
        consensusPrediction = 'draw';
        consensusConfidence = drawPercentage * 100;
      } else if (awayWinPercentage > homeWinPercentage && awayWinPercentage > drawPercentage) {
        consensusPrediction = 'away_win';
        consensusConfidence = awayWinPercentage * 100;
      }

      const crowdWisdom: CrowdWisdom = {
        id: `cw-${Date.now()}`,
        match_id: matchId,
        total_predictions: totalPredictions,
        home_win_predictions: homeWinCount,
        draw_predictions: drawCount,
        away_win_predictions: awayWinCount,
        average_confidence: averageConfidence,
        consensus_prediction: consensusPrediction,
        consensus_confidence: consensusConfidence,
        model_vs_crowd_divergence: 0, // Will be calculated with model predictions
        last_calculated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        success: true,
        crowdWisdom,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to calculate crowd wisdom',
      };
    }
  },

  /**
   * Delete a user prediction
   */
  async deleteUserPrediction(predictionId: string, userId: string): Promise<UserPredictionResponse> {
    await delay(500);

    try {
      const index = userPredictions.findIndex((p) => p.id === predictionId && p.user_id === userId);

      if (index === -1) {
        return {
          success: false,
          error: 'Prediction not found',
        };
      }

      const deleted = userPredictions.splice(index, 1)[0];

      return {
        success: true,
        prediction: deleted,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete prediction',
      };
    }
  },

  /**
   * Update a user prediction
   */
  async updateUserPrediction(
    predictionId: string,
    userId: string,
    updates: Partial<UserPredictionForm>
  ): Promise<UserPredictionResponse> {
    await delay(600);

    try {
      const prediction = userPredictions.find((p) => p.id === predictionId && p.user_id === userId);

      if (!prediction) {
        return {
          success: false,
          error: 'Prediction not found',
        };
      }

      Object.assign(prediction, updates, {
        updated_at: new Date().toISOString(),
      });

      return {
        success: true,
        prediction,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update prediction',
      };
    }
  },
};
