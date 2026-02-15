namespace TrainingTracker.Api.DTOs.Workouts;

public class WorkoutResponseDto
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public string ExerciseName { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public int CaloriesBurned { get; set; }
    public int Intensity { get; set; }
    public int Fatigue { get; set; }
    public string? Notes { get; set; }
    public DateTime WorkoutDateTime { get; set; }
}
