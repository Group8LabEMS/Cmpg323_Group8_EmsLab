using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Group8.LabEms.Api.DTO.EquipmentStatus;
using Group8.LabEms.Api.Models.Equipments;

namespace Group8.LabEms.Api.DTO.Equipments
{
    public class AddEquipmentDTO
    {
        [Key]
        [Column("equipment_id")]
        public int Id { get; set; }
        [Column("name")]
        public required string Name { get; set; }
        [Column("availability")]
        public required bool Availability { get; set; } = true;
        //foreign key to Equipment status
        // 
        [Column("equipment_status_id")]
        public int EquipmentStatusId { get; set; }
        // public required EquipmentStatus EquipmentStatus { get; set; }
        //foreign key to Equipment type
        [Column("equipment_type_id")]
        public int EquipmentTypeId { get; set; }
        // public required EquipmentType EquipmentType { get; set; }
        [Column("created_date")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}