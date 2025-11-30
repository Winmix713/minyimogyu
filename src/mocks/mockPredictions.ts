export interface MockPrediction {
  id: string;
  modelId: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  prediction: "home" | "draw" | "away";
  confidence: number;
  odds: number;
  outcome?: "correct" | "incorrect" | "pending";
  createdAt: string;
  matchDate: string;
  homeScore?: number;
  awayScore?: number;
}

export const mockPredictions: MockPrediction[] = [
  {
    id: "pred-001",
    modelId: "model-001",
    matchId: "match-001",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    league: "Premier League",
    prediction: "home",
    confidence: 0.82,
    odds: 1.95,
    outcome: "correct",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    matchDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: "pred-002",
    modelId: "model-001",
    matchId: "match-002",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    league: "Premier League",
    prediction: "draw",
    confidence: 0.45,
    odds: 3.5,
    outcome: "incorrect",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    matchDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    homeScore: 3,
    awayScore: 1,
  },
  {
    id: "pred-003",
    modelId: "model-002",
    matchId: "match-003",
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    league: "La Liga",
    prediction: "away",
    confidence: 0.56,
    odds: 2.45,
    outcome: "correct",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    matchDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    homeScore: 1,
    awayScore: 2,
  },
  {
    id: "pred-004",
    modelId: "model-001",
    matchId: "match-004",
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    league: "Bundesliga",
    prediction: "home",
    confidence: 0.78,
    odds: 1.85,
    outcome: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    matchDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pred-005",
    modelId: "model-001",
    matchId: "match-005",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    league: "Ligue 1",
    prediction: "home",
    confidence: 0.84,
    odds: 1.72,
    outcome: "pending",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    matchDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pred-006",
    modelId: "model-002",
    matchId: "match-006",
    homeTeam: "Juventus",
    awayTeam: "AS Roma",
    league: "Serie A",
    prediction: "away",
    confidence: 0.52,
    odds: 2.8,
    outcome: "correct",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    matchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    homeScore: 0,
    awayScore: 1,
  },
];
