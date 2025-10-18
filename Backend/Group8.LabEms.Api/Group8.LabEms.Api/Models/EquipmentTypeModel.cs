using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("equipment_type")]
    public class EquipmentTypeModel
    {
        [Key]
        [Column("equipment_type_id")]
        public int EquipmentTypeId { get; set; }

        [Required]
        [Column("name")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string? Description { get; set; }

        public ICollection<EquipmentModel> Equipments { get; set; } = new List<EquipmentModel>();
    }
}