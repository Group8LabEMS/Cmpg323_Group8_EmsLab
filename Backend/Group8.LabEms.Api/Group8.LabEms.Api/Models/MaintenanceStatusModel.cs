using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("maintenance_status")]
    public class MaintenanceStatusModel
    {
        [Key]
        [Column("maintenance_status_id")]
        public int MaintenanceStatusId { get; set; }

        [Required]
        [Column("name")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public required string Name { get; set; }

        [Column("description")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string? Description { get; set; }

        public ICollection<MaintenanceModel> Maintenances { get; set; } = new List<MaintenanceModel>();
    }
}