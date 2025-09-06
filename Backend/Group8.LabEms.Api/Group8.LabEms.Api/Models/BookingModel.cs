using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class BookingModel
    {
        public int booking_id { get; set; }

        public int user_id { get; set; }
        public UserModel User { get; set; } = null!;

        public int equipment_id { get; set; }
        public EquipmentModel Equipment { get; set; } = null!;
        
        public int booking_status_id { get; set; }
        public BookingStatusModel BookingStatus { get; set; } = null!;

        public DateTime from_date { get; set; }
        public DateTime to_date { get; set; }
        public string? notes { get; set; }
        public DateTime created_date { get; set; }

    }

}