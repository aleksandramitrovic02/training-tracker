namespace TrainingTracker.Api.DTOs.Progress;

public class WeeklyProgressDto
{
    public int WeekNumber { get; set; }               
    public DateTime WeekStart { get; set; }           
    public DateTime WeekEnd { get; set; }             

    public int WorkoutCount { get; set; }
    public int TotalDurationMinutes { get; set; }

    public double AvgIntensity { get; set; }
    public double AvgFatigue { get; set; }
}
