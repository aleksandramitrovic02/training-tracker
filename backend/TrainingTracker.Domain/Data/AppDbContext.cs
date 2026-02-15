using Microsoft.EntityFrameworkCore;
using TrainingTracker.Domain.Models;

namespace TrainingTracker.Domain.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Exercise> Exercises => Set<Exercise>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
           .HasIndex(u => u.Email)
           .IsUnique();
        modelBuilder.Entity<Exercise>(b =>
        {
            b.Property(x => x.Name).HasMaxLength(100).IsRequired();
            b.HasIndex(x => new { x.UserId, x.Name }).IsUnique(); 
        });

        modelBuilder.Entity<Workout>(b =>
        {
            b.HasOne(x => x.Exercise)
             .WithMany()
             .HasForeignKey(x => x.ExerciseId)
             .OnDelete(DeleteBehavior.Restrict);
        });

    }
}
