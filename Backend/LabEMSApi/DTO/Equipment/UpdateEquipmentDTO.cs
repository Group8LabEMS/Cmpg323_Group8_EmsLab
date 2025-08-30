using System.ComponentModel.DataAnnotations;

namespace LabEMSApi.DTO.Equipment
{
    public class UpdateEquipmentDTO : CreateEquipmentDTO
    {
        [Required]
        public required int Id { get; set; }

    }

}