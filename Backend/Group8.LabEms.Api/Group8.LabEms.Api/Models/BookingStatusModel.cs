using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("booking_status")]
    public class BookingStatusModel
    {
        [Key]
        [Column("booking_status_id")]
        public int BookingStatusId { get; set; }
        [Column("name")]
        public required string name { get; set; }
        [Column("description")]
        public string? description { get; set; }

        //public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();

    }
}