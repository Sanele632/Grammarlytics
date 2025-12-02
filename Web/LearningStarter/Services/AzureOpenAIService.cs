using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace LearningStarter.Services;

public interface IAzureOpenAIService
{
    Task<string> GetChatCompletionAsync(IEnumerable<(string role, string content)> messages, int maxTokens = 500);
}

public class AzureOpenAIService : IAzureOpenAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _endpoint;
    private readonly string _deployment;
    private readonly string _apiVersion;

    public AzureOpenAIService(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClient = httpClientFactory.CreateClient();
        _apiKey = config["AzureOpenAI:Key"]!;
        _endpoint = config["AzureOpenAI:Endpoint"]!;
        _deployment = config["AzureOpenAI:DeploymentName"]!;
        _apiVersion = config["AzureOpenAI:ApiVersion"] ?? "2024-12-01-preview";
    }

    public async Task<string> GetChatCompletionAsync(IEnumerable<(string role, string content)> messages, int maxTokens = 500)
    {
        var url = $"{_endpoint}/openai/deployments/{_deployment}/chat/completions?api-version={_apiVersion}";

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

        var requestBody = new
        {
            messages = messages.Select(m => new { role = m.role, content = m.content }),
            max_tokens = maxTokens,
            temperature = 0.7
        };

        var response = await _httpClient.PostAsJsonAsync(url, requestBody);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        return doc.RootElement
                  .GetProperty("choices")[0]
                  .GetProperty("message")
                  .GetProperty("content")
                  .GetString()!;
    }
}

