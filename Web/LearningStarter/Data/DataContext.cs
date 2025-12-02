using System.Reflection;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Data;

public sealed class DataContext : IdentityDbContext<User, Role, int>
{
    public DbSet<DailyChallenge> DailyChallenges { get; set; }
    public DbSet<LearningResource> LearningResources { get; set; }
    public DbSet<PracticeAttempt> PracticeAttempts { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).GetTypeInfo().Assembly);
    }
}
