using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingTracker.Api.DTOs.Workouts;
using TrainingTracker.Api.Extensions;
using TrainingTracker.Core.Interfaces;
using TrainingTracker.Domain.Enums;
using TrainingTracker.Domain.Models;

namespace TrainingTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutRepository _workoutRepository;

    public WorkoutsController(IWorkoutRepository workoutRepository)
    {
        _workoutRepository = workoutRepository;
    }

    [HttpGet("exercise-types")]
    public ActionResult<IEnumerable<ExerciseTypeDto>> GetExerciseTypes()
    {
        var exerciseTypes = Enum.GetValues<ExerciseType>()
            .Select(e => new ExerciseTypeDto
            {
                Value = (int)e,
                Name = e.ToString()
            })
            .ToList();

        return Ok(exerciseTypes);
    }

    [HttpGet("my")]
    public async Task<ActionResult<IReadOnlyList<WorkoutResponseDto>>> GetMy(CancellationToken ct)
    {
        var userId = User.GetUserId();

        var workouts = await _workoutRepository.GetByUserIdAsync(userId, ct);

        var result = workouts.Select(w => new WorkoutResponseDto
        {
            Id = w.Id,
            ExerciseType = w.ExerciseType,
            DurationMinutes = w.DurationMinutes,
            CaloriesBurned = w.CaloriesBurned,
            Intensity = w.Intensity,
            Fatigue = w.Fatigue,
            Notes = w.Notes,
            WorkoutDateTime = w.WorkoutDateTime
        }).ToList();

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutResponseDto>> Create([FromBody] CreateWorkoutRequestDto request, CancellationToken ct)
    {
        var validationError = ValidateCreate(request);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var userId = User.GetUserId();

        var workout = new Workout
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ExerciseType = request.ExerciseType,
            DurationMinutes = request.DurationMinutes,
            CaloriesBurned = request.CaloriesBurned,
            Intensity = request.Intensity,
            Fatigue = request.Fatigue,
            Notes = request.Notes,
            WorkoutDateTime = request.WorkoutDateTime,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _workoutRepository.AddAsync(workout, ct);
        await _workoutRepository.SaveChangesAsync(ct);

        var response = new WorkoutResponseDto
        {
            Id = workout.Id,
            ExerciseType = workout.ExerciseType,
            DurationMinutes = workout.DurationMinutes,
            CaloriesBurned = workout.CaloriesBurned,
            Intensity = workout.Intensity,
            Fatigue = workout.Fatigue,
            Notes = workout.Notes,
            WorkoutDateTime = workout.WorkoutDateTime
        };

        return CreatedAtAction(nameof(GetMy), new { }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<WorkoutResponseDto>> Update(Guid id, [FromBody] UpdateWorkoutRequestDto request, CancellationToken ct)
    {
        var validationError = ValidateUpdate(request);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var userId = User.GetUserId();

        var workout = await _workoutRepository.GetByIdAsync(id, ct);
        if (workout == null) return NotFound();

        if (workout.UserId != userId) return Forbid();

        workout.ExerciseType = request.ExerciseType;
        workout.DurationMinutes = request.DurationMinutes;
        workout.CaloriesBurned = request.CaloriesBurned;
        workout.Intensity = request.Intensity;
        workout.Fatigue = request.Fatigue;
        workout.Notes = request.Notes;
        workout.WorkoutDateTime = request.WorkoutDateTime;

        _workoutRepository.Update(workout);
        await _workoutRepository.SaveChangesAsync(ct);

        return Ok(new WorkoutResponseDto
        {
            Id = workout.Id,
            ExerciseType = workout.ExerciseType,
            DurationMinutes = workout.DurationMinutes,
            CaloriesBurned = workout.CaloriesBurned,
            Intensity = workout.Intensity,
            Fatigue = workout.Fatigue,
            Notes = workout.Notes,
            WorkoutDateTime = workout.WorkoutDateTime
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = User.GetUserId();

        var workout = await _workoutRepository.GetByIdAsync(id, ct);
        if (workout == null) return NotFound();

        if (workout.UserId != userId) return Forbid();

        _workoutRepository.Delete(workout);
        await _workoutRepository.SaveChangesAsync(ct);

        return NoContent();
    }

    private static string? ValidateCreate(CreateWorkoutRequestDto r)
    {
        if (!Enum.IsDefined(typeof(ExerciseType), r.ExerciseType)) return "Invalid ExerciseType.";
        if (r.DurationMinutes <= 0) return "DurationMinutes must be greater than 0.";
        if (r.CaloriesBurned < 0) return "CaloriesBurned cannot be negative.";
        if (r.Intensity is < 1 or > 10) return "Intensity must be between 1 and 10.";
        if (r.Fatigue is < 1 or > 10) return "Fatigue must be between 1 and 10.";
        if (r.WorkoutDateTime == default) return "WorkoutDateTime is required.";
        return null;
    }

    private static string? ValidateUpdate(UpdateWorkoutRequestDto r)
    {
        if (!Enum.IsDefined(typeof(ExerciseType), r.ExerciseType)) return "Invalid ExerciseType.";
        if (r.DurationMinutes <= 0) return "DurationMinutes must be greater than 0.";
        if (r.CaloriesBurned < 0) return "CaloriesBurned cannot be negative.";
        if (r.Intensity is < 1 or > 10) return "Intensity must be between 1 and 10.";
        if (r.Fatigue is < 1 or > 10) return "Fatigue must be between 1 and 10.";
        if (r.WorkoutDateTime == default) return "WorkoutDateTime is required.";
        return null;
    }
}
