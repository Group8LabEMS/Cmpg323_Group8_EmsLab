using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class BookingStatusModel
    {
        public int booking_status_id { get; set; }
        public required string name { get; set; }
        public string? description { get; set; }

        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();

    }
}