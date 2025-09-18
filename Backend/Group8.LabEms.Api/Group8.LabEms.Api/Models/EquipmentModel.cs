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
        public int EquipmentTypeId { get; set; }

        [ForeignKey(nameof(EquipmentTypeId))]
        public EquipmentTypeModel EquipmentType { get; set; } = null!;

        [Column("equipment_status_id")]
        public int EquipmentStatusId { get; set; }

        [ForeignKey(nameof(EquipmentStatusId))]
        public EquipmentStatusModel EquipmentStatus { get; set; } = null!;

        [Column("availability")]
        public string? Availability { get; set; }

        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        // Navigation collections
        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public ICollection<MaintenanceModel> Maintenances { get; set; } = new List<MaintenanceModel>();
    }
}
