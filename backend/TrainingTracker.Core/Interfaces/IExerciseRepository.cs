using TrainingTracker.Domain.Models;

namespace TrainingTracker.Core.Interfaces;

public interface IExerciseRepository
{
    Task<List<Exercise>> GetByUserAsync(Guid userId, CancellationToken ct);
    Task<Exercise?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken ct);

    Task<bool> ExistsByNameAsync(Guid userId, string name, CancellationToken ct);
    Task<bool> ExistsByNameExcludingIdAsync(Guid userId, string name, Guid excludeId, CancellationToken ct);

    Task AddAsync(Exercise exercise, CancellationToken ct);
    void Update(Exercise exercise);
    void Delete(Exercise exercise);

    Task<bool> IsUsedInWorkoutsAsync(Guid userId, Guid exerciseId, CancellationToken ct);

    Task SaveChangesAsync(CancellationToken ct);
}
