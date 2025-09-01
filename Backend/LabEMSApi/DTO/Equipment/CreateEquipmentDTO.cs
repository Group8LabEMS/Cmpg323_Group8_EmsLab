using System.ComponentModel.DataAnnotations;
using LabEMSApi.Models;


namespace LabEMSApi.DTO.Equipment
{
    public class CreateEquipmentDTO
    {

        public const int MaxStringLength = 255;        //Default value for string length

        [Required]
        [StringLength(MaxStringLength, ErrorMessage = "Name too long")]
        public required String Name { get; set; }

        [Required]
        [StringLength(MaxStringLength, ErrorMessage = "Type too long")]
        public required String Type { get; set; }       //clarify if we wont have a Type Entity => 1:M

        [Required]
        public required EquipmentStatus Status { get; set; } = EquipmentStatus.Available;

        [Required]
        public required EquipmentAvailability Availability { get; set; } = EquipmentAvailability.Available;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

   
}