using TrainingTracker.Domain.Models;

namespace TrainingTracker.Core.Interfaces;

public interface IWorkoutRepository
{
    Task<Workout?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<IReadOnlyList<Workout>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);

    Task AddAsync(Workout workout, CancellationToken ct = default);
    void Update(Workout workout);
    void Delete(Workout workout);
    Task SaveChangesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Workout>> GetByUserAndDateRangeAsync(
    Guid userId,
    DateTime fromInclusive,
    DateTime toExclusive,
    CancellationToken ct = default);

}
