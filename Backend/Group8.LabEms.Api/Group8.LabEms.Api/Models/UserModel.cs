using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("user")]
    public class UserModel
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        // [Required]
        [Column("sso_id")]
        public string? SsoId { get; set; }

        // [Required]
        [Column("display_name")]
        public string DisplayName { get; set; } = null!;

        [Required]
        [Column("email")]
        [EmailAddress]
        public string Email { get; set; } = null!;


        [Required]
        [Column("password")]
        public string Password { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation collections
        public ICollection<UserRoleModel> UserRoles { get; set; } = new List<UserRoleModel>();
        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public ICollection<AuditLogModel> AuditLogs { get; set; } = new List<AuditLogModel>();
    }
}
