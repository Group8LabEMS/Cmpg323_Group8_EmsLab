using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("user_role")]
    public class UserRoleModel
    {

        [Column("user_id")]
        public int UserId { get; set; }
        public UserModel User { get; set; } = null!;

        [Column("role_id")]
        public int RoleId { get; set; }
        public RoleModel Role { get; set; } = null!;

        public ICollection<UserModel> Users { get; set; } = null!;

        public ICollection<RoleModel> Roles { get; set; } = null!; 
    }
}