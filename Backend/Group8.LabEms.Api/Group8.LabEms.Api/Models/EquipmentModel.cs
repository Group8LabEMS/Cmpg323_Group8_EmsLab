using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("equipment")]
    public class EquipmentModel
    {
        [Key]
        [Column("equipment_id")]
        public int EquipmentId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("equipment_type_id")]
        [ForeignKey(nameof(EquipmentType))]
        public int EquipmentTypeId { get; set; }
    public EquipmentTypeModel? EquipmentType { get; set; }

        [Column("equipment_status_id")]
        [ForeignKey(nameof(EquipmentStatus))]
        public int EquipmentStatusId { get; set; }
    public EquipmentStatusModel? EquipmentStatus { get; set; }

        [Column("availability")]
        public string? Availability { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        // Navigation collections
        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public ICollection<MaintenanceModel> Maintenances { get; set; } = new List<MaintenanceModel>();
    }
}
