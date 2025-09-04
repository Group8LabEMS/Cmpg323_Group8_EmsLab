namespace Group8.LabEms.Api.Models.Equipments
{
    public class Equipment
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required bool Availability { get; set; } = true;
        //foreign key to Equipment status
        public int EquipmentStatusId { get; set; }
        // public required EquipmentStatus EquipmentStatus { get; set; }
        //foreign key to Equipment type
        public int EquipmentTypeId { get; set; }
        // public required EquipmentType EquipmentType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}