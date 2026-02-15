export interface Workout {
  id: string;
  exerciseId: string;
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: number;
  fatigue: number;
  notes?: string | null;
  workoutDateTime: string; // ISO string
}

export interface CreateWorkoutRequest {
  exerciseId: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: number;
  fatigue: number;
  notes?: string | null;
  workoutDateTime: string;
}

export interface UpdateWorkoutRequest extends CreateWorkoutRequest {}
