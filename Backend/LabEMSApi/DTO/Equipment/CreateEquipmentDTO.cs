using System.ComponentModel.DataAnnotations;


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
        public required EquipmentStatus Status { get; set; } = EquipmentStatus.Status1;

        [Required]
        public required EquipmentAvailability Availability { get; set; } = EquipmentAvailability.Available;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

    public enum EquipmentStatus
    {
        // clarify in the meeting the status values
        Status1 = 1,
        Status2
    }

    public enum EquipmentAvailability
    {
        Available = 1,      //user can book it
        Unavailable,    //currently booked by another user
        InMaintenance   // still being maintained
    }
}