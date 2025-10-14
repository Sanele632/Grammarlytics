using System.Linq;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/learning-resources")]
public class LearningResourcesController : ControllerBase
{
    private readonly DataContext _context;

    public LearningResourcesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = new Response();
        response.Data = await _context.LearningResources
            .Select(x => new LearningResourceGetDto
            {
                Id = x.Id,
                Topic = x.Topic,
                Content = x.Content
            })
            .ToListAsync();
        return Ok(response);
    }
}
 


