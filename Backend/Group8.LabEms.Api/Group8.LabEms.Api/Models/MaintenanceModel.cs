using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("maintenance")]
    public class MaintenanceModel
    {
        [Key]
        [Column("maintenance_id")]
        public int MaintenanceId { get; set; }

        [Column("equipment_id")]
        [ForeignKey(nameof(Equipment))]
        public int EquipmentId { get; set; }
        public EquipmentModel Equipment { get; set; } = null!;

        [Column("maintenance_type_id")]
        [ForeignKey(nameof(MaintenanceType))]
        public int MaintenanceTypeId { get; set; }
        public MaintenanceTypeModel MaintenanceType { get; set; } = null!;

        [Column("maintenance_status_id")]
        [ForeignKey(nameof(MaintenanceStatus))]
        public int MaintenanceStatusId { get; set; }
        public MaintenanceStatusModel MaintenanceStatus { get; set; } = null!;

        [Column("scheduled_for")]
        public DateTime ScheduledFor { get; set; }

        [Column("started_at")]
        public DateTime? StartedAt { get; set; }

        [Column("completed_at")]
        public DateTime? CompletedAt { get; set; }

        //ADD SOME VALIDATIONS
        public bool IsValid(out string err)
        {
            err = string.Empty;
            if(ScheduledFor < DateTime.UtcNow)
            
                err = "Scheduled date must be in the future";
                return string.IsNullOrEmpty(err);
            

        }
    }
}