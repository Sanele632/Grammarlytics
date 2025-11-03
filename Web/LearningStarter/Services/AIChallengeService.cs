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
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _endpoint;
    private readonly string _deployment;
    private readonly string _apiVersion;

    public AIChallengeService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClient = httpClientFactory.CreateClient();

        _apiKey = configuration["AzureOpenAI:Key"] 
                  ?? throw new InvalidOperationException("Azure OpenAI API key not configured.");

        _endpoint = configuration["AzureOpenAI:Endpoint"] 
                    ?? throw new InvalidOperationException("Azure OpenAI endpoint not configured.");

        _deployment = configuration["AzureOpenAI:DeploymentName"] 
                      ?? throw new InvalidOperationException("Azure OpenAI deployment not configured.");

        _apiVersion = configuration["AzureOpenAI:ApiVersion"] 
                      ?? "2024-12-01-preview"; // default
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

        // Prepare request
        var url = $"{_endpoint}/openai/deployments/{_deployment}/chat/completions?api-version={_apiVersion}";

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

        var requestBody = new
        {
            messages = new[]
            {
                new { role = "system", content = "You are a grammar challenge generator." },
                new { role = "user", content = prompt }
            },
            max_tokens = 500,
            temperature = 0.7
        };

        var response = await _httpClient.PostAsJsonAsync(url, requestBody);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        // Extract the content returned by the model
        var content = doc.RootElement
                         .GetProperty("choices")[0]
                         .GetProperty("message")
                         .GetProperty("content")
                         .GetString();

        if (string.IsNullOrWhiteSpace(content))
            throw new InvalidOperationException("Azure OpenAI returned empty content.");

        // Parse the JSON from model
        using var parsed = JsonDocument.Parse(content);
        var incorrect = parsed.RootElement.GetProperty("incorrect").GetString()!;
        var correct = parsed.RootElement.GetProperty("correct").GetString()!;

        return (incorrect, correct);
    }
}