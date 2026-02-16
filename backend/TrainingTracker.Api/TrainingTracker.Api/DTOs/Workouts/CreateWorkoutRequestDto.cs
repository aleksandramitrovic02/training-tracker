using TrainingTracker.Domain.Enums;

namespace TrainingTracker.Api.DTOs.Workouts;

public class CreateWorkoutRequestDto
{
    public ExerciseType ExerciseType { get; set; }
    public int DurationMinutes { get; set; }
    public int CaloriesBurned { get; set; }
    public int Intensity { get; set; } // 1-10
    public int Fatigue { get; set; }   // 1-10
    public string? Notes { get; set; }
    public DateTime WorkoutDateTime { get; set; }
}
