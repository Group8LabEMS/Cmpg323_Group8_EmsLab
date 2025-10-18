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

        [Required]
        [Column("sso_id")]
        public string SsoId { get; set; } = null!;

        [Required]
        [Column("display_name")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string DisplayName { get; set; } = null!;

        [Required]
        [Column("email")]
        [StringLength(300, ErrorMessage = "entry too long")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = null!;

        [Required]
        [Column("password")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;

        [Column("created_at")]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation collections
        public ICollection<UserRoleModel> UserRoles { get; set; } = new List<UserRoleModel>();
        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public ICollection<AuditLogModel> AuditLogs { get; set; } = new List<AuditLogModel>();
    }
}
