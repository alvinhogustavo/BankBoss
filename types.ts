
export interface DailyPlan {
  entryValue: number;
  stopWin: number;
  stopLoss: number;
}

export interface HistoryEntry {
  date: string;
  bankroll: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';
