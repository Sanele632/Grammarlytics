using System;
using System;
using System.ComponentModel.DataAnnotations;

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
