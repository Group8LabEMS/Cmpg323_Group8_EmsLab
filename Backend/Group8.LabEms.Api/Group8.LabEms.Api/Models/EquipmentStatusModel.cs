using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class EquipmentStatusModel
    {
        public int equipment_status_id { get; set; }
        public required string name { get; set; }
        public string? description { get; set; }

        public ICollection<EquipmentModel> Equipments { get; set; } = new List<EquipmentModel>();
    }
}