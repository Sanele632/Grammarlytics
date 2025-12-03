using System.Threading.Tasks;

namespace LearningStarter.Services;
public interface IGrammarChatService
{
    Task<string> AskAsync(string question);
}

public class GrammarChatService : IGrammarChatService
{
    private readonly IAzureOpenAIService _ai;

    public GrammarChatService(IAzureOpenAIService ai)
    {
        _ai = ai;
    }

    public async Task<string> AskAsync(string question)
    {
        var messages = new[]
        {
            ("system", "You are a grammar tutor. Format your responses using Markdown. Use bullet points, headings, and short paragraphs."),
            ("user", question)
        };

        return await _ai.GetChatCompletionAsync(messages);
    }
}
