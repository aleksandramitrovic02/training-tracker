using TrainingTracker.Domain.Enums;

namespace TrainingTracker.Domain.Models;

public class Workout
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    public ExerciseType ExerciseType { get; set; }

    public int DurationMinutes { get; set; }
    public int CaloriesBurned { get; set; }

    public int Intensity { get; set; } // 1-10
    public int Fatigue { get; set; }   // 1-10

    public string? Notes { get; set; }

    public DateTime WorkoutDateTime { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
