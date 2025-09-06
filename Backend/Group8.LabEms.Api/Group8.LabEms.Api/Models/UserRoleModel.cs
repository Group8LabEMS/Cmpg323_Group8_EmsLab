using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{ 
    public class UserRoleModel
    {
        public int User_Id { get; set; }
        public UserModel User { get; set; } = null!;

        public int Role_Id { get; set; }
        public RoleModel Role { get; set; } = null!;
    }

}