using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using LearningStarter.Entities;
using LearningStarter.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.Extensions.Configuration;
using LearningStarter.Common;
using Microsoft.AspNetCore.Identity;


namespace LearningStarter.Controllers;

    [ApiController]
    [Route("api/GrammarPractice")]
    public class GrammarPracticeController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly DataContext _db;
        private readonly string _colabBase;

        public GrammarPracticeController(
            IHttpClientFactory httpFactory,
            IConfiguration config,
            DataContext db)
        {
            _http = httpFactory.CreateClient();
            _db = db;
            _colabBase = config["ColabBase"] ?? ""; 
        }

        [HttpPost("correct")]
        public async Task<IActionResult> Correct([FromBody] JsonElement body)
        {
            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var res = await _http.PostAsync($"{_colabBase}/correct", content);
            var result = await res.Content.ReadAsStringAsync();
            return Content(result, "application/json");
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] JsonElement body)
        {
            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var res = await _http.PostAsync($"{_colabBase}/practice/generate", content);
            var result = await res.Content.ReadAsStringAsync();
            return Content(result, "application/json");
        }

        public class SaveRequest
        {
            public int UserId { get; set; } 
            public string Topic { get; set; } 
            public string Prompt { get; set; } 
            public string Answer { get; set; } 
            public string Feedback { get; set; } 
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] SaveRequest req)
        {
            var item = new PracticeAttempt
            {
                UserId = req.UserId,
                Topic = req.Topic,
                Prompt = req.Prompt,
                Answer = req.Answer,
                Feedback = req.Feedback,
                Date = DateTime.Now
            };

            _db.PracticeAttempts.Add(item);
            await _db.SaveChangesAsync();

            return Ok(new { success = true, id = item.Id });
        }
 
        [HttpGet("history/{userId}")]
        public async Task<IActionResult> History(int userId)
        {
            var data = await _db.PracticeAttempts
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.Date)
                .ToListAsync();

            return Ok(data);
        }

        [HttpDelete("{id}")]
        
        public async Task<IActionResult> Delete(int id)
        {
            var response = new Response();

            var practiceAttempt = _db.PracticeAttempts.FirstOrDefault(x => x.Id == id);

            if (practiceAttempt == null)
            {
                response.AddError("id", "There was a problem deleting the practice attempt record.");
                return NotFound(response);
            }

            _db.PracticeAttempts.Remove(practiceAttempt);
            await _db.SaveChangesAsync();

            return Ok(response);
        }
    }
