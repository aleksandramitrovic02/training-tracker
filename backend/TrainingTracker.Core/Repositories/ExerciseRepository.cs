using Microsoft.EntityFrameworkCore;
using TrainingTracker.Core.Interfaces;
using TrainingTracker.Domain.Data;
using TrainingTracker.Domain.Models;

namespace TrainingTracker.Infrastructure.Repositories;

public class ExerciseRepository : IExerciseRepository
{
    private readonly AppDbContext _db;

    public ExerciseRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Exercise>> GetByUserAsync(Guid userId, CancellationToken ct)
        => _db.Exercises
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);

    public Task<Exercise?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken ct)
        => _db.Exercises
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

    public Task<bool> ExistsByNameAsync(Guid userId, string name, CancellationToken ct)
        => _db.Exercises
            .AnyAsync(x => x.UserId == userId && x.Name == name, ct);

    public Task<bool> ExistsByNameExcludingIdAsync(Guid userId, string name, Guid excludeId, CancellationToken ct)
        => _db.Exercises
            .AnyAsync(x => x.UserId == userId && x.Name == name && x.Id != excludeId, ct);

    public Task AddAsync(Exercise exercise, CancellationToken ct)
        => _db.Exercises.AddAsync(exercise, ct).AsTask();

    public void Update(Exercise exercise) => _db.Exercises.Update(exercise);

    public void Delete(Exercise exercise) => _db.Exercises.Remove(exercise);

    public Task<bool> IsUsedInWorkoutsAsync(Guid userId, Guid exerciseId, CancellationToken ct)
        => _db.Workouts
            .AnyAsync(w => w.UserId == userId && w.ExerciseId == exerciseId, ct);

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
