using System.ComponentModel.DataAnnotations;
using Group8.LabEms.Api.DTO.EquipmentStatus;
using Group8.LabEms.Api.Models.Equipments;

namespace Group8.LabEms.Api.DTO.Equipments
{
    public class AddEquipmentDTO
    {
        [Required]
        [StringLength(255, ErrorMessage = "Name too long")]
        public required string Name { get; set; }

        public required bool Availability { get; set; } = true;
        //foreign key to Equipment status

        public int EquipmentStatusId { get; set; }
        // public required EquipmentStatusDTO EquipmentStatus { get; set; }
        //foreign key to Equipment type
        public int EquipmentTypeId { get; set; }
        // public required EquipmentType EquipmentType { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}