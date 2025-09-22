using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("equipment_status")]
    public class EquipmentStatusModel
    {
        [Key]
        [Column("equipment_status_id")]
        public int EquipmentStatusId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        public ICollection<EquipmentModel> Equipments { get; set; } = new List<EquipmentModel>();
    }
}