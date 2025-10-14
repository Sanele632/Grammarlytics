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

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/daily-challenges")]
public class DailyChallengesController : ControllerBase
{
    private readonly DataContext _context;

    public DailyChallengesController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("today")]
    public async Task<IActionResult> GetTodaysChallenge()
    {
        var response = new Response();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var challenge = await _context.DailyChallenges
            .FirstOrDefaultAsync(x => x.Date == today);

        if (challenge == null)
        {
            response.AddError("", "No challenge available for today.");
            return NotFound(response);
        }

        var challengeDto = new DailyChallengeGetDto
        {
            Id = challenge.Id,
            Date = challenge.Date,
            IncorrectSentence = challenge.IncorrectSentence
        };

        response.Data = challengeDto;
        return Ok(response);
    }
    
    [Authorize]
    [HttpPost("submit")]
    public async Task<IActionResult> SubmitAnswer([FromBody] DailyChallengeSubmitDto submission)
    {
        var response = new Response();
        
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
        {
            response.AddError("", "User not authenticated properly.");
            return Unauthorized(response);
        }

        var user = await _context.Users.FindAsync(userId);
        var challenge = await _context.DailyChallenges.FindAsync(submission.ChallengeId);
        
        if (challenge == null || user == null)
        {
            response.AddError("", "Invalid user or challenge.");
            return BadRequest(response);
        }

        var isCorrect = string.Equals(
            submission.UserAnswer.Trim(), 
            challenge.CorrectSentence.Trim(), 
            StringComparison.OrdinalIgnoreCase);

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


