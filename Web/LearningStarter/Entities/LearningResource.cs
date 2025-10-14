using System.ComponentModel.DataAnnotations;

namespace LearningStarter.Entities;

public class LearningResource
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Topic { get; set; }

    [Required]
    public string Content { get; set; }
}

public class LearningResourceGetDto
{
    public int Id { get; set; }
    public string Topic { get; set; }
    public string Content { get; set; }
}
