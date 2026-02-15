using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingTracker.Api.DTOs.Exercises;
using TrainingTracker.Api.Extensions;
using TrainingTracker.Core.Interfaces;
using TrainingTracker.Domain.Models;

namespace TrainingTracker.Api.Controllers;

[ApiController]
[Route("api/exercises")]
[Authorize]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseRepository _exerciseRepository;

    public ExercisesController(IExerciseRepository exerciseRepository)
    {
        _exerciseRepository = exerciseRepository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExerciseResponseDto>>> GetMy(CancellationToken ct)
    {
        var userId = User.GetUserId();

        var items = await _exerciseRepository.GetByUserAsync(userId, ct);

        return Ok(items.Select(x => new ExerciseResponseDto
        {
            Id = x.Id,
            Name = x.Name
        }).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<ExerciseResponseDto>> Create([FromBody] CreateExerciseRequestDto dto, CancellationToken ct)
    {
        var name = (dto.Name ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Name is required." });

        if (name.Length > 100)
            return BadRequest(new { message = "Name must be <= 100 characters." });

        var userId = User.GetUserId();

        var exists = await _exerciseRepository.ExistsByNameAsync(userId, name, ct);
        if (exists)
            return Conflict(new { message = "Exercise already exists." });

        var ex = new Exercise
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = name,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _exerciseRepository.AddAsync(ex, ct);
        await _exerciseRepository.SaveChangesAsync(ct);

        return Ok(new ExerciseResponseDto { Id = ex.Id, Name = ex.Name });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExerciseResponseDto>> Update(Guid id, [FromBody] UpdateExerciseRequestDto dto, CancellationToken ct)
    {
        var name = (dto.Name ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Name is required." });

        if (name.Length > 100)
            return BadRequest(new { message = "Name must be <= 100 characters." });

        var userId = User.GetUserId();

        var ex = await _exerciseRepository.GetByIdForUserAsync(id, userId, ct);
        if (ex == null) return NotFound();

        var exists = await _exerciseRepository.ExistsByNameExcludingIdAsync(userId, name, id, ct);
        if (exists)
            return Conflict(new { message = "Exercise already exists." });

        ex.Name = name;

        _exerciseRepository.Update(ex);
        await _exerciseRepository.SaveChangesAsync(ct);

        return Ok(new ExerciseResponseDto { Id = ex.Id, Name = ex.Name });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = User.GetUserId();

        var ex = await _exerciseRepository.GetByIdForUserAsync(id, userId, ct);
        if (ex == null) return NotFound();

        var used = await _exerciseRepository.IsUsedInWorkoutsAsync(userId, id, ct);
        if (used)
            return Conflict(new { message = "Exercise is used in workouts and cannot be deleted." });

        _exerciseRepository.Delete(ex);
        await _exerciseRepository.SaveChangesAsync(ct);

        return NoContent();
    }
}
