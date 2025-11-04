using System;
using System.Linq;
using System.Security.Claims;
using System.Collections.Generic;
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
        var today = DateOnly.FromDateTime(DateTime.Now);

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
            var today = DateOnly.FromDateTime(DateTime.Now);

            var weekStart = GetWeekStartDate(today);
            if (user.WeekStartDate != weekStart)
            {
                user.WeeklyProgress = "[\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\"]";
                user.WeekStartDate = weekStart;
            }

            if (user.LastChallengeDate == today)
            {
                // Already completed today's challenge - do nothing
            }
            else
            {
                var yesterday = today.AddDays(-1);

                if (user.LastChallengeDate == yesterday)
                {
                    user.StreakCount++;
                }
                else if (user.LastChallengeDate < yesterday || user.LastChallengeDate == null)
                {
                    user.StreakCount = 1;
                }

                UpdateWeeklyProgress(user, today, "correct");

                user.LastChallengeDate = today;
                await _context.SaveChangesAsync();
            }
        }
        else
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            if (user.LastChallengeDate != today)
            {
                var weekStart = GetWeekStartDate(today);
                if (user.WeekStartDate != weekStart)
                {
                    user.WeeklyProgress = "[\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\"]";
                    user.WeekStartDate = weekStart;
                }
                user.StreakCount = 0;
                UpdateWeeklyProgress(user, today, "wrong");
                await _context.SaveChangesAsync();
            }
        }

        response.Data = new
        {
            wasCorrect = isCorrect,
            newStreakCount = user.StreakCount,
            weeklyProgress = System.Text.Json.JsonSerializer.Deserialize<string[]>(user.WeeklyProgress)
        };
        
        return Ok(response);
    }

    private DateOnly GetWeekStartDate(DateOnly date)
    {
        var diff = (7 + (date.DayOfWeek - DayOfWeek.Sunday)) % 7;
        return date.AddDays(-1 * diff);
    }

    private void UpdateWeeklyProgress(User user, DateOnly date, string status)
    {
        var progress = System.Text.Json.JsonSerializer.Deserialize<List<string>>(user.WeeklyProgress)
                    ?? new List<string> { "idle", "idle", "idle", "idle", "idle", "idle", "idle" };

        while (progress.Count < 7)
        {
            progress.Add("idle");
        }

        var dayIndex = (int)date.DayOfWeek;
        progress[dayIndex] = status;
        user.WeeklyProgress = System.Text.Json.JsonSerializer.Serialize(progress);
    }

    [HttpGet("weekly-progress/{userId}")]
    public async Task<IActionResult> GetWeeklyProgress(int userId)
    {
        var response = new Response();
        var user = await _context.Users.FindAsync(userId);


        if (user == null)
        {
            response.AddError("", "User not found.");
            return BadRequest(response);
        }

        var today = DateOnly.FromDateTime(DateTime.Now);
        var weekStart = GetWeekStartDate(today);

        if (user.WeekStartDate != weekStart)
        {
            user.WeeklyProgress = "[\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\"]";
            user.WeekStartDate = weekStart;
            await _context.SaveChangesAsync();

            //Reset streak if user skipped entire previous week
            if (user.LastChallengeDate.HasValue && user.LastChallengeDate < weekStart)
            {
                user.StreakCount = 0;
            }
        }
        else
        {
            //Check if user skipped a day (only if they had a streak)
            if (user.LastChallengeDate.HasValue && user.StreakCount > 0)
            {
                var yesterday = today.AddDays(-1);
                
                //If last challenge was before yesterday, they skipped at least one day
                if (user.LastChallengeDate < yesterday)
                {
                    user.StreakCount = 0;
                }
            }
        }

        var weeklyProgress = System.Text.Json.JsonSerializer.Deserialize<string[]>(user.WeeklyProgress)
                            ?? new[] { "idle", "idle", "idle", "idle", "idle", "idle", "idle" };

        response.Data = new
        {
            weeklyProgress,
            weekStartDate = weekStart
        };

        return Ok(response);
    }


    [HttpPost("delete/{userId}")]
    public async Task<IActionResult> ClearStreak(int userId)
    {
        var response = new Response();
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
        {
            response.AddError("", "User not found.");
            return BadRequest(response);
        }

        // Clear streak data
        user.StreakCount = 0;
        user.LastChallengeDate = null;
        user.WeeklyProgress = "[\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\",\"idle\"]";
        user.WeekStartDate = GetWeekStartDate(DateOnly.FromDateTime(DateTime.Now));
        
        await _context.SaveChangesAsync();

        response.Data = new
        {
            message = "Streak history cleared successfully",
            newStreakCount = user.StreakCount
        };
        
        return Ok(response);
    }
}


