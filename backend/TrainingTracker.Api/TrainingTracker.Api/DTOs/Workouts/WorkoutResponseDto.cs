using TrainingTracker.Domain.Enums;

namespace TrainingTracker.Api.DTOs.Workouts;

public class WorkoutResponseDto
{
    public Guid Id { get; set; }
    public ExerciseType ExerciseType { get; set; }
    public int DurationMinutes { get; set; }
    public int CaloriesBurned { get; set; }
    public int Intensity { get; set; }
    public int Fatigue { get; set; }
    public string? Notes { get; set; }
    public DateTime WorkoutDateTime { get; set; }
}
