export interface WeeklyProgress {
  weekStart: string; // ISO date
  weekEnd: string;   // ISO date
  totalDurationMinutes: number;
  workoutCount: number;
  avgIntensity: number;
  avgFatigue: number;
}

export interface MonthlyProgressResponse {
  year: number;
  month: number;
  weeks: WeeklyProgress[];
}
