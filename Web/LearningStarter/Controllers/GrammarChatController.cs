using Microsoft.AspNetCore.Mvc;
using LearningStarter.Services;
using System.Threading.Tasks;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/grammar-chat")]
public class GrammarChatController : ControllerBase
{
    private readonly IGrammarChatService _chatService;

    public GrammarChatController(IGrammarChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] GrammarQuestionDto request)
    {
        var answer = await _chatService.AskAsync(request.Question);
        return Ok(new { answer });
    }
}

public class GrammarQuestionDto
{
    public string Question { get; set; } = string.Empty;
}