using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class AuditLogModel
    {
        public int auditlog_Id { get; set; }
        public DateTime timestamp { get; set; }

        public int user_id { get; set; }
        public UserModel user { get; set; } = null!;

        public required string action { get; set; }
        public required string entity_type { get; set; }
        public required int entity_id { get; set; }

        public string? details { get; set; } //json stored as string at runtime
    }
}