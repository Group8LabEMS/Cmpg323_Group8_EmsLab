using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.DTO.EquipmentStatus
{
    public class AddEquipmentStatusDTO
    {
        [Required]
        [StringLength(255, ErrorMessage = "Name too long")]
        public required string Name { get; set; }
        [Required]
        [StringLength(255, ErrorMessage = "Description too long")]
        public required string Description { get; set; }
    }
}