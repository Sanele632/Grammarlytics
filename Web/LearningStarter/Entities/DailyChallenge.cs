using System;
using System.ComponentModel.DataAnnotations;

namespace LearningStarter.Entities;

public class DailyChallenge
{
    [Key]
    public int Id { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public string IncorrectSentence { get; set; }

    [Required]
    public string CorrectSentence { get; set; }
}

public class DailyChallengeGetDto
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public string IncorrectSentence { get; set; }
}

public class DailyChallengeSubmitDto
{
    [Required]
    public int ChallengeId { get; set; }
    
    [Required]
    public string UserAnswer { get; set; }
}


