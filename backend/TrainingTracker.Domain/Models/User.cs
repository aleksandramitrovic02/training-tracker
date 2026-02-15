namespace TrainingTracker.Domain.Models;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;

    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
