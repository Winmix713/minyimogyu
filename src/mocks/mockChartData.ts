export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
  tension?: number;
}

export interface StatData {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon?: string;
}

export const mockChartData = {
  accuracyOverTime: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Champion Model",
        data: [72, 73, 75, 74, 76, 76],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Challenger Model",
        data: [68, 69, 70, 71, 71, 72],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  } as ChartData,

  predictionDistribution: {
    labels: ["Home Win", "Draw", "Away Win"],
    datasets: [
      {
        label: "Prediction Count",
        data: [450, 210, 590],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(168, 85, 247)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 1,
      },
    ],
  } as ChartData,

  performanceByLeague: {
    labels: ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"],
    datasets: [
      {
        label: "Accuracy %",
        data: [78, 74, 76, 72, 75],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  } as ChartData,

  trafficAllocation: {
    labels: ["Champion", "Challenger", "Experimental"],
    datasets: [
      {
        label: "Traffic %",
        data: [70, 20, 10],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(168, 85, 247)",
        ],
        borderWidth: 1,
      },
    ],
  } as ChartData,

  confusionMatrix: {
    labels: ["True Positive", "False Positive", "False Negative", "True Negative"],
    datasets: [
      {
        label: "Count",
        data: [820, 180, 150, 850],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(239, 68, 68)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 1,
      },
    ],
  } as ChartData,

  dailyStats: [
    { title: "Total Predictions", value: 1250, change: 12, changeType: "increase" as const },
    { title: "Accuracy Rate", value: "76%", change: 2, changeType: "increase" as const },
    { title: "Active Models", value: 3, change: 0, changeType: "neutral" as const },
    { title: "Scheduled Jobs", value: 12, change: 5, changeType: "increase" as const },
  ] as StatData[],

  weeklyStats: [
    { title: "Total Matches Analyzed", value: 8450, change: -3, changeType: "decrease" as const },
    { title: "Average Confidence", value: "0.72", change: 1, changeType: "increase" as const },
    { title: "System Uptime", value: "99.8%", change: 0, changeType: "neutral" as const },
    { title: "API Calls", value: 52430, change: 8, changeType: "increase" as const },
  ] as StatData[],

  monthlyStats: [
    { title: "Model Updates", value: 24, change: 6, changeType: "increase" as const },
    { title: "Performance Gain", value: "+3.2%", change: 3, changeType: "increase" as const },
    { title: "Data Points Processed", value: 125430, change: 12, changeType: "increase" as const },
    { title: "Critical Alerts", value: 2, change: -4, changeType: "decrease" as const },
  ] as StatData[],
};
