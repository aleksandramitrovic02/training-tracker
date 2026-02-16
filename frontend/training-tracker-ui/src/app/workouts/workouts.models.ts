export interface ExerciseType {
  value: number;
  name: string;
}

export interface Workout {
  id: string;
  exerciseType: number;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: number;
  fatigue: number;
  notes?: string | null;
  workoutDateTime: string; // ISO string
}

export interface CreateWorkoutRequest {
  exerciseType: number;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: number;
  fatigue: number;
  notes?: string | null;
  workoutDateTime: string;
}

export interface UpdateWorkoutRequest extends CreateWorkoutRequest {}
