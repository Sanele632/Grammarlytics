using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearningStarter.Services;

namespace LearningStarter.Controllers;



[ApiController]
[Route("api/daily-challenges")]
public class DailyChallengesController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IAIChallengeService _aiChallengeService;

    public DailyChallengesController(DataContext context, IAIChallengeService aiChallengeService)
    {
        _context = context;
        _aiChallengeService = aiChallengeService;
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetTodaysChallenge()
    {
        var response = new Response();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Check if today's challenge exists
        var challenge = await _context.DailyChallenges.FirstOrDefaultAsync(x => x.Date == today);

        // Generate a new one if missing
        if (challenge == null)
        {
            var (incorrect, correct) = await _aiChallengeService.GenerateChallengeAsync();

            challenge = new DailyChallenge
            {
                Date = today,
                IncorrectSentence = incorrect,
                CorrectSentence = correct
            };

            _context.DailyChallenges.Add(challenge);
            await _context.SaveChangesAsync();
        }

        response.Data = new DailyChallengeGetDto
        {
            Id = challenge.Id,
            Date = challenge.Date,
            IncorrectSentence = challenge.IncorrectSentence,
            CorrectSentence = challenge.CorrectSentence
        };

        return Ok(response);
    }
    
    
    [HttpPost("submit")]
    public async Task<IActionResult> SubmitAnswer([FromBody] DailyChallengeSubmitDto submission)
    {
        var response = new Response();
        var challenge = await _context.DailyChallenges.FindAsync(submission.ChallengeId);
        var user = await _context.Users.FindAsync(submission.UserId);
        
        if (challenge == null || user == null)
        {
            response.AddError("", "Invalid user or challenge.");
            return BadRequest(response);
        }

        var isCorrect = !string.IsNullOrEmpty(submission.UserAnswer) &&
                !string.IsNullOrEmpty(challenge.CorrectSentence) &&
                string.Equals(
                    submission.UserAnswer.Trim(),
                    challenge.CorrectSentence.Trim(),
                    StringComparison.OrdinalIgnoreCase
                );

        if (isCorrect)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var yesterday = today.AddDays(-1);

            if (user.LastChallengeDate == yesterday)
            {
                user.StreakCount++;
            }
            else if (user.LastChallengeDate != today)
            {
                user.StreakCount = 1;
            }
            
            user.LastChallengeDate = today;
            await _context.SaveChangesAsync();
        }

        response.Data = new
        {
            wasCorrect = isCorrect,
            newStreakCount = user.StreakCount
        };
        
        return Ok(response);
    }
}


