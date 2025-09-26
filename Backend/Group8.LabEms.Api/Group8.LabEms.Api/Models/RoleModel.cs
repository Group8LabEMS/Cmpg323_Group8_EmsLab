using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("role")]
    public class RoleModel
    {
        [Key]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Required]
        [Column("name")]
        public required string Name { get; set; }

        public ICollection<UserRoleModel> UserRoles { get; set; } = new List<UserRoleModel>();
    }
}