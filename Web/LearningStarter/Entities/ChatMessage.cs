using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace LearningStarter.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;   

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Link the message to a user
        public string UserId { get; set; } = default!;
        public IdentityUser? User { get; set; }
    }
}
