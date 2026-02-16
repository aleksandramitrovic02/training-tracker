export interface WeeklyProgress {
  weekStart: string; // ISO date
  weekEnd: string;   // ISO date
  totalDurationMinutes: number;
  workoutCount: number;
  avgIntensity: number;
  avgFatigue: number;
}

export type MonthlyProgressResponse = WeeklyProgress[];

export type ProgressViewMode = 'weekly' | 'monthly';
