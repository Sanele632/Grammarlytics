using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class PracticeAttempt
{
    public int Id { get; set; }

    public int UserId { get; set; } 
    public User? User { get; set; }

    public string Topic { get; set; } 

    public string Prompt { get; set; } 

    public string Answer { get; set; } 

    public string Feedback { get; set; } 
    public DateTime Date { get; set; } = DateTime.Now;
}

public class PracticeAttemptGetDto
{
    public int Id { get; set; }

    public int UserId { get; set; } 

    public string Topic { get; set; } 

    public string Prompt { get; set; } 

    public string Answer { get; set; } 

    public string Feedback { get; set; } 

    public DateTime Date { get; set; } = DateTime.Now;
}

public class PracticeAttemptEntityConfiguration : IEntityTypeConfiguration<PracticeAttempt>
{
    public void Configure(EntityTypeBuilder<PracticeAttempt> builder)
    {
        builder.HasOne(pa => pa.User)
            .WithMany()
            .HasForeignKey(pa => pa.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

