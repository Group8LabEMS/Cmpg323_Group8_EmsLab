using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class UserModel
    {
        public int UserId { get; set; }
        public required string SsoId { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<UserRoleModel> UserRoles { get; set; } = new List<UserRoleModel>();
        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public ICollection<AuditLogModel> AuditLogs { get; set; } = new List<AuditLogModel>();
    }
}
