using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class MaintenanceModel
    {
        public int maintenance_id { get; set; }

        public int equipment_id { get; set; }
        public EquipmentModel Equipment { get; set; } = null!;

        public int maintenance_type_id { get; set; }
        public MaintenanceTypeModel MaintenanceType { get; set; } = null!;
        
        public int maintenance_status_id { get; set; }
        public MaintenanceStatusModel MaintenanceStatus { get; set; } = null!;

        public DateTime scheduled_for { get; set; }
        public DateTime? started_at { get; set; }
        public DateTime? completed_at { get; set; }
    }

}