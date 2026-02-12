using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingTracker.Api.DTOs.Progress;
using TrainingTracker.Api.Extensions;
using TrainingTracker.Core.Interfaces;

namespace TrainingTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProgressController : ControllerBase
{
    private readonly IWorkoutRepository _workoutRepository;

    public ProgressController(IWorkoutRepository workoutRepository)
    {
        _workoutRepository = workoutRepository;
    }

    [HttpGet("monthly")]
    public async Task<ActionResult<IReadOnlyList<WeeklyProgressDto>>> GetMonthly(
        [FromQuery] int year,
        [FromQuery] int month,
        CancellationToken ct)
    {
        if (year < 2000 || year > 2100) return BadRequest(new { message = "Invalid year." });
        if (month < 1 || month > 12) return BadRequest(new { message = "Invalid month." });

        var userId = User.GetUserId();

        var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Unspecified);
        var monthEndExclusive = monthStart.AddMonths(1);

        var workouts = await _workoutRepository.GetByUserAndDateRangeAsync(userId, monthStart, monthEndExclusive, ct);

      
        var weeks = BuildWeeksForMonth(monthStart, monthEndExclusive);

        var result = weeks.Select((w, index) =>
        {
            var weekWorkouts = workouts
                .Where(x => x.WorkoutDateTime >= w.start && x.WorkoutDateTime <= w.endInclusive)
                .ToList();

            return new WeeklyProgressDto
            {
                WeekNumber = index + 1,
                WeekStart = w.start,
                WeekEnd = w.endInclusive,
                WorkoutCount = weekWorkouts.Count,
                TotalDurationMinutes = weekWorkouts.Sum(x => x.DurationMinutes),
                AvgIntensity = weekWorkouts.Count == 0 ? 0 : Math.Round(weekWorkouts.Average(x => x.Intensity), 2),
                AvgFatigue = weekWorkouts.Count == 0 ? 0 : Math.Round(weekWorkouts.Average(x => x.Fatigue), 2),
            };
        }).ToList();

        return Ok(result);
    }

    private static List<(DateTime start, DateTime endInclusive)> BuildWeeksForMonth(DateTime monthStart, DateTime monthEndExclusive)
    {
        // Week starts Monday
        static DateTime StartOfWeekMonday(DateTime d)
        {
            var diff = (7 + (int)d.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            return d.Date.AddDays(-diff);
        }

        var firstWeekStart = StartOfWeekMonday(monthStart);
        var lastDayInclusive = monthEndExclusive.AddDays(-1).Date;
        var weeks = new List<(DateTime start, DateTime endInclusive)>();

        var cursor = firstWeekStart;
        while (cursor <= lastDayInclusive)
        {
            var end = cursor.AddDays(6).Date;

            
            var startClamped = cursor < monthStart.Date ? monthStart.Date : cursor;
            var endClamped = end > lastDayInclusive ? lastDayInclusive : end;

            weeks.Add((startClamped, endClamped));
            cursor = cursor.AddDays(7);
        }

        return weeks;
    }
}
