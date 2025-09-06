using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class MaintenanceStatusModel
    {
        public int maintenance_status_id { get; set; }
        public required string name { get; set; }
        public string? description { get; set; }

        public ICollection<MaintenanceModel> Maintenances { get; set; } = new List<MaintenanceModel>();
    }
}