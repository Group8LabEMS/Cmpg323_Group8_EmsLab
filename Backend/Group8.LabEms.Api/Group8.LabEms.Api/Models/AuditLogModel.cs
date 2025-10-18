using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("audit_log")]
    public class AuditLogModel
    {
        [Key]
        [Column("auditlog_id")]

        public int AuditLogId { get; set; }

        [Column("timestamp")]
        public DateTime TimeStamp { get; set; }

        [Column("user_id")]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public UserModel User { get; set; } = null!;

        [Required]
        [Column("action")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string Action { get; set; } = string.Empty;

        [Required]
        [Column("entity_type")]
        public string EntityType { get; set; } = string.Empty;

        [Required]
        [Column("entity_id")]
        public int EntityId { get; set; }

        [Column("details")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string? Details { get; set; } // JSON stored as string at runtime
    }
}