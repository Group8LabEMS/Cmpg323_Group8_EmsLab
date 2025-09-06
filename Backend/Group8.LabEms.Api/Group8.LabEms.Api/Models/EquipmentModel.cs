using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class EquipmentModel
    {
        public int equipment_id { get; set; }
        public required string name { get; set; }

        public int equipment_type_id { get; set; }
        public EquipmentTypeModel EquipmentType { get; set; } = null!;

        public int equipment_status_id { get; set; }
        public EquipmentStatusModel EquipmentStatus { get; set; } = null!;

        public string? availability { get; set; }
        public DateTime created_date { get; set; }

        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public ICollection<MaintenanceModel> Maintenances { get; set; } = new List<MaintenanceModel>();

    }

}