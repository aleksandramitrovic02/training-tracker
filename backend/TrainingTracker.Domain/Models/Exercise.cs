namespace TrainingTracker.Domain.Models;

public class Exercise
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }         
    public string Name { get; set; } = string.Empty;  
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
