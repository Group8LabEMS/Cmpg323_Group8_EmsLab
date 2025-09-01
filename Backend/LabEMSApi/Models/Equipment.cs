namespace LabEMSApi.Models
{
    /*
        HOLD THE EQUIPMENT DETAILS AS PER ERD
        STATUS AND AVAILABILITY TO BE REVISITED 
        TO CHECK IF THEY CAN BE ENUMS OR BOOLEANS
    */
    public class Equipment
    {
        public int Id { get; set; }
        public required String Name { get; set; }
        public required String Type { get; set; }
        public EquipmentStatus Status { get; set; } = EquipmentStatus.Available;
        public EquipmentAvailability Availability { get; set; } = EquipmentAvailability.Available;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

    public enum EquipmentStatus
    {
        // clarify in the meeting the status values
        Available = 1,
        Unavailable,
        InMaintenance
    }

    public enum EquipmentAvailability
    {
        Available = 1,      //user can book it
        Unavailable,    //currently booked by another user
        InMaintenance   // still being maintained
    }
}