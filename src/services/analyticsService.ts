import { mockChartData, type ChartData, type StatData } from "@/mocks/mockChartData";
import { mockPredictions } from "@/mocks/mockPredictions";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}

export const analyticsService = {
  async getDailyStats(): Promise<StatData[]> {
    await delay(400);
    return mockChartData.dailyStats;
  },

  async getWeeklyStats(): Promise<StatData[]> {
    await delay(400);
    return mockChartData.weeklyStats;
  },

  async getMonthlyStats(): Promise<StatData[]> {
    await delay(400);
    return mockChartData.monthlyStats;
  },

  async getAccuracyChart(): Promise<ChartData> {
    await delay(300);
    return mockChartData.accuracyOverTime;
  },

  async getPredictionDistribution(): Promise<ChartData> {
    await delay(300);
    return mockChartData.predictionDistribution;
  },

  async getPerformanceByLeague(): Promise<ChartData> {
    await delay(300);
    return mockChartData.performanceByLeague;
  },

  async getTrafficAllocation(): Promise<ChartData> {
    await delay(300);
    return mockChartData.trafficAllocation;
  },

  async getConfusionMatrix(): Promise<ChartData> {
    await delay(300);
    return mockChartData.confusionMatrix;
  },

  async getPredictionAnalytics(dateRange?: AnalyticsDateRange) {
    await delay(600);
    
    const totalPredictions = mockPredictions.length;
    const correctPredictions = mockPredictions.filter((p) => p.outcome === "correct").length;
    const incorrectPredictions = mockPredictions.filter((p) => p.outcome === "incorrect").length;
    const pendingPredictions = mockPredictions.filter((p) => p.outcome === "pending").length;

    return {
      totalPredictions,
      correctPredictions,
      incorrectPredictions,
      pendingPredictions,
      accuracy: totalPredictions > 0 
        ? ((correctPredictions + pendingPredictions / 2) / totalPredictions * 100).toFixed(2)
        : 0,
      averageConfidence: (
        mockPredictions.reduce((sum, p) => sum + p.confidence, 0) / 
        mockPredictions.length
      ).toFixed(2),
      predictions: mockPredictions,
    };
  },

  async getSystemHealth() {
    await delay(300);
    return {
      cpuUsage: Math.random() * 45 + 20,
      memoryUsage: Math.random() * 50 + 30,
      diskUsage: Math.random() * 60 + 15,
      uptime: "45 days",
      lastUpdate: new Date().toISOString(),
      status: "healthy",
    };
  },

  async getPerformanceTrends() {
    await delay(400);
    return {
      week: [72, 73, 75, 74, 76, 75, 76],
      month: [68, 70, 71, 72, 73, 74, 75, 76],
      quarter: [62, 65, 68, 70, 72, 73, 74, 75, 76],
    };
  },
};
