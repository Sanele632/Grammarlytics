using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;

namespace LearningStarter.Services;

public interface IAIChallengeService
{
    Task<(string Incorrect, string Correct)> GenerateChallengeAsync();
}

public class AIChallengeService : IAIChallengeService
{
    private readonly IAzureOpenAIService _ai;

    public AIChallengeService(IAzureOpenAIService ai)
    {
        _ai = ai;
    }

    public async Task<(string Incorrect, string Correct)> GenerateChallengeAsync()
    {
        var prompt = """
        You are a grammar challenge generator for college-level students.

        Generate a single English sentence that contains an **advanced grammatical error**—not a simple spelling or capitalization mistake. 
        The error should involve one of the following areas:
        - advanced verb tense usage (e.g., subjunctive mood, past perfect continuous)
        - parallelism
        - conditional sentences
        - misplaced modifiers
        - pronoun reference
        - punctuation in complex or compound sentences
        - academic vocabulary misuse or word form confusion

        Then, provide the **corrected version** of the same sentence.

        Respond in **valid JSON format only**, with this exact structure:
        {
        "incorrect": "...",
        "correct": "..."
        }
        """;

        var result = await _ai.GetChatCompletionAsync(new[]
        {
            ("system", "You are a grammar challenge generator."),
            ("user", prompt)
        });

        using var parsed = JsonDocument.Parse(result);
        var incorrect = parsed.RootElement.GetProperty("incorrect").GetString()!;
        var correct = parsed.RootElement.GetProperty("correct").GetString()!;

        return (incorrect, correct);
    }
}


