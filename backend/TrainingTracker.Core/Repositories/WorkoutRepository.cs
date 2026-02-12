using Microsoft.EntityFrameworkCore;
using TrainingTracker.Core.Interfaces;
using TrainingTracker.Domain.Data;
using TrainingTracker.Domain.Models;

namespace TrainingTracker.Core.Repositories;

public class WorkoutRepository : IWorkoutRepository
{
    private readonly AppDbContext _context;

    public WorkoutRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Workout?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Workouts
            .FirstOrDefaultAsync(w => w.Id == id, ct);
    }

    public async Task<IReadOnlyList<Workout>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await _context.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.WorkoutDateTime)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Workout workout, CancellationToken ct = default)
    {
        await _context.Workouts.AddAsync(workout, ct);
    }

    public void Update(Workout workout)
    {
        _context.Workouts.Update(workout);
    }

    public void Delete(Workout workout)
    {
        _context.Workouts.Remove(workout);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}
