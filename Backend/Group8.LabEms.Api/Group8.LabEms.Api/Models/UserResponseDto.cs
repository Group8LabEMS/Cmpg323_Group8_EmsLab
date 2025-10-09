using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string SsoId { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Role { get; set; }
    }

    public class UserCreateUpdateDto
    {
        [Required]
        public string SsoId { get; set; } = null!;
        [Required]
        public string DisplayName { get; set; } = null!;
        [Required]
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public string? Role { get; set; }
    }
}