import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export function useDailyStats() {
  return useQuery({
    queryKey: ["analytics-daily-stats"],
    queryFn: () => analyticsService.getDailyStats(),
  });
}

export function useWeeklyStats() {
  return useQuery({
    queryKey: ["analytics-weekly-stats"],
    queryFn: () => analyticsService.getWeeklyStats(),
  });
}

export function useMonthlyStats() {
  return useQuery({
    queryKey: ["analytics-monthly-stats"],
    queryFn: () => analyticsService.getMonthlyStats(),
  });
}

export function useAccuracyChart() {
  return useQuery({
    queryKey: ["analytics-accuracy-chart"],
    queryFn: () => analyticsService.getAccuracyChart(),
  });
}

export function usePredictionDistribution() {
  return useQuery({
    queryKey: ["analytics-prediction-distribution"],
    queryFn: () => analyticsService.getPredictionDistribution(),
  });
}

export function usePerformanceByLeague() {
  return useQuery({
    queryKey: ["analytics-performance-league"],
    queryFn: () => analyticsService.getPerformanceByLeague(),
  });
}

export function useTrafficAllocation() {
  return useQuery({
    queryKey: ["analytics-traffic-allocation"],
    queryFn: () => analyticsService.getTrafficAllocation(),
  });
}

export function useConfusionMatrix() {
  return useQuery({
    queryKey: ["analytics-confusion-matrix"],
    queryFn: () => analyticsService.getConfusionMatrix(),
  });
}

export function usePredictionAnalytics() {
  return useQuery({
    queryKey: ["analytics-predictions"],
    queryFn: () => analyticsService.getPredictionAnalytics(),
    refetchInterval: 30000,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["analytics-system-health"],
    queryFn: () => analyticsService.getSystemHealth(),
    refetchInterval: 20000,
  });
}

export function usePerformanceTrends() {
  return useQuery({
    queryKey: ["analytics-performance-trends"],
    queryFn: () => analyticsService.getPerformanceTrends(),
  });
}
